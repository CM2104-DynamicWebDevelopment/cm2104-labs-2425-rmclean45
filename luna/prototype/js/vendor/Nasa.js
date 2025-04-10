
const apiKey = 'ey9PgFbE6YgOP4mu97PijeWLBDrehFEk3lsVXnn5'; 
const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById('apod-image').src = data.url;
        document.getElementById('apod-title').innerText = data.title;
        document.getElementById('apod-description').innerText = data.explanation;
    })
    .catch(error => console.error('Error fetching the APOD:', error));
