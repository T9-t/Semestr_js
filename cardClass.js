class Card {
    constructor({category, localId, cardName, image, rarity}) {
        this.category = category;
        this.localId = localId;
        this.cardName = cardName;
        this.image = image;
        this.rarity = rarity;
    }
}

class PokeCard extends Card {
    constructor(card, {description, types, hp, abilities, attacks}) {
        super(card);
        this.description = description;
        this.types = types;
        this.hp = hp;
        this.abilities = abilities;
        this.attacks = attacks;
    }
}

class EnergyCard extends Card {
    constructor(card, {effect, energyType}) {
        super(card);
        this.effect = effect;
        this.energyType = energyType;
    }
}

class TrainerCard extends Card {
    constructor(card, {effect, trainerType}) {
        super(card);
        this.effect = effect;
        this.trainerType = trainerType;
    }
}