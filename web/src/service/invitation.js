import url from './post.js';

// Foglalasok lekerese egy vendeglohoz
export async function findInvitations(pstID) {
    const response = await fetch(`${url}/invitations?pst_id=${pstID}`);
    const invitations = await response.json();
    if (response.status === 200) return invitations;
    return [];
}

// A sajat user foglalasai
export async function findMyInvitations() {
    const response = await fetch(`${url}/myInvitations`, {
        mode: 'cors',
        credentials: 'include',
    });
    const invitations = await response.json();
    if (response.status === 200) return invitations;
    return [];
}

// foglalas elkuldese
export async function createInvitation() {
    const invitation = {
        name: document.getElementById('name').value,
        id: document.getElementById('id').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        description: document.getElementById('description').value,
        requirements: document.getElementById('requirements').value,
    };

    const response = await fetch(`${url}/createInvitation`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitation),
    });
    const body = await response.json();
    if (response.status < 400) {
        return 'OK';
    }
    if (response.status >= 500) return 'Server problem';
    return body.msg;
}
