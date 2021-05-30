const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({ 
  socketId: { type: 'string', unique: true},
  name: { type: 'string', unique: true},
  score: { type: Number },
  isConnected: { type: Boolean }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema)