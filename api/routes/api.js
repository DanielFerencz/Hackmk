import express from 'express';
import * as database from '../db/freeCollabDB.js';

const router = express.Router();

// Leker tobb informaciot a bejegyzesrol
router.get('/getMoreInfo', async (req, res) => {
    try {
        const info = await database.findPost(parseInt(req.query.id, 10));
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
    const pictures = await database.findPictures(parseInt(req.query.pst_id, 10));
    res.send(pictures);
});

export default router;
