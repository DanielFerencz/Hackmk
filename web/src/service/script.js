import url from './post.js';

// Login esemeny elkuldese
export async function loginSubmit() {
    const formJSON = JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    });

    const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: formJSON,
    });
    const body = await response.json();
    if (response.status < 400) {
        document.cookie = `token=${body.token}`;

        return 'OK';
    }
    return body.msg;
}

// Regisztracio elkuldese
export async function registerSubmit(selectedOption) {
    let formJSON;
    if (selectedOption==='player') {
        formJSON = JSON.stringify({
        username: document.getElementById('username').value,
        password1: document.getElementById('password1').value,
        password2: document.getElementById('password2').value,
        role: 'admin'
    });
    } else {
        formJSON = JSON.stringify({
            username: document.getElementById('username').value,
            password1: document.getElementById('password1').value,
            password2: document.getElementById('password2').value,
            role: 'user'
        });
    }

    const response = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: formJSON,
    });
    const body = await response.json();
    if (response.status < 400) {
        return 'OK';
    }
    return body.msg;
}

export const invitation = 'we are inviting you for a 1v1 battle with 1 of our team members in a Tetris game: https://tetr.io/#RKCX';