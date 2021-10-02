import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as database from '../db/freeCollabDB.js';
import secret from '../util/config.js';
import * as middlewares from '../public/middlewares.js';

const router = express.Router();

// Login adatok ellenorzese, cookie beallitasa
router.post('/auth/login', async (req, res) => {
    let msg;
    if (!req.body.username) {
        msg = 'The name field is empty!';
        return res.status(404).json({
            msg,
        });
    }
    if (!req.body.password) {
        msg = 'The password field is empty!';
        return res.status(404).json({
            msg,
        });
    }

    if (res.locals.payload.username) {
        msg = 'Forbidden action';
        return res.status(403).json({
            msg,
        });
    }

    const { username } = req.body;
    const user = await database.findUser(username);

    if (user == null) {
        msg = 'Wrong username or password!';
        return res.status(401).json({
            msg,
        });
    }

    if (username === user.name
        && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ username, id: user._id, role: user.role }, secret);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
        });

        msg = `Welcome, ${username}!`;
        return res.status(200).json({
            msg,
            token,
        });
    }
    msg = 'Wrong username or password!';
    return res.status(401).json({
        msg,
    });
});

// Regisztracios adatok ellenorzese es felhasznalo letrehozasa
router.post('/auth/register', middlewares.registerValidator, async (req, res) => {
    let msg;

    if (res.locals.payload.username) {
        msg = 'Forbidden action';
        return res.status(403).json({
            msg,
        });
    }

    const { username } = req.body;
    const userExists = await database.findUser(username);

    if (userExists != null) {
        msg = 'Username already exists!';
        return res.status(401).json({
            msg,
        });
    }

    const { password1, password2 } = req.body;

    if (password1 === password2) {
        const user = { name: username, password: bcrypt.hashSync(password1, 10), role: 'user' };

        await database.insertUser(user);
        msg = 'User created, please log in!';
        return res.status(200).json({
            msg,
        });
    }
    msg = 'Passwords do not match!';
    return res.status(401).json({
        msg,
    });
});

// Lekeri hogy jelenleg ki van bejelentkezve
router.get('/user', (req, res) => {
    if (res.locals.payload.username) {
        return res.status(200).json({
            username: res.locals.payload.username,
            id: res.locals.payload.id,
            role: res.locals.payload.role,
        });
    }
    const msg = 'Not logged in!';
    return res.status(203).json({
        msg,
    });
});

export default router;
