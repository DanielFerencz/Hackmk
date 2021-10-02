import { unlinkSync } from 'fs';
import jwt from 'jsonwebtoken';
import secret from '../util/config.js';

// Token beallitasa
export function decodeJWTToken(req, res, next) {
    res.locals.payload = {};
    if (req.cookies.token) {
        try {
            res.locals.payload = jwt.verify(req.cookies.token, secret);
        } catch (e) {
            res.clearCookie('token');
        }
    }
    next();
}

// Regisztracio middleware, adatok jelenletenek ellenorzese
export function registerValidator(req, res, next) {
    let msg;
    if (!req.body.username) {
        msg = 'The name field is empty!';
        return res.status(404).json({
            msg,
        });
    }
    if (!req.body.password1) {
        msg = 'The first password field is empty!';
        return res.status(404).json({
            msg,
        });
    }

    if (!req.body.password2) {
        msg = 'The second password field is empty!';
        return res.status(404).json({
            msg,
        });
    }
    return next();
}

// A vendeglo letrehozasakor leelenorzi az adatok jelenletet
export function restaurantValidator(req, res, next) {
    if (res.locals.payload.role !== 'admin') {
        return res.status(403).json({
            msg: 'Forbidden action',
        });
    }
    const fields = ['adminID', 'name', 'city', 'street', 'number', 'telefon', 'open', 'close', 'structure'];
    let msg = '';
    fields.forEach((field) => {
        if (req.body[field] === undefined) {
            msg = `The ${field} field is empty!`;
        }
    });

    let tableCount = 0;
    for (let i = 0; i < 100; i += 1) {
        if (req.body.structure[i] !== 1 && req.body.structure[i] !== 0) msg = 'Invalid table structure!';
        tableCount += req.body.structure[i];
    }

    if (tableCount <= 0) {
        msg = 'Invalid table structure';
    }

    if (msg !== '') {
        return res.status(404).json({
            msg,
        });
    }
    return next();
}

// Egy foglalas adatait ellenorzi le
export function reservationValidator(req, res, next) {
    let msg = '';
    if (!res.locals.payload.role) {
        msg = 'Forbidden action';
        return res.status(403).json({
            msg,
        });
    }
    const fields = ['name', 'id', 'date', 'time', 'table'];
    fields.forEach((field) => {
        if (req.body[field] === undefined) {
            msg = `The ${field} field is empty!`;
        }
    });

    if (req.body.name !== res.locals.payload.username) {
        msg = 'Forbidden action';
        return res.status(403).json({
            msg,
        });
    }

    if (msg !== '') {
        return res.status(404).json({
            msg,
        });
    }

    req.body.id = parseInt(req.body.id, 10);

    return next();
}

// A photo feltoltes adatait ellenorzi le
export function photoValidator(req, res, next) {
    let msg = '';
    if (res.locals.payload.role !== 'admin') {
        msg = 'Forbidden action';
        return res.status(403).json({
            msg,
        });
    }
    if (!req.fields.id) {
        if (req.files.photo) {
            unlinkSync(req.files.photo.path, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
        msg = 'The id field was empty!';
        return res.status(404).json({
            msg,
        });
    }

    return next();
}