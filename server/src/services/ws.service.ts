import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const wsService = {
  init(httpServer: HTTPServer) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log(`Пользователь подключился к сокету: ${socket.id}`);

      socket.on('join_book_channel', (olid: string) => {
        const roomName = `book:${olid}`;
        socket.join(roomName);
        console.log(`Сокет ${socket.id} вошел в комнату: ${roomName}`);
      });

      socket.on('leave_book_channel', (olid: string) => {
        const roomName = `book:${olid}`;
        socket.leave(roomName);
        console.log(`Сокет ${socket.id} покинул комнату: ${roomName}`);
      });

      socket.on('disconnect', () => {
        console.log(`Пользователь отключился: ${socket.id}`);
      });
    });

    return io;
  },

  broadcastLikesUpdate(bookOlid: string, count: number) {
    if (!io) {
      console.warn("Socket.io сервер не инициализирован!");
      return;
    }
    
    const roomName = `book:${bookOlid}`;
    io.to(roomName).emit('likes:updated', {
      book_olid: bookOlid,
      count: count
    });
    console.log(`[WS Broadcast] Отправлено обновление лайков в комнату ${roomName}: count = ${count}`);
  }
};