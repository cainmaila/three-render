const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const PORT = 3030;
const app = express().use('*', cors());
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
});

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
