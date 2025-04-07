document.addEventListener("DOMContentLoaded", () => {
    // Nieuwe game preview
    const previewButtonNewGame = document.getElementById("previewNewGame");
    const imageInputNewGame = document.getElementById("image_of_game");

    previewButtonNewGame.addEventListener("click", (event) => {
        event.preventDefault(); // Voorkom standaard gedrag

        const previewImage = document.getElementById("previewImage");

        const file = imageInputNewGame.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file); 
        } else {
            // Fallback naar placeholder
            previewImage.src = "images/placeholder.jpg";
        }

        // Dit activeert de modal
        const previewModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("previewModal"));
        previewModal.show();
    });

    // Edit game preview
    const previewButtonEditGame = document.getElementById("previewEditGame");
    const imageInputEditGame = document.getElementById("gameImage");

    previewButtonEditGame.addEventListener("click", (event) => {
        event.preventDefault();

        const previewImage = document.getElementById("previewImage");

        // Validatie van afbeelding via FileReader
        const file = imageInputEditGame.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result; // Stel afbeelding in op resultaat
            };
            reader.readAsDataURL(file); // Lees bestand als Base64
        } else {
            // Fallback naar placeholder
            previewImage.src = "images/placeholder.jpg";
        }

        // Dit activeert de modal
        const previewModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("previewModal"));
        previewModal.show();
    });
});

const fetchAndDisplayGames = () => {
    let gamesData = JSON.parse(localStorage.getItem("games_json_data"));

    // Als dat niet lukt, lees data uit games.json 
    if (!gamesData ?? gamesData.length === 0) {
        fetch("games.json")
            .then(response => response.json())
            .then(data => {
                gamesData = data;
                localStorage.setItem("games_json_data", JSON.stringify(gamesData));
                displayGamesTable(gamesData);
            })
            .catch(error => console.error("Fout bij het ophalen van games.json:", error));
    } else {
        displayGamesTable(gamesData);
    }
};

