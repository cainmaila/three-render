const { Server } = require('socket.io');
function socketServer(httpServer) {
  let renderSocket = null; //Render服務頁面
  const socketMap = new Map();
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket) => {
    console.log('😀 a user connected', socket.id);
    let targetSocket;
    socket.on('render', () => {
      console.log('🤟 render connected', socket.id);
      renderSocket = socket; //前端渲染連線
      socket.on('disconnect', () => {
        renderSocket = null;
        // renderBrowser && renderBrowser.close();
        console.log('🤬 render disconnected!');
      });
      socket.on('modelReady', ({ path }) => {
        console.log('👍 model Ready', path);
      });
    });
    socket.on('client', () => {
      socketMap.set(socket.id, socket);
      socket.on('disconnect', () => {
        socketMap.delete(socket.id);
        console.log('🤬 user disconnected', socket.id);
      });
    });
    socket.on('img', (data) => {
      targetSocket = socketMap.get(data.id);
      targetSocket?.emit('img', data.image);
    });
    socket.on('cameraState', (data) => {
      renderSocket?.emit('cameraState', { ...data, id: socket.id });
    });
    // box meta
    socket.on('getBoxs', () => {
      renderSocket?.emit('getBoxs', { id: socket.id });
    });
    socket.on('boxs', ({ id, boxs }) => {
      targetSocket = socketMap.get(id);
      targetSocket?.emit('boxs', { boxs });
    });
  });
}
module.exports = socketServer;
