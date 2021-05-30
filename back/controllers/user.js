const User = require('../models/user');

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



