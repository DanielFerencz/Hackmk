import express from 'express';
import * as database from '../db/freeCollabDB.js';
import * as middlewares from '../public/middlewares.js';
import * as utilities from '../public/utilities.js';

const router = express.Router();

// Lekeri az osszes foglalast az adott vendeglore
router.get('/invitations', async (req, res) => {
    const invitations = await database.findInvitations(parseInt(req.query.pst_id, 10));
    res.send(invitations);
});

// Lekeri egy bejelentkezett user foglalasait
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

// Foglalas torlese, admin kell legyen a user
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

// Foglalas elfogadasa
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
        const updatedInv = {
            $set: {
                status: 'accepted',
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

// Foglalas elutasitasa
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

// Foglalas letrehozasa, adatok ellenorzese
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

        msg = utilities.invitationValidator(req.body, post);

        if (msg !== '') {
            return res.status(404).json({
                msg,
            });
        }

        let invitations = await database.findInvitations(post._id);
        invitations = invitations.filter((inv) => inv.status === 'accepted');
        for (let i = 0; i < invitations.length; i += 1) {
            if (invitations[i].date === req.body.date
                && invitations[i].table === req.body.table) {
                msg = 'That table is already invved!';
                return res.status(401).json({
                    msg,
                });
            }
        }
        const { body } = req;
        body.status = 'pending';
        body.pstName = post.name;
        await database.insertInvv(body);

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
