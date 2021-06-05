const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/', userCtrl.createUser);
router.put('/', userCtrl.updateUser);
router.get('/', userCtrl.readUsers);
router.get('/init', userCtrl.initUser);

module.exports = router;