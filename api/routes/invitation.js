import express from 'express';
import * as database from '../db/freeCollabDB.js';
import * as middlewares from '../public/middlewares.js';
import * as utilities from '../public/utilities.js';
import { zoomLink } from '../util/config.js';

const router = express.Router();

// Lekeri az osszes meghivot az adott bejegyzesre
router.get('/invitations', async (req, res) => {
    const invitations = await database.findInvitations(parseInt(req.query.pst_id, 10));
    res.send(invitations);
});

// Lekeri egy bejelentkezett user meghivoit
router.get('/myInvitations', async (req, res) => {
    if (res.locals.payload.username) {
        const invitations = await database.findMyInvitations(res.locals.payload.username);
        res.send(invitations);
    } else {
        res.status(403).json({
            msg: 'Forbidden action',
        });
    }
});

// Meghivo torlese, admin kell legyen a user
router.delete('/deleteInvitation', async (req, res) => {
    try {
        const inv = await database.findInvitation(req.query.id);

        if (inv) {
            if (res.locals.payload.username !== inv.name) {
                return res.status(403).json({ message: 'Forbidden action' });
            }
        } else {
            return res.status(403).json({ message: 'Forbidden action' });
        }
        database.deleteInvitation(req.query.id);
        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Meghivo elfogadasa
router.put('/acceptInvitation', async (req, res) => {
    try {
        const inv = await database.findInvitation(req.query.id);
        const post = await database.findPost(inv.id);

        if (inv) {
            if (post) {
                if (res.locals.payload.id !== post.adminID) {
                    return res.status(403).json({ msg: 'Forbidden action' });
                }
            } else {
                return res.status(404).json({ msg: 'No such post' });
            }
        } else {
            return res.status(404).json({ msg: 'No such invitation' });
        }
        let { description } = inv;
        description += zoomLink;
        const updatedInv = {
            $set: {
                status: 'accepted',
                description,
            },
        };
        database.acceptInvitation(inv._id, updatedInv);
        return res.json({
            msg: 'OK',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
});

// Meghivo elutasitasa
router.put('/declineInvitation', async (req, res) => {
    try {
        const inv = await database.findInvitation(req.query.id);
        const post = await database.findPost(inv.id);

        if (inv) {
            if (post) {
                if (res.locals.payload.id !== post.adminID) {
                    return res.status(403).json({ msg: 'Forbidden action' });
                }
            } else {
                return res.status(404).json({ msg: 'No such post' });
            }
        } else {
            return res.status(404).json({ msg: 'No such invitation' });
        }
        const updatedInv = {
            $set: {
                status: 'declined',
            },
        };
        database.acceptInvitation(inv._id, updatedInv);
        return res.json({
            msg: 'OK',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
});

// Meghivo letrehozasa, adatok ellenorzese
router.post('/createInvitation', middlewares.invitationValidator, async (req, res) => {
    let msg;
    try {
        const ok = await utilities.containsId(req.body.id);
        if (!ok) {
            msg = 'The post id doesn\'t exists!';
            return res.status(404).json({
                msg,
            });
        }

        const post = await utilities.fromPosts(req.body.id);

        const { body } = req;
        body.status = 'pending';
        body.pstName = post.name;
        await database.insertInvitation(body);

        msg = 'Invitation accepted';
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
