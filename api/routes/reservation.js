import express from 'express';
import * as database from '../db/restaurantDB.js';
import * as middlewares from '../public/middlewares.js';
import * as utilities from '../public/utilities.js';

const router = express.Router();

// Lekeri az osszes foglalast az adott vendeglore
router.get('/reservations', async (req, res) => {
    const reservations = await database.findReservations(parseInt(req.query.rest_id, 10));
    res.send(reservations);
});

// Lekeri egy bejelentkezett user foglalasait
router.get('/myReservations', async (req, res) => {
    if (res.locals.payload.username) {
        const reservations = await database.findMyReservations(res.locals.payload.username);
        res.send(reservations);
    } else {
        res.status(403).json({
            msg: 'Forbidden action',
        });
    }
});

// Foglalas torlese, admin kell legyen a user
router.delete('/deleteReservation', async (req, res) => {
    try {
        const reser = await database.findReservation(req.query.id);

        if (reser) {
            if (res.locals.payload.username !== reser.name) {
                return res.status(403).json({ message: 'Forbidden action' });
            }
        } else {
            return res.status(403).json({ message: 'Forbidden action' });
        }
        database.deleteReservation(req.query.id);
        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Foglalas elfogadasa
router.put('/acceptReservation', async (req, res) => {
    try {
        const reser = await database.findReservation(req.query.id);
        const restaurant = await database.findRestaurant(reser.id);

        if (reser) {
            if (restaurant) {
                if (res.locals.payload.id !== restaurant.adminID) {
                    return res.status(403).json({ msg: 'Forbidden action' });
                }
            } else {
                return res.status(404).json({ msg: 'No such restaurant' });
            }
        } else {
            return res.status(404).json({ msg: 'No such reservation' });
        }
        const updatedReser = {
            $set: {
                status: 'accepted',
            },
        };
        database.acceptReservation(reser._id, updatedReser);
        return res.json({
            msg: 'OK',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
});

// Foglalas elutasitasa
router.put('/declineReservation', async (req, res) => {
    try {
        const reser = await database.findReservation(req.query.id);
        const restaurant = await database.findRestaurant(reser.id);

        if (reser) {
            if (restaurant) {
                if (res.locals.payload.id !== restaurant.adminID) {
                    return res.status(403).json({ msg: 'Forbidden action' });
                }
            } else {
                return res.status(404).json({ msg: 'No such restaurant' });
            }
        } else {
            return res.status(404).json({ msg: 'No such reservation' });
        }
        const updatedReser = {
            $set: {
                status: 'declined',
            },
        };
        database.acceptReservation(reser._id, updatedReser);
        return res.json({
            msg: 'OK',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
});

// Foglalas letrehozasa, adatok ellenorzese
router.post('/createReservation', middlewares.reservationValidator, async (req, res) => {
    let msg;
    try {
        const ok = await utilities.containsId(req.body.id);
        if (!ok) {
            msg = 'The restaurant id doesn\'t exists!';
            return res.status(404).json({
                msg,
            });
        }

        const restaurant = await utilities.fromRestaurants(req.body.id);

        msg = utilities.reservationValidator(req.body, restaurant);

        if (msg !== '') {
            return res.status(404).json({
                msg,
            });
        }

        let reservations = await database.findReservations(restaurant._id);
        reservations = reservations.filter((reser) => reser.status === 'accepted');
        for (let i = 0; i < reservations.length; i += 1) {
            if (reservations[i].date === req.body.date
                && reservations[i].table === req.body.table) {
                msg = 'That table is already reserved!';
                return res.status(401).json({
                    msg,
                });
            }
        }
        const { body } = req;
        body.status = 'pending';
        body.restName = restaurant.name;
        await database.insertReserv(body);

        msg = 'Reservation accepted';
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
