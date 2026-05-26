export function hashFromTwoDates(d1 = '', d2 = '', range = 100) {
  const s = `${d1}|${d2}`;
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    sum = (sum + s.charCodeAt(i)) >>> 0;
  }
  return range > 0 ? sum % (range + 1) : sum;
}

export function seedFromTwoDates(d1 = '', d2 = '') {
  return hashFromTwoDates(d1, d2, 2 ** 31 - 1);
}
