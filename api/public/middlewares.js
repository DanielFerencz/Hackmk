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

// A bejegyzes letrehozasakor leelenorzi az adatok jelenletet
export function postValidator(req, res, next) {
    if (res.locals.payload.role !== 'admin') {
        return res.status(403).json({
            msg: 'Forbidden action',
        });
    }
    const fields = ['adminID', 'name', 'genre', 'game', 'city', 'email', 'telefon', 'description'];
    let msg = '';
    fields.forEach((field) => {
        if (req.body[field] === undefined) {
            msg = `The ${field} field is empty!`;
        }
    });

    if (msg !== '') {
        return res.status(404).json({
            msg,
        });
    }
    return next();
}

// Egy meghivo adatait ellenorzi le
export function invitationValidator(req, res, next) {
    let msg = '';
    if (!res.locals.payload.role) {
        msg = 'Forbidden action';
        return res.status(403).json({
            msg,
        });
    }
    const fields = ['name', 'id', 'date', 'time', 'description', 'requirements'];
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
    console.log('asd');
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
