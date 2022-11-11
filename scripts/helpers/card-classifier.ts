
import { armyNumberFromText } from './army-number-from-text';
import * as classifications from './classifications.json';

const allClassifications = (classifications as any).default || classifications;

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

    if(abil.includes('CXCOMBO') || hasAllText(abil, ['card named', 'is in your climax area'])) {
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

    allClassifications.forEach(({ terms, tag }) => {
      if(hasAllText(abil, terms)) {
        card.tags.push(tag);
      }
    })

  });

  card.tags = [...new Set(card.tags)];

  /*
  if(card.code === 'RZ/SE35-E45') {
    console.log(card.tags)
  }
  */

  return card;
};
