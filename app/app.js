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

io.on('connection', (socket) => {
  console.log('😀 a user connected');
  socket.on('img', (data) => {
    console.log(data);
  });
  socket.on('disconnect', () => {
    console.log('🤬 user disconnected');
  });
  socket.on('disconnecting', (reason) => {
    console.log('disconnecting!!');
  });
});

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
