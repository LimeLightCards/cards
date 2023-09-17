
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

    if(abil.includes('CXCOMBO') 
    || hasAllText(abil, ['card named', 'is in your climax area'])
    || hasAllText(abil, ['is placed on your climax area'])
    || hasAllText(abil, ['from your climax area into your waiting room'])) {
      card.tags.push('CXCOMBO');
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

  if(card.code === 'WS_LB/W21-065') {
    console.log(card.tags)
    console.log(card);
  }

  return card;
};
