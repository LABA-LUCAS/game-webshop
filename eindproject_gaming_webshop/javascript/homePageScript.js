async function fetchGameData() {
    try {
        const localStorageKey = "games_json_data";

        // Check if data exists in localStorage
        const storedData = localStorage.getItem(localStorageKey);
        let data;

        if (storedData) {
            try {
                console.log("Lesgooo de data komt door!");
                data = JSON.parse(storedData);
            } catch (parseError) {
                console.error("Oops er is wat fout gegaan.. dan maar de JSON :D");
                const response = await fetch("./games.json");
                if (!response.ok) {
                    throw new Error("Error fetching game data");
                }
                data = await response.json();
                localStorage.setItem(localStorageKey, JSON.stringify(data));
                console.log("Game data stored in localStorage.");
            }
        } else {
            console.log("Game data not found in localStorage, fetching from JSON file...");
            const response = await fetch("./games.json");
            if (!response.ok) {
                throw new Error("Error fetching game data");
            }
            data = await response.json();
            localStorage.setItem(localStorageKey, JSON.stringify(data));
            console.log("Game data stored in localStorage.");
        }

        // Sort and limit to 4
        const sortedTopGames = sortByLikes(data);
        const sortedSaleGames = sortBySale(data);

        // Display top games and sale games
        displayGames(sortedTopGames, "top-games-container");
        displayGames(sortedSaleGames, "sale-games-container");

        // Find and display the newest game
        const newestGame = findNewestGame(data);
        displayNewGame(newestGame, "new-game-container");
    } catch (error) {
        console.error("Error:", error);
    }
}

function findNewestGame(games) {
    return games.reduce((newest, game) => {
        const currentGameDate = new Date(game.releaseDate); // Direct gebruik maken van ISO-formaat
        const newestGameDate = newest.releaseDate ? new Date(newest.releaseDate) : new Date(0);

        return currentGameDate > newestGameDate ? game : newest;
    }, {});
}

function sortByLikes(games) {
    return games.sort((a, b) => b.likes - a.likes).slice(0, 4);
}

function sortBySale(games) {
    return games.sort((a, b) => b.sale - a.sale).slice(0, 4);
}

function displayGames(games, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }

    container.innerHTML = "";

    games.forEach(game => {
        const card = document.createElement("div");
        card.className = "col-md-3";
        card.innerHTML = `
            <div class="card">
                <a href="./infoGamePage.html?id=${game.id}">
                    <img src="${game.image ?? 'images/placeholder.jpg'}" class="card-img-top game-img" alt="${game.title}">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${game.title}</h5>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function displayNewGame(game, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }

    container.innerHTML = "";

    const card = document.createElement("div");
    card.className = "col-md-6 mx-auto";
    card.innerHTML = `
        <div class="card">
            <a href="infoGamePage.html?id=${game.id}">
            <img src="${game.image ?? 'images/placeholder.jpg'}" class="card-img-top" alt="${game.title}">
            </a>
            <div class="card-body">
                <h5 class="card-title">${game.title}</h5>
                <p>Release Date: ${game.releaseDate}</p>
            </div>
        </div>
    `;

    container.appendChild(card);
}

function updateCartBadge() {
    const cartGames = JSON.parse(localStorage.getItem("winkelwagentje")) ?? [];
    const badge = document.getElementById("cart-badge");

    const totalItems = cartGames.reduce((sum, game) => sum + (game.quantity ?? 1), 0);

    if (totalItems > 0) {
        badge.style.display = "flex";
        badge.textContent = totalItems > 9 ? "+9" : totalItems;
    } else {
        badge.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event gestart!");
    fetchGameData();
    updateCartBadge();
});