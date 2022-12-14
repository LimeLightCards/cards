const fs = require('fs-extra');
const md5 = require('md5-file');
const { default: gitClone } = require('git-clone-repo');
const { compress } = require('compress-json');
const { capitalize } = require('lodash');

const { classify } = require('./helpers/card-classifier');

console.log('Cloning card database...');
gitClone('CCondeluci/WeissSchwarz-ENG-DB', { destination: 'cards' });

console.log('Cloning set metadata...');
gitClone('LimeLightCards/setdata', { destination: 'cards/meta' });
fs.copySync('cards/meta/expansions.json', 'dist/expansions.json');

console.log('Cloning card cache data...');
gitClone('LimeLightCards/scraper-data', { destination: 'cards/cache' });

const cardimages = fs.readdirSync('cards/cache/cardimages')
  .map(file => fs.readJsonSync(`cards/cache/cardimages/${file}`))
  .reduce((acc, val) => ({ ...acc, ...val }), {});

const files = fs.readdirSync('cards/DB');

const allTriggers = ['CHOICE', 'COMEBACK', 'DRAW', 'GATE', 'POOL', 'RETURN', 'SHOT', 'SOUL', 'STANDBY', 'TREASURE'];

const allCards = [];

files.forEach(file => {
  const cards = fs.readJsonSync(`cards/DB/${file}`);
  allCards.push(...cards);
});

allCards.forEach(card => {
  card.flavorText = card.flavor_text;
  delete card.flavor_text;

  card.color = card.color.toUpperCase().substring(0, 1);

  if(card.rarity === 'Ｒ') {
    card.rarity = 'R';
  }
  card.rarity = card.rarity.trim().split('/')[0] || 'C';

  card.level = +card.level;
  if(isNaN(card.level)) {
    card.level = 0;
  }
  if(card.level > 3) {
    card.level = 3;
  }

  card.cost = +card.cost;
  if(isNaN(card.cost)) {
    card.cost = 0;
  }

  card.power = +card.power;
  if(isNaN(card.power)) {
    card.power = 0;
  }

  if(card.flavorText === '-' || card.flavorText === '－') {
    card.flavorText = '';
  }

  if(card.type === 'Climax') {

    if(card.trigger.includes('SALVAGE')) {
      card.trigger = card.trigger.filter(t => t !== 'SALVAGE');
      card.trigger.push('COMEBACK');
    }

    card.ability.forEach(abi => {
      allTriggers.forEach(trigger => {
        if(abi.includes(trigger) && !card.trigger.includes(trigger)) {
          card.trigger.push(trigger);
        }
      });
    });
  }

  card.ability = card.ability.filter(abi => abi !== '-' && abi !== '－');
  card.attributes = card.attributes.filter(a => a !== '-' && a !== '－');

  card.trigger = card.trigger.map(trigger => capitalize(trigger.toLowerCase()));

  card.image = cardimages[card.code] || card.image;
});

const formattedCards = allCards.map(card => classify(card));

fs.writeJsonSync('dist/cards.json', formattedCards);
fs.writeJsonSync('dist/cards.min.json', compress(formattedCards));
fs.writeJsonSync('dist/version.json', { version: md5.sync('dist/cards.json') });

console.log(`Got ${formattedCards.length} cards!`);
