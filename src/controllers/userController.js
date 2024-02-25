const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Register a new user
const register = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        //const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password });
        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (error) {
        next(error);
    }
};

// Login with an existing user
const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1 hour'
        });
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    const username = req.params.username, newUsername = req.query.username;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username === req.user.username) {
            await User.updateOne({"username": username}, {"username": newUsername});
            res.json({ message: 'Update successful' });
        } else {
            res.status(401).json({message: 'Users can only edit their own usernames'});
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username === req.user.username) {
            await User.deleteOne({username});
            res.json({ message: 'Delete successful' });
        } else {
            res.status(401).json({message: 'Users can only delete their own accounts'});
        }
    } catch (error) {
        next(error);
    }
};

const profile = async (req, res, next) => {
    const { username } = req.body;

    try {
        await User.findOne({username});
        res.json({message: "Welcome, "+username});
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, update, deleteUser };