import url from './restaurant.js';

const formDataServerUrl = 'http://localhost:8080/uploadPhoto';

// fenykepek listajanak lekerese
export async function findPictures(restID) {
    const response = await fetch(`${url}/pictures?rest_id=${restID}`);
    const pictures = await response.json();
    if (response.status === 200) return pictures;
    return [];
}

// fenykep feltoltes
export async function uploadPhoto() {
    const photoForm = document.getElementById('photoForm');

    const formData = new FormData(photoForm);

    const response = await fetch(`${formDataServerUrl}`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: formData,
    });
    const body = await response.json();
    if (response.status < 400) {
        return 'OK';
    }
    if (response.status >= 500) return 'Server problem';
    return body.msg;
}
