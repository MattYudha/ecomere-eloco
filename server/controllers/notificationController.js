const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get unread count
const getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
        res.json({ count });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ error: 'Error getting unread count' });
    }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');
        const { userId } = req.params;
        const { page = 1, limit = 10, type, isRead } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = { userId };

        if (type) where.type = type;
        if (isRead !== undefined) where.isRead = isRead === 'true';

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.notification.count({ where }),
        ]);

        res.json({
            notifications,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

// Create notification
const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type, priority, metadata } = req.body;

        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                priority: priority || 'NORMAL',
                metadata: metadata || {},
            },
        });

        // Emit socket event if io is available
        if (req.io) {
            req.io.to(userId).emit('newNotification', notification);
        }

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Error creating notification' });
    }
};

// Update notification
const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { isRead, metadata } = req.body;
        console.log(`[UPDATE NOTIF] ID: ${id}`);
        console.log(`[UPDATE NOTIF] Body:`, req.body);


        const updateData = {};
        if (isRead !== undefined) updateData.isRead = isRead;
        if (metadata !== undefined) updateData.metadata = metadata;

        const notification = await prisma.notification.update({
            where: { id },
            data: updateData,
        });

        res.json(notification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Error updating notification' });
    }
};

// Bulk mark as read
const bulkMarkAsRead = async (req, res) => {
    try {
        const { notificationIds, userId } = req.body;

        // If notificationIds provided, update specific ones
        // Otherwise update all unread for user
        const where = notificationIds
            ? { id: { in: notificationIds } }
            : { userId, isRead: false };

        await prisma.notification.updateMany({
            where,
            data: { isRead: true },
        });

        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notification.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Notification not found' });
        }
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Error deleting notification' });
    }
};

// Bulk delete notifications
const bulkDeleteNotifications = async (req, res) => {
    try {
        const { notificationIds } = req.body;

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({ error: 'Invalid notification IDs' });
        }

        await prisma.notification.deleteMany({
            where: {
                id: { in: notificationIds },
            },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error bulk deleting notifications:', error);
        res.status(500).json({ error: 'Error deleting notifications' });
    }
};

module.exports = {
    getUnreadCount,
    getUserNotifications,
    createNotification,
    updateNotification,
    bulkMarkAsRead,
    deleteNotification,
    bulkDeleteNotifications,
};
