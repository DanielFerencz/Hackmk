/* eslint-disable no-unused-vars */
async function deleteReservation(event, reserId) {
    const resp = await fetch(`/api/deleteReservation?id=${reserId}`, {
        method: 'DELETE',
    });

    if (resp.status === 204) {
        const ev = event.target.parentNode;
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

function logoutSubmit() {
    document.getElementById('logout').submit();
}
