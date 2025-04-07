async function loadGameInfo() {
    try {
        // Haal de queryparameter 'id' op uit de URL
        const params = new URLSearchParams(window.location.search);
        const gameId = parseInt(params.get("id"), 10);

        if (!gameId) {
            throw new Error("Geen geldig game-ID gevonden in de URL.");
        }

        // Controleer localStorage op bestaande game data
        const localGameData = JSON.parse(localStorage.getItem("games_json_data")) ?? [];
        let game = localGameData.find(g => g.id === gameId);

        if (!game) {
            console.log("Game niet gevonden in localStorage. Ophalen uit JSON...");
            const response = await fetch("./games.json");

            if (!response.ok) {
                throw new Error(`Fout bij ophalen van gegevens: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            game = data.find(g => g.id === gameId);

            if (!game) {
                throw new Error("Geen game gevonden met het opgegeven ID.");
            }

            localStorage.setItem("games_json_data", JSON.stringify(data));
        }

        // Toon game-informatie
        displayGameInfo(game);
    } catch (error) {
        document.getElementById("game-info").innerHTML = `<p>Er is een fout opgetreden: ${error.message}</p>`;
    }
}

function displayGameInfo(game) {
    const container = document.getElementById("gamesContainer");
    if (!container) {
        console.error("gamesContainer element ontbreekt in HTML!");
        return;
    }

    container.innerHTML = "";

    const specificatiesHTML = game.specificaties
        ? Object.entries(game.specificaties).map(([key, value]) => `
            <li><strong>${key}:</strong> ${value}</li>
        `).join('')
        : '<li>Geen extra specificaties beschikbaar.</li>';

    container.innerHTML = `
        <div class="image-container">
            <img src="${game.image ?? 'images/placeholder.jpg'}" alt="${game.title}">
        </div>
        <div class="info-container">
            <div class="intro-card">
                <h5>${game.title}</h5>
                <p>${game.inleiding}</p>
            </div>
            <div class="price-and-button">
                <p><strong>Prijs:</strong> €${game.prijs}</p>
                <button class="btn btn-primary" onclick="addToCart(${game.id})">Toevoegen aan winkelwagen</button>
            </div>
        </div>
        <div class="description">
            <ul>
                <li><strong>Likes:</strong> ${game.likes ?? 'Geen informatie beschikbaar'}</li>
                <li><strong>Genre:</strong> ${game.genre ?? 'Geen genre beschikbaar'}</li>
                <li><strong>Release Datum:</strong> ${game.releaseDate ?? 'Geen datum beschikbaar'}</li>
                ${specificatiesHTML}
            </ul>
        </div>
    `;
}

function addToCart(gameId) {
    // Haal game op uit localStorage
    const localGameData = JSON.parse(localStorage.getItem("games_json_data")) ?? [];
    const game = localGameData.find(g => g.id === gameId);

    if (!game) {
        alert("Game niet gevonden!");
        return;
    }

    // Controleer of game al in winkelwagen staat
    const cartGames = JSON.parse(localStorage.getItem("winkelwagentje")) ?? [];
    const existingGameIndex = cartGames.findIndex(item => item.id === game.id);

    if (existingGameIndex === -1) {
        // Voeg game toe aan winkelwagen inclusief alle eigenschappen, zoals image
        cartGames.push({ ...game, quantity: 1 });
        alert("Game is toegevoegd aan winkelwagen!");
    } else {
        // Verhoog hoeveelheid als game al aanwezig is
        cartGames[existingGameIndex].quantity += 1;
        alert("Hoeveelheid bijgewerkt in winkelwagen!");
    }

    // Sla bijgewerkte winkelwagen op in localStorage
    console.log("Winkelwagentje data wordt opgeslagen:", cartGames);
    localStorage.setItem("winkelwagentje", JSON.stringify(cartGames));
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
    loadGameInfo();
    updateCartBadge();
});