const APIKEY = "3d25fe555b1d4383a9cb36cd548e0a51";
const gameList = document.querySelector("#game-list");
const searchForm = document.getElementById('search-form');
const genreSelect = document.getElementById('genre-select');
const url = `https://api.rawg.io/api/games?key=${APIKEY}&dates=2024-01-01,2024-12-31&ordering=-added`;


async function fetchGenres() {
    try {
        const genresResponse = await fetch(`https://api.rawg.io/api/genres?key=${APIKEY}`);
        if (!genresResponse.ok) {
            throw new Error(`HTTP error! status: ${genresResponse.status}`);
        }
        const genresData = await genresResponse.json();
        allGenres = genresData.results;
        populateGenreSelect(allGenres);
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

function populateGenreSelect(genres) {
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.text = genre.name;
        genreSelect.appendChild(option);   

    });
}

async function searchGames(searchTerm, selectedGenre) {
    try {
        const searchParams = new URLSearchParams();
        searchParams.append('key', APIKEY);
        searchParams.append('search', searchTerm);
        searchParams.append('ordering', '-added');
        if (selectedGenre) {
            searchParams.append('genres', selectedGenre);
        }

        const response = await fetch(`https://api.rawg.io/api/games?${searchParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            gameList.innerHTML = createGameTable(data.results);
        } else {
            gameList.innerHTML = '<p>No games found.</p>';
        }
    } catch (error) {
        console.error('Error searching games:', error);
        gameList.innerHTML = `<p>Error searching games: ${error.message}. Please try again later.</p>`;
    }
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = searchForm.elements['search-input'].value.trim();
    const selectedGenre = genreSelect.value;

    searchGames(searchTerm, selectedGenre);
});

// Fetch genres initially
fetchGenres();

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

function createGameTable(games) {
    const rows = [];
    let currentRow = [];

    games.forEach(game => {
        currentRow.push(`
            <td>
                <div class="game-card" id="${game.name.replace(/[^a-zA-Z0-9]/g, '_')}">
                    <h3>${game.name}</h3>
                    <a href="game.html?id=${game.id}">
                        <img src="${game.background_image}" alt="${game.name}">
                    </a>
                    <h3 class="price">$${generatePrice()}</h3>
                    <button class="add-to-cart-button" onclick="handleBuyClick('${game.name.replace(/'/g, "\\'")}', ${generatePrice()}, '${game.background_image}')">Add to Cart</button>
                </div>
            </td>
        `);

        if (currentRow.length === 4) {
            rows.push(`<tr>${currentRow.join('')}</tr>`);
            currentRow = [];
        }
    });

    if (currentRow.length > 0) {
        rows.push(`<tr>${currentRow.join('')}</tr>`);
    }

    return `
        <table>
            <tbody>
                ${rows.join('')}
            </tbody>
        </table>
    `;
}

async function loadGames(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            gameList.innerHTML = createGameTable(data.results);
        } else {
            gameList.innerHTML = '<p>No games found. Please try again later.</p>';
        }
        
    } catch (error) {
        console.error('Error loading games:', error);
        gameList.innerHTML = `<p>Error loading games: ${error.message}. Please try again later.</p>`;
    }
}
// Load games when page loads
loadGames(url);