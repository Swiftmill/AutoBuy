// Fonction pour ajouter le bouton "Auto Buy" sur la page
function addAutoBuyButton() {
    const autoBuyButton = document.createElement('button');
    autoBuyButton.textContent = "Auto Buy";
    autoBuyButton.style.position = "fixed";
    autoBuyButton.style.bottom = "20px";
    autoBuyButton.style.left = "50%";
    autoBuyButton.style.transform = "translateX(-50%)";
    autoBuyButton.style.padding = "15px 30px";
    autoBuyButton.style.backgroundColor = "#2d2d2d"; // Sombre
    autoBuyButton.style.color = "#fff";
    autoBuyButton.style.fontSize = "16px";
    autoBuyButton.style.fontFamily = "monospace";
    autoBuyButton.style.border = "none";
    autoBuyButton.style.borderRadius = "5px";
    autoBuyButton.style.cursor = "pointer";
    autoBuyButton.style.zIndex = "9999";
    autoBuyButton.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.6)";

    document.body.appendChild(autoBuyButton);

    // Ajouter l'événement au bouton "Auto Buy"
    autoBuyButton.addEventListener('click', () => {
        autoBuyButton.style.display = "none"; // Cache le bouton "Auto Buy" après le clic
        addAutoBuyPopup(); // Afficher la popup de Auto Buy
    });
}

// Fonction pour ajouter la popup "Auto Buy"
function addAutoBuyPopup() {
    const popup = document.createElement('div');
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.width = "400px";
    popup.style.height = "400px";
    popup.style.backgroundColor = "#1e1e1e"; // Sombre
    popup.style.color = "#fff";
    popup.style.fontFamily = "Roboto, sans-serif";
    popup.style.padding = "20px";
    popup.style.zIndex = "9999";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.6)";
    popup.innerHTML = `
        <h1 style="text-align: center;">Auto Buy - Achat de l'item</h1>
        <div id="item-info">
            <p><strong>Nom de l'item:</strong> <span id="item-name">Nom de l'objet</span></p>
            <p><strong>Prix:</strong> <span id="item-price">0 Robux</span></p>
            <p><strong>Robux disponibles:</strong> <span id="available-robux"></span></p>
        </div>
        <div style="display: flex; justify-content: center; gap: 20px;">
            <button id="buy-button" style="background-color: #00ff00; padding: 10px; color: #fff; border: none; cursor: pointer; border-radius: 5px; font-weight: bold;">Acheter</button>
            <button id="cancel-button" style="background-color: #ff0000; padding: 10px; color: #fff; border: none; cursor: pointer; border-radius: 5px; font-weight: bold;">Annuler</button>
        </div>
        <p id="remaining-robux" style="text-align: center; margin-top: 20px;"></p>
        <div style="text-align: center; margin-top: 20px;">
            <button id="add-robux" style="background-color: #007bff; padding: 10px; color: #fff; border: none; cursor: pointer; border-radius: 5px; font-weight: bold;">Acheter des Robux</button>
        </div>
    `;

    document.body.appendChild(popup);

    const buyButton = document.getElementById('buy-button');
    const cancelButton = document.getElementById('cancel-button');
    const addRobuxButton = document.getElementById('add-robux');
    const remainingRobux = document.getElementById('remaining-robux');
    const itemNameElement = document.getElementById('item-name');
    const itemPriceElement = document.getElementById('item-price');
    const availableRobuxElement = document.getElementById('available-robux');

    // Récupérer le solde des Robux actuel
    let fakeRobux = parseInt(localStorage.getItem('robux')) || 0; // Par défaut à 0
    updateNavRobuxAmount(fakeRobux);

    // Obtenir les informations de l'item
    const itemName = document.querySelector('.item-details-name-row h1')?.textContent || "Nom de l'objet non trouvé";
    const itemPrice = parseInt(document.querySelector('.item-price-value .text-robux-lg')?.textContent.replace(/[^\d]/g, '')) || 0;

    itemNameElement.textContent = itemName;
    itemPriceElement.textContent = `${itemPrice} Robux`;
    availableRobuxElement.textContent = formatNumber(fakeRobux);

    // Calculer le reste après achat
    remainingRobux.textContent = `Il vous restera: ${formatNumber(fakeRobux - itemPrice)} Robux`;

    // Vérification si l'item est déjà acheté
    const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || [];
    const itemID = itemName + '-' + itemPrice;
    if (purchasedItems.some(item => item.id === itemID)) {
        // Si l'item est acheté, masquer le bouton "Acheter"
        buyButton.disabled = true;
        buyButton.textContent = 'Déjà acheté';
        remainingRobux.textContent = `Vous possédez déjà cet item.`;
    }

    // Gestion de l'achat
    buyButton.addEventListener('click', () => {
        if (fakeRobux >= itemPrice) {
            fakeRobux -= itemPrice;
            localStorage.setItem('robux', fakeRobux);
            saveItemPurchase(itemName, itemPrice); // Sauvegarde de l'achat dans le storage
            updateNavRobuxAmount(fakeRobux);
            updateItemAfterPurchase(itemName, itemPrice); // Mise à jour de l'item après l'achat
            alert('Achat effectué avec succès !');
            
            // Fermer l'interface après achat
            document.body.removeChild(popup);
        } else {
            alert('Erreur: Fond insuffisant pour cet achat.');
        }
    });

    // Annuler
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    // Ajouter des Robux
    addRobuxButton.addEventListener('click', () => {
        const robuxToAdd = parseInt(prompt("Entrez le nombre de Robux à ajouter :"));
        if (!isNaN(robuxToAdd) && robuxToAdd > 0) {
            fakeRobux += robuxToAdd;
            localStorage.setItem('robux', fakeRobux);
            updateNavRobuxAmount(fakeRobux);
            alert(`${formatNumber(robuxToAdd)} Robux ajoutés avec succès !`);
            location.reload(); // Recharge la page après l'ajout de Robux
        } else {
            alert("Veuillez entrer un nombre valide de Robux.");
        }
    });
}

