import { armyNumberFromText } from './army-number-from-text';

const hasAllText = (string, searches) => searches.every(search => string.toLowerCase().includes(search.toLowerCase()));

module.exports.classify = function(card) {
  card.tags = [];

  (card.ability || []).forEach(abil => {
    if(!abil) {
      return;
    }

    // raw abilities, bolded
    if(abil.includes('Assist')) {
      card.tags.push('Assist');

      if(abil.includes('+X power')) {
        card.tags.push('Assist (X)')
      }
    }

    if(abil.includes('Bond')) {
      card.tags.push('Bond');
    }

    if(abil.includes('Brainstorm')) {
      card.tags.push('Brainstorm');
    }

    if(abil.includes('Change')) {
      card.tags.push('Change');
    }

    if(abil.includes('CXCOMBO')) {
      card.tags.push('CXCOMBO');
    }

    if(abil.includes('Encore')) {
      card.tags.push('Encore');
    }

    if(abil.includes('Experience')) {
      card.tags.push('Experience');
    }

    if(abil.includes('Great Performance')) {
      card.tags.push('Great Performance');
    }

    if(abil.includes('Memory')) {
      card.tags.push('Memory');
    }

    if(abil.includes('Shift')) {
      card.tags.push('Shift');
    }

    // other abilities that require more work
    if(hasAllText(abil, ['All of your other'])) {
      if(hasAllText(abil, ['characters get'])) {
        card.tags.push('Global Power');
      } else if(hasAllText(abil, ['get'])) {
        card.tags.push('Global Power (Specific Character)');
      }
    }

    if(hasAllText(abil, ['put the top card of your clock into your waiting room'])) {
      card.tags.push('Clock Cleanse');
    }

    if(hasAllText(abil, ['this card gets -1 level while in your hand'])) {
      card.tags.push('Early Summon');
    }

    if(hasAllText(abil, ['with the same card name as this card'])) {
      card.tags.push('Army');

      if(hasAllText(abil, ['any'])) {
        card.tags.push('Army (Unlimited)');
      }

      const armySize = armyNumberFromText(abil);
      if(armySize) {
        card.tags.push(`Army (${armySize})`);
      }
    }

    if(hasAllText(abil, ['When damage dealt by this card is canceled, you may put this card into your stock.'])) {
      card.tags.push('Cancel Self Stock');
    }

    if(hasAllText(abil, ['marker'])) {
      card.tags.push('Marker')
    }

    if(hasAllText(abil, ['waiting room', 'return it to your hand'])) {
      card.tags.push('Salvage')
    }
  });

  card.tags = [...new Set(card.tags)];

  /*
  if(card.code === 'RZ/SE35-E45') {
    console.log(card.tags)
  }
  */

  return card;
};
