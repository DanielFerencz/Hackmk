import * as database from '../db/restaurantDB.js';

// Segedfuggveny: Van-e olyan id-t tartalmazo vendeglo
export async function containsId(id) {
    let restaurant;
    try {
        restaurant = await database.findRestaurant(id);
    } catch (err) {
        console.log(err);
        return false;
    }

    if (restaurant != null) {
        return true;
    }
    return false;
}

// Vendegloket lekeri
export async function fromRestaurants(id) {
    let restaurant;
    try {
        restaurant = await database.findRestaurant(id);
    } catch (err) {
        console.log(err);
        return false;
    }

    let ok = [];

    if (restaurant != null) {
        ok = restaurant;
    }
    return ok;
}

// Van e olyan nevu vendeglo
export async function containsRestaurant(rest) {
    let restaurant;
    try {
        restaurant = await database.findRestaurantByName(rest);
    } catch (err) {
        console.log(err);
        return false;
    }

    if (restaurant != null) {
        return true;
    }
    return false;
}

// a foglalas es a vendeglo kompatibilis-e
export function reservationValidator(reservation, restaurant) {
    if (reservation.time < restaurant.open || reservation.time >= restaurant.close) {
        return 'The restaurants opening hours doesn\'t match with your reservation time!';
    }
    if (restaurant.structure[reservation.table] !== 1) {
        return 'Invalid table number';
    }
    return '';
}
