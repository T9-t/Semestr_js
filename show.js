function nextPage() {

    let name = document.getElementById("user_name").value;

    document.title = `Привет, ${name}!`;
    document.getElementById("salutation_text").textContent = `Привет, ${name}!`;

    document.getElementById("salutation_page").style.display = "none";
    document.getElementById("main_page").style.display = "block";

    updateCards();
}

function changeContent() {
    
    document.getElementById("load_page").style.display = "none";
    document.getElementById("card_pokedex").style.display = "block";
}

function updatePackInfo() {

    let pokemons = cardsList.filter(card => card.category == "Pokemon").length;
    let trainers = cardsList.filter(card => card.category == "Trainer").length;
    let energy = cardsList.filter(card => card.category == "Energy").length;

    document.getElementById("stat_total").textContent = cardsList.length;
    document.getElementById("stat_pokemon").textContent = pokemons;
    document.getElementById("stat_trainer").textContent = trainers;
    document.getElementById("stat_energy").textContent = energy;
}

let currentPage = 1;

function changePage(direction) {

    currentPage += direction;
    updateCardList(cardsList);
}

function updateCardList(list) {
    
    const cardsPerPage = 24;

    document.getElementById("card_info").style.display = "none";

    let grid = document.getElementById("cards_grid");
    grid.innerHTML = "";

    let maxPage = Math.ceil(list.length / cardsPerPage) || 1;
    
    if (currentPage > maxPage) currentPage = maxPage;
    if (currentPage < 1) currentPage = 1;

    document.getElementById("page_num").textContent = `${currentPage} из ${maxPage}`;
    document.getElementById("prev_page").style.visibility = (currentPage == 1) ? 'hidden' : 'visible';
    document.getElementById("next_page").style.visibility = (currentPage == maxPage) ? 'hidden' : 'visible';

    let startIndex = (currentPage - 1) * cardsPerPage;
    let endIndex = startIndex + cardsPerPage;
    let pageCards = list.slice(startIndex, endIndex);

    for (let i = 0; i < pageCards.length; i++) {

        let cardDiv = document.createElement("div");
        cardDiv.className = "card-item";

        cardDiv.innerHTML = `
            <img src="${pageCards[i].image}" referrerpolicy="no-referrer">
        `;

        cardDiv.onclick = () => showCardInfo(pageCards[i], pageCards, i);
        grid.appendChild(cardDiv);
    }
}

function showCardInfo(card, list, index) {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    document.getElementById("card_info").style.display = "block";

    let table = document.getElementById("info_table");
    let cardImg = document.getElementById("card_img");

    let nextCardButton = document.getElementById("next_info");
    let pastCardButton = document.getElementById("past_info");

    pastCardButton.onclick = () => showCardInfo(list[index - 1], list, index - 1);
    nextCardButton.onclick = () => showCardInfo(list[index + 1], list, index + 1);
            
    pastCardButton.style.visibility = (index == 0) ? 'hidden' : 'visible';
    nextCardButton.style.visibility = (index == (list.length - 1)) ? 'hidden' : 'visible';
            
    card_img.src = `${card.image}`;

    let rows = `
        <tr><td><b>Номер:</b></td><td>${card.localId}</td></tr>
        <tr><td><b>Название:</b></td><td>${card.cardName}</td></tr>
        <tr><td><b>Категория:</b></td><td>${card.category}</td></tr>
        <tr><td><b>Редкость:</b></td><td>${card.rarity}</td></tr>
    `;

    if (card.category == "Pokemon") {
        rows += `
            <tr><td><b>Описание:</b></td><td>${card.description}</td></tr>
            <tr><td><b>Тип:</b></td><td>${card.types}</td></tr>
            <tr><td><b>Здоровье(HP):</b></td><td>${card.hp}</td></tr>
            <tr><td><b>Способности:</b></td><td>
        `;
        rows += listHtmlText(card.abilities);

        rows += `</td></tr><tr><td><b>Атаки:</b></td><td>`;
        rows += listHtmlText(card.attacks);
        rows += `</td></tr>`;

    } else if (card.category == "Trainer") {
        rows += `
            <tr><td><b>Тип тренера:</b></td><td>${card.trainerType}</td></tr>
            <tr><td><b>Эффект:</b></td><td>${card.effect}</td></tr>
        `;
    } else if (card.category == "Energy") {
        rows += `
            <tr><td><b>Тип энергии:</b></td><td>${card.energyType}</td></tr>
            <tr><td><b>Эффект:</b></td><td>${card.effect}</td></tr>
        `;
    }
    table.innerHTML = rows;
}

function listHtmlText(cardElement) {
            
    let text = ``;

    if (cardElement) {
        cardElement.forEach((element) => {
            text += `<div class="card-skill-item">`;

            let title = "";
            let damage = "";
            let descriptionLines = [];

            for (let key in element) {

                let value = element[key];

                if (key == 'Название') {
                    title = value;

                } else if (key == 'Урон') {
                    damage = value;

                } else {
                    descriptionLines.push(`<strong>${key}:</strong> ${value}`);
                }
            }
            if (title) {
                text += `<div class="card-skill-title">${title}</div>`;
            }
            if (damage) {
                text += `<div class="card-skill-text">
                    <strong>Урон:</strong> 
                    <span class="badge-damage">${damage}</span>
                    </div>`;
            }

            descriptionLines.forEach(line => {
                text += `<div class="card-skill-text">${line}</div>`;
            });
            text += `</div>`;
        });

    } else {
        text += `<span>Нет информации</span>`;
    }
    return text;
}
