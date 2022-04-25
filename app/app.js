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

io.on('connection', (socket) => {
  console.log('😀 a user connected', socket.id);
  socketMap.set(socket.id, socket);
  let targetSocket;
  socket.on('img', (data) => {
    targetSocket = socketMap.get(data.id);
    targetSocket?.emit('img', data.image);
  });
  socket.on('cameraState', (data) => {
    socket.broadcast.emit('cameraState', { ...data, id: socket.id });
  });

  socket.on('disconnect', () => {
    socketMap.delete(socket.id);
    console.log('🤬 user disconnected', socket.id);
  });
  socket.on('disconnecting', (reason) => {
    console.log('disconnecting!!', reason);
  });
});

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
