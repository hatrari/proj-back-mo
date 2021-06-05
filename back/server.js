require('./data/context');

const express = require('express');
const cors = require('cors');
const app = express();
var socket = require('socket.io');

const port = 3000;

app.use(cors());
app.use(express.json());

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const socketio = socket(server, {
  cors: {
    origin: "*"
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
    socketio.emit('vient-jouer', msg);
  });
  socket.on('proposer-lettre', (msg) => {
    socketio.emit('proposer-lettre', msg);
  });
  socket.on('proposer-numero', (msg) => {
    socketio.emit('proposer-numero', msg);
  });
  socket.on('afficher-resultat', (msg) => {
    socketio.emit('afficher-resultat', msg);
  });
  socket.on('disconnect', () => {
    User.findOne({ socketId: socket.id }, (err, user) => {
      if(!user) return;
      user.isConnected = false;
      user.save();
    });
  });
});

