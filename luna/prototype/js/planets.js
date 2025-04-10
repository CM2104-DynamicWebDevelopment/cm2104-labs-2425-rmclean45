// Function to set the initial placeholder image when the page loads
function setInitialImage() {
    const image = document.getElementById('planetImage');
    image.src = 'Photos/Planets.jpeg'; // Sets default image to Planets.jpeg
    image.style.display = 'block'; 
}

function getPlanetInfo() {
    const name = document.getElementById('planetSelect').value;

    // If no planet is selected, clear the result and show Planets.jpeg
    if (!name) {
        document.getElementById('result').textContent = 'Pick a planet!';
        updateImage(); 
        return;
    }

    const apiUrl = `https://api.api-ninjas.com/v1/planets?name=${name}`;
    const xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open('GET', apiUrl, true);
    xhr.setRequestHeader('X-Api-Key', 'tilMs7j7VB+ufQboj5Hedw==HI3O4AniBJ11cEJG'); // Find a way to hide

    // Define the function to handle the response
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            if (data.length > 0) {
                const planet = data[0];
                const displayInfo = `
                    Name: ${planet.name || 'N/A'}
                    Weight: ${planet.mass !== null ? planet.mass + ' x 1e27 kg' : 'N/A'}
                    Diameter of the planet compared to Jupiter: ${planet.radius !== null ? planet.radius : 'N/A'}
                    Average Surface Temperature: ${planet.temperature !== null ? (planet.temperature - 273.15).toFixed(2) + ' °C' : 'N/A'}
                    How long to go around the Sun: ${planet.period !== null ? planet.period + ' earth days' : 'N/A'}
                `;
                document.getElementById('result').textContent = displayInfo;
                updateImage();
            } else {
                document.getElementById('result').textContent = ''; // Clear the result
                updateImage(); 
            }
        } else {
            document.getElementById('result').textContent = `Error: ${xhr.status} ${xhr.statusText}`;
            updateImage(); 
        }
    };

    // Send the request
    xhr.send();
}

function updateImage() {
    const name = document.getElementById('planetSelect').value;
    const image = document.getElementById('planetImage');

    if (name) {
        const imagePath = `Photos/${name.toLowerCase()}.jpeg`;

        //check image exists
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', imagePath, true);

        xhr.onload = function() {
            if (xhr.status === 200) {// if image exists show it
                image.src = imagePath;
                image.alt = `${name} Image`;
                image.style.display = 'block'; 
            } else {// If the image doesn't exist hide it 
                image.src = '';
                image.style.display = 'none';
            }
        };

        // Send the request to check the image
        xhr.send();
    } else {
        image.src = 'Photos/Planets.jpeg';
        image.style.display = 'block'; 
    }
}

// Set the initial image on page load
window.onload = function() {
    setInitialImage(); 
};
