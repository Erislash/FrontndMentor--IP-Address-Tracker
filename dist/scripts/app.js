import KEYS from './keys.js'

main();
function main() {
    const ipSearcher = document.querySelector('#ip');
    const submit = document.querySelector('#btn');
    const mymap = L.map('mapid');
    mymap.setView([0, 0], 13);

    mymap.zoomControl.setPosition('bottomright');

    L.tileLayer(KEYS.MAPBOX_URL, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZXJpc2Fsc2giLCJhIjoiY2txNzBzbTQ4MDFsMjJ2bzIxem96Z2k1bSJ9.d3ibVrtMWfgeccG_SQ7xBw'
    }).addTo(mymap);

    submit.addEventListener('click', (e) => submitHandler(e, ipSearcher, mymap));
}

function submitHandler(e, ipSearcher, mymap){
    e.preventDefault();

    const xhr = new XMLHttpRequest();

    if (!xhr){
        alert('You cannot use this service. Imposible to create an XMLHttp instance.');
        return false;
    }

    xhr.onreadystatechange = function() {
        const OK = 200;

        try{
            if (this.readyState == XMLHttpRequest.DONE) {
                if (this.status == OK) {
                    const res = JSON.parse(this.response);
                    
                    const {ip, location: {city, country, lat, lng, region, timezone}, as:{name}} = res;
                    
                    setInfo(ip, city, country, region, timezone, name);

                    mymap.setView([lat + 1.5, lng], 7);

                    L.marker([lat, lng]).addTo(mymap)
                    .bindPopup(`${city}, ${region}<br>${country}`)
                    .openPopup();

                }else {
                    console.log('Error: ' + xhr.status);
                }
            }
        } catch(err) {
            alert('Caught Exception: ' + err.description);
            console.log('onreadystatechange exception:', err);
        }
    };

    xhr.open("GET", KEYS.GEOIPIFY(ipSearcher.value), true);

    xhr.onerror = function () {
        console.log('An error occurred during your request: ' +  request.status + ' ' + request.statusText);
    };


    xhr.send();
}

function setInfo(ip, city, country, region, timezone, isp) {
    const ipInfo = document.querySelector('#ipInfo');

    ipInfo.querySelector('#ipData').textContent = ip;
    ipInfo.querySelector('#locationData').textContent = `${city}, ${region} - ${country}`;
    ipInfo.querySelector('#timezoneData').textContent = `UTC ${timezone}`;
    ipInfo.querySelector('#ispData').textContent = isp;
}
