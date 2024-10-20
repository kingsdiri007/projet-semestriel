const APIKEY = "3d25fe555b1d4383a9cb36cd548e0a51";
const gameList = document.querySelector("#game-list");
const loadMoreButton = document.querySelector("#load-more-button");

// Track the current page and page size
let currentPage = 1;
const pageSize = 20; // RAWG's default page size

const baseUrl = `https://api.rawg.io/api/games?key=${APIKEY}&dates=2019-01-01,2023-06-19&ordering=-added`;

// Function to generate a random price between 20 and 60
const generatePrice = () => {
    return (Math.random() * (60 - 20) + 20).toFixed(2);
};

const getPlatformStr = (platforms) => {
    const platformStr = platforms.map(pl => pl.platform.name).join(", ");
    if (platformStr.length > 30) {
        return platformStr.substring(0, 30) + "...";
    }
    return platformStr;
}

function handleBuyClick(gameName, price, imageUrl) {
    const gameData = {
        name: gameName,
        price: price,
        image: imageUrl
    };
    
    // Save to localStorage with sanitized key
    const safeGameName = gameName.replace(/[^a-zA-Z0-9]/g, '_');
    localStorage.setItem(`cartItem_${safeGameName}`, JSON.stringify(gameData));
    
    alert(`${gameName} has been added to your cart!`);
}

function createGameRows(games) {
    return games.map(game => {
        const price = generatePrice();
        return `
            <tr>
                <td>
                    <a href="game.html?id=${game.id}">
                        <img src="${game.background_image}" alt="${game.name}" loading="lazy">
                    </a>
                </td>
                <td>
                    <a href="game.html?id=${game.id}">${game.name}</a>
                </td>
                <td>${game.released || 'TBA'}</td>
                <td>${game.platforms ? getPlatformStr(game.platforms) : 'N/A'}</td>
                <td>${game.rating}/5</td>
                <td>$${price}</td>
                <td>
                    <button 
                        class="buy-button" 
                        onclick="handleBuyClick('${game.name.replace(/'/g, "\\'")}', ${price}, '${game.background_image}')">
                        Add to Cart
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function initializeGameTable() {
    gameList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Release Date</th>
                    <th>Platforms</th>
                    <th>Rating</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="games-tbody">
            </tbody>
        </table>
        <div id="load-more-container" class="load-more-container">
            <button id="load-more-btn" class="load-more-btn">Load More Games</button>
        </div>
    `;
}

async function loadGames(isInitialLoad = false) {
    try {
        const url = `${baseUrl}&page=${currentPage}&page_size=${pageSize}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const gamesTableBody = document.querySelector("#games-tbody");
        
        if (data.results && data.results.length > 0) {
            if (isInitialLoad) {
                initializeGameTable();
                gamesTableBody.innerHTML = createGameRows(data.results);
            } else {
                gamesTableBody.insertAdjacentHTML('beforeend', createGameRows(data.results));
            }
            
            // Update load more button visibility
            const loadMoreContainer = document.querySelector("#load-more-container");
            if (loadMoreContainer) {
                loadMoreContainer.style.display = data.next ? "block" : "none";
            }
        } else {
            if (isInitialLoad) {
                gameList.innerHTML = '<p>No games found. Please try again later.</p>';
            }
        }
        
    } catch (error) {
        console.error('Error loading games:', error);
        if (isInitialLoad) {
            gameList.innerHTML = `
                <div class="error-message">
                    <p>Error loading games: ${error.message}. Please try again later.</p>
                </div>
            `;
        } else {
            alert(`Error loading more games: ${error.message}`);
        }
    }
}

// Initial load of games
document.addEventListener('DOMContentLoaded', () => {
    loadGames(true);
    
    // Event delegation for the load more button
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'load-more-btn') {
            const loadMoreBtn = e.target;
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Loading...';
            
            currentPage++;
            await loadGames(false);
            
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Load More Games';
        }
    });
});