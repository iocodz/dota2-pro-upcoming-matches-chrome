const BACKEND_URL = 'https://dota-pro.netlify.app/.netlify/functions/matches';

const STATIC_URL_BASE = 'https://liquipedia.net';
const DEFAULT_IMAGE = '/commons/images/thumb/1/16/Dota2_logo.png/50px-Dota2_logo.png'
async function getMatches() {
    let matches = await fetch(BACKEND_URL, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }).then(response => response.json())
        .catch(error => console.log(error));
    return matches.data;
}

async function matchesTemplate() {
    let matches = await getMatches();
    let matchesTemplate = matches.map(match => {
        if (match.firstTeam.name === match.secondTeam.name && match.secondTeam.name === 'TBD')
            return;
        const running = match.status.indexOf(':') !== -1;
        const startDateTimeStamp = new Date(match.startDate);
        const startDate = startDateTimeStamp.getDate() + '/' + (startDateTimeStamp.getMonth() + 1) + '/' + startDateTimeStamp.getFullYear() + '<br />' + startDateTimeStamp.toLocaleTimeString();
        return `
            <div class="w-full rounded flex justify-between gap-5 p-5 m-4 items-center ${running ? 'gradient-live' : 'gradient-upcoming'}" style="width: 370px">
                <div class="w-1/3 text-center text-white text-base flex items-center gap-5">
                    <img src="${STATIC_URL_BASE + (match.firstTeam.image || DEFAULT_IMAGE)}" width="20px"/>
                    <span>${match.firstTeam.name}</span>
                </div>
                <div class="w-1/3 text-center text-white font-md">${running ? match.status : startDate}</div>
                <div class="w-1/3 text-center text-white text-base flex items-center gap-5">
                    <img src="${STATIC_URL_BASE + (match.secondTeam.image || DEFAULT_IMAGE)}" width="20px"/>
                    <span>${match.secondTeam.name}</span>
                </div>
            </div>
        `
    }).join('');
    return matchesTemplate;
}

function setLoadingTemplate() {
    document.querySelector('#matches').innerHTML = `
        <div class="w-100 flex justify-center items-center" style="min-height: 600px;">
            <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div>
        </div>
    `
}

setLoadingTemplate()

matchesTemplate().then(matches => {
    document.querySelector('#matches').innerHTML = matches;
});