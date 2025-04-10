const apiKey = 'ey9PgFbE6YgOP4mu97PijeWLBDrehFEk3lsVXnn5'; 
const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        // Check if the image URL is a video
        const apodImageElement = document.getElementById('apod-image');
        const apodTitleElement = document.getElementById('apod-title');
        const apodDescriptionElement = document.getElementById('apod-description');
        
        // If it contains 'youtube.com'
        if (data.url.includes('youtube.com')) {
            // creates an iframe for the YouTube video
            const youtubeId = getYouTubeVideoId(data.url);
            const iframe = document.createElement('iframe');
            iframe.width = "100%";
            iframe.height = "500"; 
            iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;

            // Replace image element with iframe
            apodImageElement.replaceWith(iframe);
            document.getElementById('imageUrl').value = `https://www.youtube.com/embed/${youtubeId}`;  // Embed URL
        } else {
            apodImageElement.src = data.url;
            // Set image URL for the gallery form
            document.getElementById('imageUrl').value = data.url;
        }

        // Set title and description
        apodTitleElement.innerText = data.title;
        apodDescriptionElement.innerText = data.explanation;

        // Set the hidden form fields for submission
        document.getElementById('imageTitle').value = data.title;
        document.getElementById('imageDescription').value = data.explanation;
    })
    .catch(error => console.error('Error fetching the APOD:', error));

    
// Function to extract the YouTube video ID from the URL
function getYouTubeVideoId(url) {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}
