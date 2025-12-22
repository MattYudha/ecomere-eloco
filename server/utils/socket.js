const { Server } = require('socket.io');

let io;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: [
                    'https://elloco.vercel.app',
                    'http://localhost:3000',
                    'http://localhost:3001',
                    'https://eloco.vercel.app',
                    process.env.FRONTEND_URL,
                    process.env.NEXTAUTH_URL,
                ].filter(Boolean),
                methods: ['GET', 'POST'],
                credentials: true
            },
            transports: ['websocket'],
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('join_user_room', (userId) => {
                if (userId) {
                    socket.join(`user_${userId}`);
                    console.log(`Socket ${socket.id} joined room: user_${userId}`);
                }
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
};
