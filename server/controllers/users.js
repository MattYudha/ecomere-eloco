const prisma = require('../utils/db');
const bcrypt = require('bcryptjs');
const { asyncHandler, AppError } = require('../utils/errorHandler');

// Helper function to exclude password from user object
function excludePassword(user) {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

const getAllUsers = asyncHandler(async (request, response) => {
  const users = await prisma.user.findMany({});
  // Exclude password from all users
  const usersWithoutPasswords = users.map((user) => excludePassword(user));
  return response.json(usersWithoutPasswords);
});

const createUser = asyncHandler(async (request, response) => {
  const { email, password, role } = request.body;

  // Basic validation
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }

  // Password validation
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 14);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role || 'user',
    },
  });
  // Exclude password from response
  return response.status(201).json(excludePassword(user));
});

const updateUser = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { email, password, role } = request.body;

  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // Prepare update data
  const updateData = {};
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }
    updateData.email = email;
  }
  if (password) {
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }
    updateData.password = await bcrypt.hash(password, 14);
  }
  if (role) {
    updateData.role = role;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: updateData,
  });

  // Exclude password from response
  return response.status(200).json(excludePassword(updatedUser));
  // Exclude password from response
  return response.status(200).json(excludePassword(updatedUser));
});

const updateUserProfile = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { name, phone, address } = request.body;

  if (!id) throw new AppError('User ID is required', 400);

  // Whitelist: Only allow name, phone, address updates
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;

  if (Object.keys(updateData).length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return response.status(200).json(excludePassword(updatedUser));
});

const deleteUser = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return response.status(204).send();
});

const getUser = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Exclude password from response
  return response.status(200).json(excludePassword(user));
});

const getUserByEmail = asyncHandler(async (request, response) => {
  console.log('HIT /users/email', request.params);

  try {
    const { email } = request.params;

    if (!email) {
      console.log('❌ Missing email param');
      return response.status(400).json({ message: 'Email is required' });
    }

    console.log(`🔍 Searching for primary email: ${email}`);

    // Try exact match first
    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Fallback: Case-insensitive search if strict match fails
    if (!user && email) {
      console.log(`⚠️ Primary search failed. Trying case-insensitive search for: ${email}`);
      user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive' // Requires Prisma support for the DB provider
          }
        }
      });
    }

    if (!user) {
      console.log(`❌ User NOT found for email: ${email}`);
      return response.status(404).json({ message: 'User not found' });
    }

    console.log(`✅ User found: ${user.id}`);

    // Explicitly return response
    const safeUser = excludePassword(user);
    return response.status(200).json(safeUser);

  } catch (error) {
    console.error('❌ CRITICAL ERROR in getUserByEmail:', error);
    // Ensure we return a response even on crash
    return response.status(500).json({
      message: 'Internal processing error',
      error: error.message
    });
  }
});


// ... inside file, define the function ...

const cloudinary = require('../utils/cloudinary');
const { nanoid } = require('nanoid');

const uploadAvatar = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) throw new AppError('User ID is required', 400);

  if (!request.files || Object.keys(request.files).length === 0) {
    throw new AppError('No image file uploaded', 400);
  }

  const uploadedFile = request.files.image; // 'image' matches FormData key in ProfileTab.tsx
  if (!uploadedFile) {
    throw new AppError('Field name must be "image"', 400);
  }

  // Upload to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'eloco/avatars',
      public_id: `avatar_${id}`,
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' } // optimize for avatar
      ]
    },
    async (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return response.status(500).json({ message: 'Error uploading image to Cloudinary' });
      }

      try {
        // Update user record with new image URL
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { image: result.secure_url }
        });

        // Explicitly return response inside callback to avoid timeout
        return response.status(200).json(excludePassword(updatedUser));
      } catch (dbError) {
        console.error('Database error:', dbError);
        return response.status(500).json({ message: 'Error saving image URL to database' });
      }
    }
  );

  uploadStream.end(uploadedFile.data);
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserByEmail,
  updateUserProfile,
  uploadAvatar,
};
