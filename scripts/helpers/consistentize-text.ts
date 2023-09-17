
export function consistentizeText(text: string) {
  return text
    .split('0').join('zero')
    .split('1').join('one')
    .split('2').join('two')
    .split('3').join('three')
    .split('4').join('four')
    .split('zone').join('area')
    .split('library').join('deck')
  ;
}