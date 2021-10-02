import express from 'express';
import { unlink } from 'fs';
import * as database from '../db/restaurantDB.js';
import * as middlewares from '../public/middlewares.js';

const filetypes = /jpeg|jpg|png/;

const router = express.Router();

// Fotofeltoltese, ez eformidable, adatok ellenorzese
router.post('/uploadPhoto', middlewares.photoValidator, async (req, res) => {
    req.fields.id = parseInt(req.fields.id, 10);
    let msg;
    try {
        const restaurant = await database.findRestaurant(req.fields.id);
        if (!restaurant) {
            if (req.files.photo) {
                unlink(req.files.photo.path, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            msg = 'No restaurant with this id in the database';
            return res.status(404).json({
                msg,
            });
        }
        if (restaurant.adminID !== res.locals.payload.id) {
            msg = 'You are not the admin of the restaurant';
            return res.status(404).json({
                msg,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: err,
        });
    }

    if (!req.files.photo) {
        msg = 'No uploaded photo!';
        return res.status(404).json({
            msg,
        });
    }

    const oldPath = req.files.photo.path;
    const name = req.files.photo.path.split('\\').pop();

    const mimetype = filetypes.test(req.files.photo.type);

    if (!mimetype) {
        unlink(oldPath, (err) => {
            if (err) {
                console.error(err);
            }
        });
        msg = 'The file is not a picture!';
        return res.status(403).json({
            msg,
        });
    }

    try {
        const photo = { id: req.fields.id, photo: name };
        await database.insertPicture(photo);
        msg = 'Photo of the restaurant added to the database';
        return res.status(200).json({
            msg,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: err,
        });
    }
});

export default router;
