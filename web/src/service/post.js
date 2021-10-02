export const apiServerUrl = 'http://localhost:8080/api';

// Az osszes vendeglo lekerese
export async function findAllPosts() {
    const response = await fetch(`${apiServerUrl}/posts`);
    const posts = await response.json();
    if (response.status === 200) return posts;
    return [];
}

// Egy vendeglo adatai
export async function findPost(pstID) {
    const response = await fetch(`${apiServerUrl}/post?pst_id=${pstID}`);
    const post = await response.json();

    if (response.status === 200) {
        return post;
    }
    return {};
}

// Vendeglo letrehozasa, elkuldese
export async function createPost(post) {
    const response = await fetch(`${apiServerUrl}/createPost`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    const body = await response.json();
    if (response.status < 400) {
        return 'OK';
    }
    if (response.status >= 500) return 'Server problem';
    return body.msg;
}

export default apiServerUrl;
