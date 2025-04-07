document.addEventListener("DOMContentLoaded", async () => {

        const saveToLocalStorage = (key, data) => {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Data saved to localStorage under key '${key}'.`);
        };

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

        document.addEventListener("DOMContentLoaded", async () => {
            try {
                await fetchAndDisplayGames();
                updateCartBadge();
            } catch (error) {
                console.error("Error:", error);
            }
        });

        const fetchAndDisplayGames = async () => {
            let gamesData;

            const localData = localStorage.getItem("winkelwagentje");
            if (localData) {
                try {
                    gamesData = JSON.parse(localData);
                    console.log("Data loaded from localStorage.");
                } catch (error) {
                    console.error("Error reading localStorage data:", error);
                    gamesData = null;
                }
            }

            // Als er geen geldige data in localStorage is, pech :p
            if (!gamesData) {
                console.log("No valid data in localStorage. The cart will remain empty until something is added.");
                gamesData = [];
            }

            // Controleer op toevoegingen aan localStorage (bijv. updates)
            const existingData = JSON.parse(localStorage.getItem("winkelwagentje"));
            if (JSON.stringify(existingData) !== JSON.stringify(gamesData)) {
                console.log("Detected new data in localStorage, synchronizing.");
                saveToLocalStorage("winkelwagentje", gamesData);
            }

            // Laad de games in de winkelwagen
            const cartGames = JSON.parse(localStorage.getItem("winkelwagentje")) ?? [];
            if (cartGames.length === 0) {
                showEmptyCartMessage();
            } else {
                generateCartTable(cartGames);
                updateTotalPrice(cartGames);
            }

            updateCartBadge(); // Update de badge
        };

        await fetchAndDisplayGames();

        document.getElementById("clear-cart").addEventListener("click", () => {
            localStorage.removeItem("winkelwagentje");
            showEmptyCartMessage();
            updateCartBadge();
        });

        document.getElementById("checkout-button").addEventListener("click", () => {
            const cartGames = JSON.parse(localStorage.getItem("winkelwagentje")) ?? [];
            if (cartGames.length > 0) {
                const existingOrders = JSON.parse(localStorage.getItem("orders")) ?? [];
                const newOrder = {
                    id: existingOrders.length + 1,
                    amountOrdered: cartGames.length,
                    dateTime: new Date().toLocaleString(),
                    games: cartGames,
                };
                existingOrders.push(newOrder);
                localStorage.setItem("orders", JSON.stringify(existingOrders));

                const myModal = new bootstrap.Modal(document.getElementById('thankYouModal'), {
                    backdrop: 'static', // Dit zorgt ervoor dat erbuiten klikken niet werkt
                    keyboard: false // Hierdoor gaat het niet weg met escape
                });
                myModal.show();
                

                localStorage.removeItem("winkelwagentje");
                updateCartBadge();
            }
        });
});

function showEmptyCartMessage() {
    const container = document.getElementById("sale-games-container");
    container.innerHTML = `
        <div class="text-center">
            <img src="images/leeg_winkelwagentje.png" alt="Empty Cart" style="max-width: 200px;">
            <p><strong>Oh het lijkt erop dat je cart nog leeg is! Kom later terug :D</strong></p>
        </div>
    `;
    document.getElementById("total-price").textContent = "0.00";
}

function generateCartTable(games) {
    const container = document.getElementById("sale-games-container");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "table table-striped";

    const header = `
        <thead>
            <tr>
                <th>Beschrijving</th>
                <th>Genre</th>
                <th>aantal</th>
                <th>Prijs (€)</th>
            </tr>
        </thead>
    `;
    table.innerHTML = header;

    const tbody = document.createElement("tbody");
    games.forEach((game, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${game.image}" alt="${game.title}" class="img-thumbnail" style="width: 50px; height: 50px; margin-right: 10px;">
                    <span>${game.title}</span>
                    <button class="btn btn-sm btn-secondary ms-2" onclick="editGame(${game.id})">Zie game</button>
                </div>
            </td>
            <td>${game.genre}</td>
            <td>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-danger me-2" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${game.quantity ?? 1}</span>
                    <button class="btn btn-sm btn-success ms-2" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </td>
            <td>${(game.prijs * (game.quantity ?? 1)).toFixed(2)}</td>
        `;

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

function updateTotalPrice(games) {
    const totalPrice = games.reduce((total, game) => total + (game.prijs * (game.quantity ?? 1)), 0);
    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}

function editGame(gameId) {
    window.location.href = `./infoGamePage.html?id=${gameId}`;
}

function updateQuantity(index, change) {
    const cartGames = JSON.parse(localStorage.getItem("winkelwagentje")) ?? [];
    const game = cartGames[index];
    game.quantity = (game.quantity ?? 1) + change;

    if (game.quantity <= 0) {
        cartGames.splice(index, 1);
    }

    localStorage.setItem("winkelwagentje", JSON.stringify(cartGames));

    generateCartTable(cartGames);
    updateTotalPrice(cartGames);
    updateCartBadge();

    if (cartGames.length === 0) {
        showEmptyCartMessage();
    }
}