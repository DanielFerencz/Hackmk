import url from './restaurant.js';

// egy foglalas torlesenek a menete
export async function deleteReservation(reserId) {
    const resp = await fetch(`${url}/deleteReservation?id=${reserId}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
    });

    if (resp.status === 204) {
        // const ev = event.target.parentNode;
        const ev = document.getElementById(`${reserId}`);
        ev.remove();
        if (document.getElementsByClassName('reservation').length === 0) {
            const reservations = document.getElementById('reservations');
            const div1 = document.createElement('div');
            div1.setAttribute('class', 'reservation');
            const text1 = document.createTextNode('No registered reservations in the database.');
            div1.appendChild(text1);
            if (!document.getElementById('deleted')) {
                reservations.appendChild(div1);
            } else {
                reservations.insertBefore(div1, reservations.firstChild);
            }
        }
        if (!document.getElementById('deleted')) {
            const reservations = document.getElementById('reservations');
            const div1 = document.createElement('div');
            div1.setAttribute('id', 'deleted');
            const text1 = document.createTextNode('1 reservation deleted');
            div1.appendChild(text1);
            reservations.appendChild(div1);
        }
    } else {
        const body = await resp.json();
        // eslint-disable-next-line no-alert
        alert(body.message);
    }
}

// Foglalas elfogadasa
export async function acceptReservation(reserId) {
    const resp = await fetch(`${url}/acceptReservation?id=${reserId}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
    });
    const body = await resp.json();
    if (resp.status === 200) {
        return 'OK';
    }
    return body.msg;
}

// Foglalas elutasitasa
export async function declineReservation(reserId) {
    const resp = await fetch(`${url}/declineReservation?id=${reserId}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
    });
    const body = await resp.json();
    if (resp.status === 200) {
        return 'OK';
    }
    return body.msg;
}
