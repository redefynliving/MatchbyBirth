
export const getZodiacSign = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

export const getElement = (sign) => {
  const fire = ['Aries', 'Leo', 'Sagittarius'];
  const earth = ['Taurus', 'Virgo', 'Capricorn'];
  const air = ['Gemini', 'Libra', 'Aquarius'];
  
  if (fire.includes(sign)) return 'fire';
  if (earth.includes(sign)) return 'earth';
  if (air.includes(sign)) return 'air';
  return 'water';
};

export const calculateBaseCompatibility = (sign1, sign2) => {
  const element1 = getElement(sign1);
  const element2 = getElement(sign2);

  // deterministic offset derived from the sign pair so results are stable across runs/devices
  const deterministicOffset = (a = '', b = '', range = 0) => {
    const s = (a + '|' + b).toLowerCase();
    let sum = 0;
    for (let i = 0; i < s.length; i++) sum = (sum * 31 + s.charCodeAt(i)) >>> 0; // simple rolling hash
    return range > 0 ? sum % (range + 1) : 0;
  };

  if (element1 === element2) return 88 + deterministicOffset(sign1, sign2, 7); // 88-95
  if ((element1 === 'fire' && element2 === 'air') || (element1 === 'air' && element2 === 'fire')) {
    return 76 + deterministicOffset(sign1, sign2, 9); // 76-85
  }
  if ((element1 === 'earth' && element2 === 'water') || (element1 === 'water' && element2 === 'earth')) {
    return 74 + deterministicOffset(sign1, sign2, 9); // 74-83
  }
  if ((element1 === 'fire' && element2 === 'earth') || (element1 === 'earth' && element2 === 'fire')) {
    return 52 + deterministicOffset(sign1, sign2, 11); // 52-63
  }
  if ((element1 === 'air' && element2 === 'water') || (element1 === 'water' && element2 === 'air')) {
    return 48 + deterministicOffset(sign1, sign2, 11); // 48-59
  }
  return 42 + deterministicOffset(sign1, sign2, 13); // 42-55
};
