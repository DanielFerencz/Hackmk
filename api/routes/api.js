import express from 'express';
import * as database from '../db/restaurantDB.js';

const router = express.Router();

// Leker tobb informaciot a vendeglorol
router.get('/getMoreInfo', async (req, res) => {
    try {
        const info = await database.findRestaurant(parseInt(req.query.id, 10));
        res.send(info);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Foto megjelenitese
router.get('/picture', async (req, res) => {
    res.redirect(`/${req.query.photo}`);
});

// Foto-nevek lekerese
router.get('/pictures', async (req, res) => {
    const pictures = await database.findPictures(parseInt(req.query.rest_id, 10));
    res.send(pictures);
});

export default router;
