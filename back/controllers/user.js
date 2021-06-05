const User = require('../models/user');
const { use } = require('../routes/user');

exports.createUser = function (req, res) {
  User.findOne({ socketId: req.body.socketId }, (err, user) => {
    if(err) {
      res.status(500).json({
        message : 'le serveur a rencontré un problème inattendu'
      });
    }
    user.name = req.body.name;
    user.score = 0;
    user.isConnected = true;
    user.save()
    .then(() => {
      res.status(201).json({
        message : 'l\'utiliateur est bien enregistré'
      });
    })
    .catch((err) => {
      res.status(400).json({
        message : 'utilisteur deja existant'
      });
    })
  });
}

exports.readUsers = function (req, res) {
  User.find({}, (err, users) => {
    if(err) {
      res.status(500).json({
        message : 'le serveur a rencontré un problème inattendu'
      });
    }
    res.status(200).json(users);
  });
}

exports.updateUser = function (req, res) {
  User.findOne({ socketId: req.body.socketId }, (err, user) => {
    if(err) {
      res.status(500).json({
        message : 'le serveur a rencontré un problème inattendu'
      });
    }
    user.score = req.body.score;
    user.isConnected = req.body.isConnected;
    user.save()
    .then(() => {
      res.status(201).json({
        message : 'l\'utiliateur est bien enregistré'
      });
    })
    .catch((err) => {
      res.status(500).json({
        message : 'le serveur a rencontré un problème inattendu'
      });
    })
  });
}

exports.initUser = function (req, res) {
  User.deleteMany({})
  .then(async () => {
    let user = new User();
    user.socketId = "1";
    user.name = "Ronaldo";
    user.score = 3;
    user.isConnected = false;
    await user.save();
    let user1 = new User();
    user1.socketId = "2";
    user1.name = "Messi";
    user1.score = 5;
    user1.isConnected = false;
    await user1.save();
    let user2 = new User();
    user2.socketId = "3";
    user2.name = "Raul";
    user2.score = 4;
    user2.isConnected = false;
    await user2.save();
    res.status(201).json({
      message : 'l\'utiliateur est bien enregistré'
    });
  })
  .catch((err) => {
    res.status(500).json({
      message : err
    });
  });
}