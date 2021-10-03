import * as database from '../db/freeCollabDB.js';

// Segedfuggveny: Van-e olyan id-t tartalmazo bejegyzes
export async function containsId(id) {
    let post;
    try {
        post = await database.findPost(id);
    } catch (err) {
        console.log(err);
        return false;
    }

    if (post != null) {
        return true;
    }
    return false;
}

// bejegyzeseket lekeri
export async function fromPosts(id) {
    let post;
    try {
        post = await database.findPost(id);
    } catch (err) {
        console.log(err);
        return false;
    }

    let ok = [];

    if (post != null) {
        ok = post;
    }
    return ok;
}

// Van e olyan nevu bejegyzes
export async function containsPost(pst) {
    let post;
    try {
        post = await database.findPostByName(pst);
    } catch (err) {
        console.log(err);
        return false;
    }

    if (post != null) {
        return true;
    }
    return false;
}
