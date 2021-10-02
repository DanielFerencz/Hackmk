import url from './restaurant.js';

// Foglalasok lekerese egy vendeglohoz
export async function findReservations(restID) {
    const response = await fetch(`${url}/reservations?rest_id=${restID}`);
    const reservations = await response.json();
    if (response.status === 200) return reservations;
    return [];
}

// A sajat user foglalasai
export async function findMyReservations() {
    const response = await fetch(`${url}/myReservations`, {
        mode: 'cors',
        credentials: 'include',
    });
    const reservations = await response.json();
    if (response.status === 200) return reservations;
    return [];
}

// foglalas elkuldese
export async function createReservation(index) {
    const reservation = {
        name: document.getElementById('name').value,
        id: document.getElementById('id').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        table: index,
    };

    const response = await fetch(`${url}/createReservation`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
    });
    const body = await response.json();
    if (response.status < 400) {
        return 'OK';
    }
    if (response.status >= 500) return 'Server problem';
    return body.msg;
}
