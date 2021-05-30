const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection; 

db.on('error', (err) => console.log(`Error lors de connexion à db`));

db.once('open', function() { });
