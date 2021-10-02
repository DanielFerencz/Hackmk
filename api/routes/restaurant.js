import express from 'express';
import * as database from '../db/restaurantDB.js';
import * as middlewares from '../public/middlewares.js';
import * as utilities from '../public/utilities.js';

const router = express.Router();

let restID = 0;

// Az osszes vendeglo lekerese
router.get('/restaurants', async (req, res) => {
    const restaurants = await database.findAllRestaurants();
    return res.send(restaurants);
});

// egy vendeglo lekerese
router.get('/restaurant', async (req, res) => {
    const restaurant = await database.findRestaurant(parseInt(req.query.rest_id, 10));
    if (restaurant) {
        return res.send(restaurant);
    }
    return res.status(404).json({
        msg: 'Not found',
    });
});

// vendeglo letrehozasa, adatok ellenorzese
router.post('/createRestaurant', middlewares.restaurantValidator, async (req, res) => {
    let ok;
    let msg;
    try {
        ok = await utilities.containsRestaurant(req.body.name);
    } catch (err) {
        console.log(err);
    }
    if (ok) {
        msg = 'The restaurant name already exists!';
        return res.status(401).json({
            msg,
        });
    }
    if (req.body.open >= req.body.close) {
        msg = 'Invalid opening hours!';
        return res.status(401).json({
            msg,
        });
    }
    if (parseInt(req.body.number, 10) < 0) {
        msg = 'Wrong street number!';
        return res.status(401).json({
            msg,
        });
    }

    const { body } = req;

    try {
        const result = await database.findMaxID();
        if (!result[0]) {
            restID = 0;
        } else {
            restID = result[0]._id + 1;
        }
        body._id = restID;
        await database.insertRestaurant(body);
        msg = 'Restaurant created!';
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
