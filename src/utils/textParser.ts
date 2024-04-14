/** Convert words like `1k` `10rb` `10ribu` `1jt` ...etc to number */
export function wordsToNumber(word: string) {
  const numberWithUnit = word.match(unitReg)?.[0].replace(',', '.');
  if (!numberWithUnit) return null;

  const numberStr = numberWithUnit.match(numReg)?.[0]!;
  const unit = String(numberWithUnit).replace(numberStr, '') as Unit | '';
  if (unit !== '' && !UNIT.includes(unit)) return null;

  const number = parseFloat(numberStr);
  const multiplier = unit ? numberMap[unit] : 1;

  if (!multiplier) return null;
  else return number * multiplier;
}

type Unit = (typeof UNIT)[number];
const UNIT = ['k', 'K', 'rb', 'ribu', 'jt', 'juta', 'm', 'j', 'milyar', 'b', 'miliar'] as const;

const numReg = /[+-]?([0-9]*[.,])?[0-9]+/;
const unitReg = new RegExp(`(${numReg.source})(${UNIT.join('|')})?`);

const numberMap: Record<Unit, number> = {
  k: 1e3,
  K: 1e3,
  rb: 1e3,
  ribu: 1e3,
  jt: 1e6,
  juta: 1e6,
  m: 1e6,
  j: 1e9,
  milyar: 1e9,
  b: 1e12,
  miliar: 1e12,
};
