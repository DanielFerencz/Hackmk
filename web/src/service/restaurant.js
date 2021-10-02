export const apiServerUrl = 'http://localhost:8080/api';

// Az osszes vendeglo lekerese
export async function findAllRestaurants() {
    const response = await fetch(`${apiServerUrl}/restaurants`);
    const restaurants = await response.json();
    if (response.status === 200) return restaurants;
    return [];
}

// Egy vendeglo adatai
export async function findRestaurant(restID) {
    const response = await fetch(`${apiServerUrl}/restaurant?rest_id=${restID}`);
    const restaurant = await response.json();

    if (response.status === 200) {
        return restaurant;
    }
    return {};
}

// Vendeglo letrehozasa, elkuldese
export async function createRestaurant(restaurant) {
    const response = await fetch(`${apiServerUrl}/createRestaurant`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant),
    });
    const body = await response.json();
    if (response.status < 400) {
        return 'OK';
    }
    if (response.status >= 500) return 'Server problem';
    return body.msg;
}

export default apiServerUrl;
