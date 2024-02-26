const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { deleteUser, update} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});

router.post('/delete/:username', authenticate, deleteUser);

router.patch('/update/:username', authenticate, update)

module.exports = router;