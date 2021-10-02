import url from './restaurant.js';

// user lekerese
export default async function findUser() {
    const response = await fetch(`${url}/user`, {
        mode: 'cors',
        credentials: 'include',
    });
    const body = await response.json();

    if (response.status === 203) {
        return {};
    }

    return body;
}
