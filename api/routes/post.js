import express from 'express';
import * as database from '../db/freeCollabDB.js';
import * as middlewares from '../public/middlewares.js';
import * as utilities from '../public/utilities.js';

const router = express.Router();

let postID = 0;

// Az osszes bejegyzes lekerese
router.get('/posts', async (req, res) => {
    const posts = await database.findAllPosts();
    return res.send(posts);
});

// egy bejegyzes lekerese
router.get('/post', async (req, res) => {
    const post = await database.findPost(parseInt(req.query.pst_id, 10));
    if (post) {
        return res.send(post);
    }
    return res.status(404).json({
        msg: 'Not found',
    });
});

// bejegyzes letrehozasa, adatok ellenorzese
router.post('/createPost', middlewares.postValidator, async (req, res) => {
    let ok;
    let msg;
    try {
        ok = await utilities.containsPost(req.body.name);
    } catch (err) {
        console.log(err);
    }
    if (ok) {
        msg = 'The post name already exists!';
        return res.status(401).json({
            msg,
        });
    }

    const { body } = req;

    try {
        const result = await database.findMaxID();
        if (!result[0]) {
            postID = 0;
        } else {
            postID = result[0]._id + 1;
        }
        body._id = postID;
        await database.insertPost(body);
        msg = 'Post created!';
        return res.status(200).json({
            msg,
        });
    } catch (err) {
        return res.status(500).json({
            msg: err,
        });
    }
});

export default router;
