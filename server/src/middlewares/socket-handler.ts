import { Server, Socket } from 'socket.io';

const userSocketMap = new Map<string, string>();

const socketHandler = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle user login
    socket.on('login', (userId: string) => {
      console.log(`User ${userId} logged in, socketId: ${socket.id}`);

      if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log('Updated userSocketMap:', userSocketMap);
      } else {
        console.error('Invalid userId received:', userId);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);

      userSocketMap.forEach((value, key) => {
        if (value === socket.id) {
          userSocketMap.delete(key);
        }
      });

      console.log('Updated userSocketMap after disconnect:', userSocketMap);
    });
  });
};

export { socketHandler, userSocketMap };
