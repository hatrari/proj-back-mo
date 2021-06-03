const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bdbackproj:bdbackproj@cluster0.lxntn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection; 

db.on('error', (err) => console.log(`Error lors de connexion à db`));

db.once('open', function() { });
