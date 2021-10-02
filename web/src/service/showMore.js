import url from './post.js';

// Tobb informacio betoltese
export default async function showMore(pstId) {
    const resp = await fetch(`${url}/getMoreInfo?id=${pstId}`);
    const body = await resp.json();

    if (resp.status === 200) {
        if (!document.getElementById(`location${pstId}`)) {
            const informations = document.getElementById(`informations${pstId}`);
            const div1 = document.createElement('div');
            div1.setAttribute('id', `location${pstId}`);
            const text1 = document.createTextNode(`Street: ${body.street} nr.: ${body.number}`);
            const div2 = document.createElement('div');
            div2.setAttribute('id', `telefon${pstId}`);
            const text2 = document.createTextNode(`Tel.: ${body.telefon}`);
            div1.appendChild(text1);
            div2.appendChild(text2);
            informations.appendChild(div1);
            informations.appendChild(div2);
        } else {
            const location = document.getElementById(`location${pstId}`);
            location.innerText = `Street: ${body.street} nr.: ${body.number}`;
            const telefon = document.getElementById(`telefon${pstId}`);
            telefon.innerText = `Tel.: ${body.telefon}`;
        }
    } else {
        // eslint-disable-next-line no-alert
        alert(body.message);
    }
}
