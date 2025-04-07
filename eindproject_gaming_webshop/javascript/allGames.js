const gamesContainer = document.getElementById("all-games-container");
const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
const sortDropdown = document.getElementById("category-sort");

let allGames = [];

async function fetchGameData() {
    try {
        const localGamesCheck = localStorage.getItem("games_json_data");

        if (localGamesCheck) {
            allGames = JSON.parse(localGamesCheck);
            filterAndSortGames();
        } else {
            const response = await fetch("./games.json");
            const data = await response.json();
            allGames = [...data];
            localStorage.setItem("games_json_data", JSON.stringify(allGames));
            filterAndSortGames();
        }
    } catch (error) {
        console.error("Error fetching game data:", error);
    }
}

// als tijd code aanpassen dat als vinken NIET gevinkt zijn, alle games worden displayed (andersom van wat ik nu heb)
// zorgt ervoor dat alle vakjes zijn gevinkt en alle games zijn geladen
function filterGames(game_filter) {
    const activeFilters = Array.from(filterCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    return game_filter.filter(game => {
        const matchesGenre = activeFilters.includes(game.genre);

        return matchesGenre;
    });
}

// zorgt ervoor dat de pagina de games laadt aan de hand van welke vakjes zijn gevinkt
function sortGames(game_filter) {
    const sortOption = sortDropdown.value;

    game_filter.forEach(game => {
        if (typeof game.likes !== "number") {
            console.warn(`Likes is geen nummer voor game ${game.title}. Parsing nodig.`);
            game.likes = Number(game.likes);
        }
        if (typeof game.releaseDate === "string") {
            const parsedDate = Date.parse(game.releaseDate);
            if (!isNaN(parsedDate)) {
                game.releaseDate = new Date(parsedDate);
            } else {
                console.error(`ReleaseDate kan niet worden geparsed voor game: ${game.title}. Datum: ${game.releaseDate}`);
                game.releaseDate = new Date();
            }
        }
    });

    switch (sortOption) {
        case "all":
            return game_filter.sort((a, b) => a.id - b.id);
        case "prijsGoedkoopEerst":
            return game_filter.sort((a, b) => a.prijs - b.prijs);
        case "prijsDuurEerst":
            return game_filter.sort((a, b) => b.prijs - a.prijs);
        case "topRatedEerst":
            return game_filter.sort((a, b) => b.likes - a.likes);
        case "bottomRatedEerst":
            return game_filter.sort((a, b) => a.likes - b.likes);
        case "nieuwsteRelease":
            return game_filter.sort((a, b) => b.releaseDate - a.releaseDate);
        case "oudsteRelease":
            return game_filter.sort((a, b) => a.releaseDate - b.releaseDate);
        case "alfabetischeVolgorde":
            return game_filter.sort((a, b) => a.title.localeCompare(b.title));
        case "alfabetischeVolgordeReverse":
            return game_filter.sort((a, b) => b.title.localeCompare(a.title));
        default:
            console.error("Onbekende sorteeroptie:", sortOption);
            return game_filter;
    }
}

function filterAndSortGames() {
    const filteredGames = filterGames(allGames);
    const sortedGames = sortGames(filteredGames);

    displayGames(filteredGames);
}

// dit laadt de intro's van games + de cards omdraaien qua plek 
function displayGames(games) {
    const container = document.getElementById("all-games-container");
    container.innerHTML = "";

    games.forEach(game => {
        const card = document.createElement("div");
        card.className = "card";

        // Elementen binnen de card-body
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = game.title;

        const description = document.createElement("p");
        description.className = "card-text";
        description.textContent = game.inleiding;

        const buttonZieMeer = document.createElement("button");
        buttonZieMeer.className = "btn btn-primary";
        buttonZieMeer.textContent = "Zie meer!";
        buttonZieMeer.onclick = () => goToGameInfoPage(game.id);

        const buttonItemToCart = document.createElement("button");
        buttonItemToCart.className = "btn2 btn2-succes";
        buttonItemToCart.textContent = "Voeg toe!";
        buttonItemToCart.onclick = () => addToCart(game); // Stuur het volledige game object door

        const img = document.createElement("img");
        img.className = "card-img";
        img.src = game.image ?? "images/placeholder.jpg";
        img.alt = game.title;

        // Samenvoegen van de elementen
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(buttonZieMeer);
        cardBody.appendChild(buttonItemToCart);

        card.appendChild(cardBody);
        card.appendChild(img);

        container.appendChild(card);
    });
}

function addToCart(game) {
    const cartGames = JSON.parse(localStorage.getItem("winkelwagentje")) ?? [];

    console.log("Current cart games:", cartGames);

    const existingGameIndex = cartGames.findIndex(item => item.id === game.id);
    console.log("Game index in cart:", existingGameIndex);

    if (existingGameIndex === -1) {
        cartGames.push({
            ...game,
            quantity: 1
        });
        console.log("Game added to cart:", game);
    } else {
        cartGames[existingGameIndex].quantity += 1;
        console.log("Updated game in cart:", cartGames[existingGameIndex]);
    }

    localStorage.setItem("winkelwagentje", JSON.stringify(cartGames));

    if (existingGameIndex === -1) {
        alert("Game is toegevoegd aan winkelwagen!");
    } else {
        alert("Hoeveelheid bijgewerkt in winkelwagen!");
    }
}

function goToGameInfoPage(gameId) {
    window.location.href = `./infoGamePage.html?id=${gameId}`;
}

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", filterAndSortGames);
});

sortDropdown.addEventListener("change", filterAndSortGames);

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
    fetchGameData();
    updateCartBadge();
});