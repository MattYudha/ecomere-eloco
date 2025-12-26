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

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserByEmail,
};
