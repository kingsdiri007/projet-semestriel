const APIKEY = "3d25fe555b1d4383a9cb36cd548e0a51";
const gameDetails = document.querySelector("#game-details");

async function loadGameDetails() {
    const gameId = getParameterByName('id');
    if (!gameId) {
        gameDetails.innerHTML = '<p>Error: No game ID provided.</p>';
        return;
    }

    try {
        // Fetch main game details
        const gameResponse = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${APIKEY}`);
        if (!gameResponse.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const game = await gameResponse.json();

        // Fetch screenshots separately
        const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${APIKEY}`);
        const screenshotsData = await screenshotsResponse.ok ? await screenshotsResponse.json() : { results: [] };

        // Fetch clips data from main game response and additional movies
        const moviesResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${APIKEY}`);
        const moviesData = await moviesResponse.ok ? await moviesResponse.json() : { results: [] };

        // Calculate random price (you might want to modify this based on your needs)
        const price = (Math.random() * (60 - 20) + 20).toFixed(2);

        // Determine video source (try clips first, then movies)
        let videoSource = null;
        let videoType = "video/mp4";

        if (game.clip && game.clip.clips && game.clip.clips.full) {
            videoSource = game.clip.clips.full;
        } else if (game.clip && game.clip.clips && game.clip.clips.medium) {
            videoSource = game.clip.clips.medium;
        } else if (game.clip && game.clip.clips && game.clip.clips.small) {
            videoSource = game.clip.clips.small;
        } else if (moviesData.results && moviesData.results.length > 0 && moviesData.results[0].data) {
            videoSource = moviesData.results[0].data.max || moviesData.results[0].data[480];
        }

        const gameHtml = `
            <h1 class="game-title">${game.name}</h1>
            
            <div class="about-section">
                <h2>About</h2>
                <p>${game.description_raw || 'No description available'}</p>
            </div>

            <div class="screenshots-section">
                <h2>Screenshots</h2>
                <div class="game__screenshots">
                    <div class="game__screenshots-inner">
                        <div class="game__screenshots-list">
                            ${screenshotsData.results.slice(0, 6).map(screenshot => `
                                <div class="game__screenshots-item" role="button" tabindex="0">
                                    <img class="game__screenshot-image" 
                                        src="${screenshot.image}" 
                                        loading="lazy"
                                        alt="${game.name} screenshot">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            ${videoSource ? `
                <div class="game-trailer">
                    <h2 id="textgametrailer">Game Trailer</h2>
                    <video id="trailer" controls poster="${game.background_image || ''}">
                        <source src="${videoSource}" type="${videoType}">
                        Your browser does not support the video tag.
                    </video>
                </div>
            ` : `
                <div class="game-trailer">
                    <h2 id="textgametrailer">Game Trailer</h2>
                    <p class="video-error">Video unavailable</p>
                </div>
            `}

            <div class="game-info">
                <p>Release Date: ${game.released || 'Unknown'}</p>
                <p>Rating: ${game.rating || 'N/A'}/5</p>
                <p>Price: $${price}</p>
                ${game.metacritic ? `<p>Metacritic: ${game.metacritic}</p>` : ''}
            </div>

            <button class="buy-button" onclick="handleBuyClick('${game.name.replace(/'/g, "\\'")}', ${price}, '${game.background_image || ''}')">
                Add to Cart
            </button>

            ${game.website ? `
                <div class="website-link">
                    <a href="${game.website}" target="_blank" rel="noopener noreferrer">Visit the official game website</a>
                </div>
            ` : ''}
        `;

    gameDetails.innerHTML = gameHtml;

    // Initialize video if it exists
    const video = document.getElementById('trailer');
    if (video) {
        video.addEventListener('error', (e) => {
            console.error('Error loading video:', e);
            const trailerContainer = video.parentElement;
            if (trailerContainer) {
                trailerContainer.innerHTML = `
                    <h2>Game Trailer</h2>
                    <p class="video-error">Video unavailable</p>
                `;
            }
        });

        // Add loading state
        video.addEventListener('loadstart', () => {
            video.classList.add('loading');
        });

        video.addEventListener('canplay', () => {
            video.classList.remove('loading');
        });
    }

} catch (error) {
    console.error('Error loading game details:', error);
    gameDetails.innerHTML = `
        <div class="error-message">
            <p>Error loading game details: ${error.message}. Please try again later.</p>
        </div>
    `;
}
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function handleBuyClick(gameName, price, imageUrl) {
    const gameData = {
        name: gameName,
        price: price,
        image: imageUrl,
        addedAt: new Date().toISOString()
    };

    const safeGameName = gameName.replace(/[^a-zA-Z0-9]/g, '_');

    try {
        localStorage.setItem(`cartItem_${safeGameName}`, JSON.stringify(gameData));
        alert(`${gameName} has been added to your cart!`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add game to cart. Please try again.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadGameDetails();
});
