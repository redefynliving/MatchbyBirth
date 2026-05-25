
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

  if (element1 === element2) return 88 + Math.floor(Math.random() * 8);
  if ((element1 === 'fire' && element2 === 'air') || (element1 === 'air' && element2 === 'fire')) {
    return 76 + Math.floor(Math.random() * 10);
  }
  if ((element1 === 'earth' && element2 === 'water') || (element1 === 'water' && element2 === 'earth')) {
    return 74 + Math.floor(Math.random() * 10);
  }
  if ((element1 === 'fire' && element2 === 'earth') || (element1 === 'earth' && element2 === 'fire')) {
    return 52 + Math.floor(Math.random() * 12);
  }
  if ((element1 === 'air' && element2 === 'water') || (element1 === 'water' && element2 === 'air')) {
    return 48 + Math.floor(Math.random() * 12);
  }
  return 42 + Math.floor(Math.random() * 14);
};