// Fonction pour sauvegarder les achats des items dans localStorage
function saveItemPurchase(itemName, itemPrice) {
    const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || [];
    const itemID = itemName + '-' + itemPrice; // Crée un identifiant unique pour l'item
    if (!purchasedItems.some(item => item.id === itemID)) {
        purchasedItems.push({ id: itemID, name: itemName, price: itemPrice });
        localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));
    }
}

// Mise à jour de l'élément de l'item après l'achat
function updateItemAfterPurchase(itemName, itemPrice) {
    const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || [];
    const itemID = itemName + '-' + itemPrice;

    if (purchasedItems.some(item => item.id === itemID)) {
        const itemDetailsContainer = document.querySelector('.item-details-info-content');
        if (itemDetailsContainer) {
            const priceRow = itemDetailsContainer.querySelector('.price-row-container');
            if (priceRow) {
                priceRow.innerHTML = `
                    <div class="price-container-text">
                        <div class="item-first-line">Cet objet se trouve dans ton inventaire.</div>
                    </div>
                    <a id="edit-avatar-button" href="/my/avatar" class="btn-control-md">
                        <span class="icon-nav-charactercustomizer"></span>
                    </a>
                `;
            }

            const purchaseButton = itemDetailsContainer.querySelector('.shopping-cart-btn');
            if (purchaseButton) {
                purchaseButton.innerHTML = `<span>Objet possédé</span>`;
            }

            const creatorContainer = document.querySelector('.item-details-creator-container');
            if (creatorContainer) {
                const ownedMessage = document.createElement('span');
                ownedMessage.classList.add('item-owned');
                ownedMessage.innerHTML = `
                    <div class="label-checkmark">
                        <span class="icon-checkmark-white-bold"></span>
                    </div>
                    <span>Objet possédé</span>
                `;
                creatorContainer.appendChild(ownedMessage);
            }
        }
    }
}

// Mettre à jour le solde de Robux dans la barre de navigation
function updateNavRobuxAmount(robux) {
    const navRobuxAmount = document.getElementById('nav-robux-amount');
    if (navRobuxAmount) {
        navRobuxAmount.textContent = formatRobuxAbbreviation(robux);
    }
}

// Formater un nombre avec des abréviations
function formatRobuxAbbreviation(number) {
    if (number >= 1_000_000_000) return `${Math.floor(number / 1_000_000_000)}B+`;
    if (number >= 1_000_000) return `${Math.floor(number / 1_000_000)}M+`;
    if (number >= 1_000) return `${Math.floor(number / 1_000)}k+`;
    return number.toString();
}

// Formater un nombre avec des virgules
function formatNumber(number) {
    return number.toLocaleString();
}

// Charger les données et appliquer les mises à jour au chargement
window.addEventListener('load', () => {
    const storedRobux = parseInt(localStorage.getItem('robux')) || 0;
    updateNavRobuxAmount(storedRobux);

    addAutoBuyButton();
});
