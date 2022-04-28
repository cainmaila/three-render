const { Server } = require('socket.io');
function socketServer(httpServer) {
  const socketMap = new Map();
  const renderMap = new Map();
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket) => {
    console.log('😀 a user connected', socket.id);
    let targetSocket;
    socket.on('render', ({ tag }) => {
      console.log('🤟 render connected', tag, socket.id);
      renderMap.set(tag, socket);
      socket.on('disconnect', () => {
        renderMap.delete(tag);
        console.log('🤬 render disconnected!');
      });
      socket.on('modelReady', ({ path }) => {
        console.log('👍 model Ready', path);
      });
    });
    socket.on('client', ({ tag }) => {
      const renderSocket = renderMap.get(tag);
      if (!renderSocket) {
        console.warn('💩 render not ready!!', tag);
        return;
      }
      socketMap.set(socket.id, socket);
      socket.on('disconnect', () => {
        socketMap.delete(socket.id);
        console.log('🤬 user disconnected', socket.id);
      });
      // box meta
      socket.on('getBoxs', () => {
        renderSocket.emit('getBoxs', { id: socket.id });
      });
      socket.on('cameraState', (data) => {
        renderSocket.emit('cameraState', { ...data, id: socket.id });
      });
    });
    socket.on('img', (data) => {
      targetSocket = socketMap.get(data.id);
      targetSocket && targetSocket.emit('img', data.image);
    });
    socket.on('boxs', ({ id, boxs }) => {
      targetSocket = socketMap.get(id);
      targetSocket && targetSocket.emit('boxs', { boxs });
    });
  });
}
module.exports = socketServer;
