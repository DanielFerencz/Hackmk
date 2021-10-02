import mongodb from 'mongodb';
import bcrypt from 'bcrypt';
import {
    url, dbName, collName, collPic, collUser, collInvitation,
} from './freeCollabDB.js';

// Creating the database, the collections, and add some user
const whatToDo = 'drop';
if (whatToDo !== 'dropDB') {
    mongodb.MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(dbName);
        dbo.createCollection(collName, (err2) => {
            if (err2) throw err2;
            console.log('Collection created!');
            db.close();
        });
        dbo.createCollection(collPic, (err2) => {
            if (err2) throw err2;
            console.log('Collection created!');
            db.close();
        });
        dbo.createCollection(collUser, (err2) => {
            if (err2) throw err2;
            console.log('Collection created!');
            db.close();
        });
        dbo.createCollection(collInvitation, (err2) => {
            if (err2) throw err2;
            console.log('Collection created!');
            db.close();
        });
        const users = [
            { name: 'Ferencz Dani', password: bcrypt.hashSync('jelszo1', 10), role: 'admin' },
            { name: 'FaZe Clan', password: bcrypt.hashSync('jelszo2', 10), role: 'user' },
            { name: 'Keresztes Béla', password: bcrypt.hashSync('jelszo3', 10), role: 'admin' },
            { name: 'RBLZ Gaming', password: bcrypt.hashSync('jelszo4', 10), role: 'user' },
            { name: '#United', password: bcrypt.hashSync('jelszo5', 10), role: 'user' },
            { name: 'NRG Esports', password: bcrypt.hashSync('jelszo6', 10), role: 'user' },
        ];
        dbo.collection(collUser).insertMany(users, (err2) => {
            if (err2) throw err2;
            console.log('Users added!');
            db.close();
        });
    });
} else { /// Drop database
    mongodb.MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        const dbo = db.db(dbName);
        dbo.dropDatabase();
    });
}
