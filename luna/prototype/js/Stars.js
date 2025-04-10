// Function to set the initial placeholder image when the page loads
function setInitialImage() {
    const image = document.getElementById('starImage');
    image.src = 'Photos/Stars.jpeg'; 
}

function getStarInfo() {
    const name = document.getElementById('starSelect').value;

    if (!name) {
        document.getElementById('result').textContent = '';
        updateImage(); 
        return;
    }

    const apiUrl = `https://api.api-ninjas.com/v1/stars?name=${name}`;
    const xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open('GET', apiUrl, true);
    xhr.setRequestHeader('X-Api-Key', 'tilMs7j7VB+ufQboj5Hedw==HI3O4AniBJ11cEJG'); // Find a way to hide

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            if (data.length > 0) {
                const star = data[0];
                const displayInfo = `
                    Name: ${star.name || 'N/A'}
                    Constellation: ${star.constellation !== null ? star.constellation : 'N/A'}
                    Brightness of the star (the lower number, the brighter it is): ${star.absolute_magnitude !== null ? star.absolute_magnitude + ' %' : 'N/A'}
                    Distance in light years: ${star.distance_light_year !== null ? star.distance_light_year + ' Light years' : 'N/A'}
                `;
                document.getElementById('result').textContent = displayInfo;
                updateImage(); // Update image when star is selected
            } else {
                document.getElementById('result').textContent = ''; // Clear the result
                updateImage(); 
            }
        } else {
            document.getElementById('result').textContent = `Error: ${xhr.status} ${xhr.statusText}`;
            updateImage(); // Ensure the image is hidden 
        }
    };

    // Send the request
    xhr.send();
}

function updateImage() {
    const name = document.getElementById('starSelect').value;
    const image = document.getElementById('starImage');

    if (name) {
        const imagePath = `Photos/${name.toLowerCase()}.jpeg`;

        // Make an AJAX request to check if image exists
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', imagePath, true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                image.src = imagePath;
                image.alt = `${name} Image`;
                image.style.display = 'block'; // Shows the image
            } else { // If image doesn't exist, hide the image
                image.src = '';
                image.style.display = 'none';
            }
        };

        xhr.send();
    } else {
        // Show original image if no star is selected
        image.src = 'Photos/Stars.jpeg';
        image.style.display = 'block';
    }
}

// Set the initial image on page load
window.onload = function() {
    setInitialImage();
};