const displayGamesTable = (gamesData) => {
    const gamesTable = document.querySelector("#gamesTable tbody");
    gamesTable.innerHTML = "";

    gamesData.forEach((game) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${game.id}</td>
            <td>${game.title}</td>
            <td>${game.prijs}</td>
            <td><img src="${game.image}" alt="${game.title}" width="50"></td>
            <td>
                <button class="btn btn-warning edit-btn" data-id="${game.id}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${game.id}">Delete</button>
            </td>
        `;
        gamesTable.appendChild(row);
    });
};

const showSection = (sectionId) => {
    hideAllSections(sectionId);
};

const deleteProduct = (gameId) => {
    let gamesData = JSON.parse(localStorage.getItem("games_json_data")) ?? [];
    gamesData = gamesData.filter(game => game.id !== gameId);
    localStorage.setItem("games_json_data", JSON.stringify(gamesData));
    fetchAndDisplayGames();
};

const hideAllSections = (activeSectionId) => {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = section.id === activeSectionId ? "block" : "none";
    });
};

function displayProductsFromAdmin() {
    document.querySelector("#gamesTable tbody").addEventListener("click", (event) => {
        const target = event.target;
        const gameId = parseInt(target.dataset.id, 10);

        if (target.classList.contains("delete-btn")) {
            deleteProduct(gameId);
        } else if (target.classList.contains("edit-btn")) {
            showSection("edit_games");
            editProduct(gameId);
        }
    });

    // Reset-knop
    if (!document.querySelector(".reset-button")) { // Checkt of de knop al bestaat
        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        resetButton.className = "reset-button";
        document.querySelector("header").appendChild(resetButton);
    
        resetButton.addEventListener("click", () => {
            fetch("games.json")
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem("games_json_data", JSON.stringify(data));
                    fetchAndDisplayGames();
                })
                .catch(error => console.error("Fout bij het ophalen van games.json:", error));
        });
    }
    
    // Toon tabbladen en secties
    document.querySelector("#addGame").addEventListener("click", () => {
        showSection("add_games");
    });

    document.querySelector("#nav-orders-tab").addEventListener("click", () => {
        showSection("nav-orders");
        ordersForAdmin();
    });

    document.querySelector("#nav-products-tab").addEventListener("click", () => {
        showSection("products");
    });

    document.querySelectorAll(".back-button").forEach(button => {
        button.addEventListener("click", () => {
            showSection("products");
        });
    });

    // Specifieke knop met tekst "Ga terug"
    document.querySelectorAll("button").forEach(button => {
        if (button.textContent.trim() === "Ga terug") {
            button.addEventListener("click", () => {
                showSection("products");
            });
        }
    });

    showSection("products");
    fetchAndDisplayGames();
}

document.addEventListener("DOMContentLoaded", displayProductsFromAdmin);

// ============================ Add Product ============================
const addGameForm = document.querySelector("#addGameForm");
const imageInput = document.querySelector("#image_of_game");
const addGameTitleInput = document.querySelector("#title_of_game");
const addGamePriceInput = document.querySelector("#price_of_game");

addGameForm.addEventListener("submit", async (event) => {
    console.log('here');
    event.preventDefault();

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const imageBase64 = reader.result;

        let gamesData = JSON.parse(localStorage.getItem("games_json_data")) ?? [];
        const newGameId = gamesData.length + 1;

        const newGame = {
            id: newGameId,
            title: addGameTitleInput.value.trim(),
            prijs: parseFloat(addGamePriceInput.value.trim()),
            image: imageBase64
        };

        gamesData.push(newGame);
        localStorage.setItem("games_json_data", JSON.stringify(gamesData));

        displayProductsFromAdmin();
        showSection("products");
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        alert("Upload een afbeelding!");
    }
});

// ============================ Edit Product ============================
document.addEventListener("DOMContentLoaded", () => {
    const editGameForm = document.querySelector("#editGameForm");
    const editgameTitleInput = document.querySelector("#gameTitle");
    const editgamePriceInput = document.querySelector("#gamePrice");
    const gameImageInput = document.querySelector("#gameImage");
    let gameIdToEdit = null;

    document.querySelector("#gamesTable tbody").addEventListener("click", (event) => {
        const target = event.target;

        if (target.classList.contains("edit-btn")) {
            const gameId = parseInt(target.dataset.id, 10);
            const gamesData = JSON.parse(localStorage.getItem("games_json_data")) ?? [];
            const gameToEdit = gamesData.find(game => game.id === gameId);

            if (!gameToEdit) {
                alert("Game not found!");
                return;
            }

            gameIdToEdit = gameId;

            editgameTitleInput.value = gameToEdit.title;
            editgamePriceInput.value = gameToEdit.price;
            // Display placeholder or existing image
            gameImageInput.setAttribute("data-current-image", gameToEdit.image);

            showSection("edit_games");
        }
    });

    editGameForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (gameIdToEdit !== null) {
            const gamesData = JSON.parse(localStorage.getItem("games_json_data")) ?? [];
            const gameToEdit = gamesData.find(game => game.id === gameIdToEdit);

            if (gameToEdit) {
                gameToEdit.title = editgameTitleInput.value.trim();
                gameToEdit.prijs = parseFloat(editgamePriceInput.value.trim());

                const file = gameImageInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        gameToEdit.image = reader.result;
                        localStorage.setItem("games_json_data", JSON.stringify(gamesData));

                        fetchAndDisplayGames();
                        showSection("products");

                        gameIdToEdit = null;
                    };
                    reader.readAsDataURL(file);
                } else {
                    gameToEdit.image = gameImageInput.getAttribute("data-current-image");

                    localStorage.setItem("games_json_data", JSON.stringify(gamesData));

                    fetchAndDisplayGames();
                    showSection("products");

                    gameIdToEdit = null; 
                }
            } else {
                alert("Error: Game not found while saving.");
            }
        } else {
            alert("No game is currently being edited.");
        }
    });
});

// ============================ Orders ============================
function ordersForAdmin() {
    const ordersTableBody = document.querySelector("#ordersTable tbody");
    const noOrdersMessage = document.querySelector("#noOrdersMessage");

    const ordersData = JSON.parse(localStorage.getItem("orders")) ?? [];

    if (ordersData.length === 0) {
        noOrdersMessage.style.display = "block";
        ordersTableBody.innerHTML = "";
        return;
    }

    noOrdersMessage.style.display = "none";
    ordersTableBody.innerHTML = "";

    ordersData.forEach((order, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Order ID begint bij 1 -->
            <td>${order.amountOrdered}</td> <!-- Aantal producten -->
            <td>${order.dateTime}</td> <!-- Datum en tijd -->
        `;
        ordersTableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#nav-orders-tab").addEventListener("click", () => {
        ordersForAdmin();
        document.querySelector("#nav-orders").style.display = "block";
    });
});