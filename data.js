const cardsList = [];

async function updateCards() {

    let promises = [];
    for (let i = 170; i < 202; i++) {

        let promise = newCard(i);
        promises.push(promise);
    }
    let result = await Promise.all(promises);
    
    sortCards();

    updatePackInfo();
    updateCardList(cardsList);
    changeContent();

    return result;
}

function proxyFetch(url) {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    return fetch(proxyUrl + url);
}

function translateText(text) {
    
    let url = `https://api.mymemory.translated.net/get?q=${text}&langpair=en|ru`;

    if (!text) {
        return "Нет информации";
    }

    return proxyFetch(url)
        .then(response => response.json())
        .then(data => {
            return data.responseData.translatedText;
        });
}

async function newCard(cardNumber) {

    let url = `https://api.tcgdex.net/v2/en/cards/swsh3-${cardNumber}`;

    let response = await proxyFetch(url);
    let data = await response.json();
            
    let newCard = null;

    if (cardsList.some(card => card.localId == data.localId)) {
        return ;
    }

    let info = {
        category: data.category, 
        localId: data.localId, 
        cardName: data.name,
        image: `https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSH3/SWSH3_EN_${cardNumber}.png`,
        rarity: data.rarity
    };

    if (info.category == "Pokemon") {

        let description = await translateText(data.description);
        let types = await translateText(data.types);

        let abilities = await textList(data.abilities);
        let attacks = await textList(data.attacks);
                
        let pokeInfo = {
            description: description,
            types: types,
            hp: data.hp,
            abilities: abilities,
            attacks: attacks
        };
        newCard = new PokeCard(info, pokeInfo);

    } else if (info.category == "Trainer") {

        info["cardName"] = await translateText(info["cardName"]);

        let effect = await translateText(data.effect);
        let trainerType = await translateText(data.trainerType);

        let pokeInfo = {
            effect: effect,
            trainerType: trainerType,
        };
        newCard = new TrainerCard(info, pokeInfo);

    } else {
        info["cardName"] = await translateText(info["cardName"]);

        let effect = await translateText(data.effect);
        let energyType = await translateText(data.energyType);

        let pokeInfo = {
            effect: effect,
            energyType: energyType
        };
        newCard = new EnergyCard(info, pokeInfo);
    }
    cardsList.push(newCard);
}

async function textList(list) {

    let translatedList = [];

    if (!list) {
        return undefined;
    }
    for (let element of list) {
                
        let translatedElement = {};

        for (let key in element) {
            if (key != "damage") {

                let item = await translateText(element[key]);
                    
                if (key == "name") {
                    translatedElement["Название"] = item;

                } else if (key == "effect") {
                    translatedElement["Эффект"] = item;
                }
            } else {
                translatedElement["Урон"] = element[key];
            }
        }
        translatedList.push(translatedElement);
    }
    return translatedList;
}
