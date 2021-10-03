import url from './post.js';

// egy meghivas torlesenek a menete
export async function deleteInvitation(invId) {
    const resp = await fetch(`${url}/deleteInvitation?id=${invId}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
    });

    if (resp.status === 204) {
        // const ev = event.target.parentNode;
        const ev = document.getElementById(`${invId}`);
        ev.remove();
        if (document.getElementsByClassName('invitation').length === 0) {
            const invitations = document.getElementById('invitations');
            const div1 = document.createElement('div');
            div1.setAttribute('class', 'invitation');
            const text1 = document.createTextNode('No registered invitations in the database.');
            div1.appendChild(text1);
            if (!document.getElementById('deleted')) {
                invitations.appendChild(div1);
            } else {
                invitations.insertBefore(div1, invitations.firstChild);
            }
        }
        if (!document.getElementById('deleted')) {
            const invitations = document.getElementById('invitations');
            const div1 = document.createElement('div');
            div1.setAttribute('id', 'deleted');
            const text1 = document.createTextNode('1 invitation deleted');
            div1.appendChild(text1);
            invitations.appendChild(div1);
        }
    } else {
        const body = await resp.json();
        // eslint-disable-next-line no-alert
        alert(body.message);
    }
}

// Meghivas elfogadasa
export async function acceptInvitation(invId) {
    const resp = await fetch(`${url}/acceptInvitation?id=${invId}`, {
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

// Meghivas elutasitasa
export async function declineInvitation(invId) {
    const resp = await fetch(`${url}/declineInvitation?id=${invId}`, {
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
