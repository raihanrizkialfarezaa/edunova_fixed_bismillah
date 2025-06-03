const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');

// Public routes
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);

// Protected routes
router.get('/me', authMiddleware.authenticate, authCtrl.getMe);
router.put('/change-password', authMiddleware.authenticate, authCtrl.changePassword);

module.exports = router;