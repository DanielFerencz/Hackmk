import mongodb from 'mongodb';

// Connection URL
export const url = 'mongodb://localhost:27017/';
export const dbName = 'freeCollabDB';
export const collName = 'posts';
export const collPic = 'pictures';
export const collUser = 'users';
export const collInvitation = 'invitations';

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
export function insertPost(data) {
    return connection.collection(collName).insertOne(data);
}

export function insertPicture(data) {
    return connection.collection(collPic).insertOne(data);
}

export function insertUser(data) {
    return connection.collection(collUser).insertOne(data);
}

export function insertInvitation(data) {
    return connection.collection(collInvitation).insertOne(data);
}

export function findAllPosts() {
    return connection.collection(collName).find().toArray();
}

export function findPost(id) {
    return connection.collection(collName).findOne({ _id: id });
}

export function findPostByName(postName) {
    return connection.collection(collName).findOne({ name: postName });
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

export function findInvitations(iD) {
    return connection.collection(collInvitation).find({ id: iD }).toArray();
}

export function findMyInvitations(username) {
    return connection.collection(collInvitation).find({ name: username }).toArray();
}

export function findInvitation(iD) {
    return connection.collection(collInvitation).findOne({ _id: mongodb.ObjectID(iD) });
}

export function deleteInvitation(iD) {
    connection.collection(collInvitation).deleteOne({ _id: mongodb.ObjectID(iD) });
}

export function acceptInvitation(iD, updatedInv) {
    return connection.collection(collInvitation)
        .updateOne({ _id: mongodb.ObjectID(iD) }, updatedInv, { upsert: true });
}

export function findMaxID() {
    if (connection.collection(collName)) {
        return connection.collection(collName).find({}).sort({ _id: -1 }).limit(1)
            .toArray();
    }
    return null;
}
