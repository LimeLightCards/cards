
const text2num = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

export function armyNumberFromText(text: string): number {
  const validNumbers = text.split(' ').map((word) => {
    if(text2num[word]) return text2num[word];
    if(!isNaN(+word)) return +word;
    return '';
  }).filter(Boolean);

  return validNumbers[0] || undefined;
}