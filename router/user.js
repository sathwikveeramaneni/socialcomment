const express = require('express');
const router = express.Router();

const userController = require('../controller/user');
const isauth = require('./isauth.js');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/createpost',isauth, userController.createpost);
router.post('/likepost', isauth,userController.likepost);
router.post('/comment', isauth,userController.comment);
router.post('/usercomments',userController.usercomments);
router.get('/getnamesandid',userController.getnamesandid);

module.exports = router;
