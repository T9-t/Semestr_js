function sortCards() {

    let sortType = document.getElementById("card_sort").value;

    cardsList.sort((a, b) => {
        return sortType == "asc" ? a.localId - b.localId : b.localId - a.localId;
    });
    filterCards();
}

function filterCards() {

    let typeFilter = document.getElementById("card_type").value;
    let rarityFilter = document.getElementById("card_rarity").value;

    let filteredList = cardsList.filter(card => {
        
        let matchType = (typeFilter == "all" || card.category == typeFilter);
        let matchRarity = (rarityFilter == "all" || card.rarity == rarityFilter);

        return matchType && matchRarity;
    });
    updateCardList(filteredList);
}