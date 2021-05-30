require('./data/context');

const express = require('express');
const cors = require('cors');
const app = express();
var socket = require('socket.io');

const port = 3000;

app.use(cors());
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const socketio = socket(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const userRoutes = require('./routes/user');
app.use('/', userRoutes);

const User = require('./models/user');

socketio.on('connection', (socket) => {
  let user = new User({
    socketId: socket.id,
    name: socket.id
  });
  user.save();
  socket.on('userconnect', () => {
    socketio.emit('userconnect');
  });
  socket.on('vient-jouer', (msg) => {
    console.log(msg)
    socketio.emit('vient-jouer', msg);
  });
  socket.on('disconnect', () => {
    User.findOne({ socketId: socket.id }, (err, user) => {
      if(!user) return;
      user.isConnected = false;
      user.save();
    });
  });
});

