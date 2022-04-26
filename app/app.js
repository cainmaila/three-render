const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const compression = require('compression');
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  return compression.filter(req, res);
}
const { Server } = require('socket.io');

const PORT = 3030;
const app = express().use('*', cors());
app.use(compression({ filter: shouldCompress }));
const docs = path.join(__dirname, '../', 'dist');
app.use(express.static(docs));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'dist/index.html'));
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const socketMap = new Map();
let renderSocket = null; //Render服務頁面

io.on('connection', (socket) => {
  console.log('😀 a user connected', socket.id);

  let targetSocket;
  socket.on('render', () => {
    renderSocket = socket; //前端渲染連線
    socket.on('disconnect', () => {
      renderSocket = null;
      console.log('🤬 render disconnected!');
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

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
