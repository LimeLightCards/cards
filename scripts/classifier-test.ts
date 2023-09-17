
import * as cards from '../dist/cards.json';

const cardId = process.argv[2];

(cards as any[]).forEach(card => {
  if(card.code !== cardId && !card.name.toLowerCase().includes(cardId.toLowerCase())) return;
  
  console.log(card);
});