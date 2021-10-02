import mongodb from 'mongodb';

// Connection URL
export const url = 'mongodb://localhost:27017/';
export const dbName = 'restaurantDB';
export const collName = 'restaurants';
export const collPic = 'pictures';
export const collUser = 'users';
export const collReserv = 'reservations';

let connection;

export default async function connectionToDB() {
    try {
        connection = await mongodb.MongoClient.connect(url, { useUnifiedTopology: true });
        connection = connection.db(dbName);
    } catch (err) {
        console.log('connection error');
    }
}
connectionToDB();
// mongoDB fuggvenyek, beszuras, torles, lekeres
export function insertRestaurant(data) {
    return connection.collection(collName).insertOne(data);
}

export function insertPicture(data) {
    return connection.collection(collPic).insertOne(data);
}

export function insertUser(data) {
    return connection.collection(collUser).insertOne(data);
}

export function insertReserv(data) {
    return connection.collection(collReserv).insertOne(data);
}

export function findAllRestaurants() {
    return connection.collection(collName).find().toArray();
}

export function findRestaurant(id) {
    return connection.collection(collName).findOne({ _id: id });
}

export function findRestaurantByName(restName) {
    return connection.collection(collName).findOne({ name: restName });
}

export function findAllPictures() {
    return connection.collection(collPic).find().toArray();
}

export function findPictures(iD) {
    return connection.collection(collPic).find({ id: iD }).toArray();
}

export function findAllUsers() {
    return connection.collection(collUser).find().toArray();
}

export function findUser(user) {
    return connection.collection(collUser).findOne({ name: user });
}

export function findReservations(iD) {
    return connection.collection(collReserv).find({ id: iD }).toArray();
}

export function findMyReservations(username) {
    return connection.collection(collReserv).find({ name: username }).toArray();
}

export function findReservation(iD) {
    return connection.collection(collReserv).findOne({ _id: mongodb.ObjectID(iD) });
}

export function deleteReservation(iD) {
    connection.collection(collReserv).deleteOne({ _id: mongodb.ObjectID(iD) });
}

export function acceptReservation(iD, updatedReser) {
    return connection.collection(collReserv)
        .updateOne({ _id: mongodb.ObjectID(iD) }, updatedReser, { upsert: true });
}

export function findMaxID() {
    if (connection.collection(collName)) {
        return connection.collection(collName).find({}).sort({ _id: -1 }).limit(1)
            .toArray();
    }
    return null;
}
