async function getMatches() {
    let url = 'https://dota-pro-upcoming-matches-api.netlify.app/.netlify/functions/index';
    // let url = 'http://localhost:8888/.netlify/functions/index'
    let matches = await fetch(url, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }).then(response => response.json())
      .catch(error => console.log(error));
    return matches.data.matches;
}

async function matchesTemplate() {
    let matches = await getMatches();
    let matchesTemplate = matches.map(match => {
        if(match.first === match.second && match.second === 'TBD') 
            return;
        return `
            <div class="w-full rounded flex justify-between gap-5 p-5 m-4" style="width: 370px; background: ${match.status.indexOf(':') !== -1 ? '#00afb9' : '#0081a7'}">
                <div class="w-1/3 text-center text-white text-base">${match.first}</div>
                <div class="w-1/3 text-center text-white font-md">${match.status}</div>
                <div class="w-1/3 text-center text-white text-base">${match.second}</div>
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