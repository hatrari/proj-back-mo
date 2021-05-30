const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/', userCtrl.createUser);
router.get('/', userCtrl.readUsers);

module.exports = router;