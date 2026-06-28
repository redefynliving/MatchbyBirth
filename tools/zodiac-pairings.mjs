export const ZODIAC_SIGNS = [
  { name: 'aries', label: 'Aries', element: 'Fire', quality: 'Cardinal', planet: 'Mars' },
  { name: 'taurus', label: 'Taurus', element: 'Earth', quality: 'Fixed', planet: 'Venus' },
  { name: 'gemini', label: 'Gemini', element: 'Air', quality: 'Mutable', planet: 'Mercury' },
  { name: 'cancer', label: 'Cancer', element: 'Water', quality: 'Cardinal', planet: 'Moon' },
  { name: 'leo', label: 'Leo', element: 'Fire', quality: 'Fixed', planet: 'Sun' },
  { name: 'virgo', label: 'Virgo', element: 'Earth', quality: 'Mutable', planet: 'Mercury' },
  { name: 'libra', label: 'Libra', element: 'Air', quality: 'Cardinal', planet: 'Venus' },
  { name: 'scorpio', label: 'Scorpio', element: 'Water', quality: 'Fixed', planet: 'Pluto & Mars' },
  { name: 'sagittarius', label: 'Sagittarius', element: 'Fire', quality: 'Mutable', planet: 'Jupiter' },
  { name: 'capricorn', label: 'Capricorn', element: 'Earth', quality: 'Cardinal', planet: 'Saturn' },
  { name: 'aquarius', label: 'Aquarius', element: 'Air', quality: 'Fixed', planet: 'Uranus & Saturn' },
  { name: 'pisces', label: 'Pisces', element: 'Water', quality: 'Mutable', planet: 'Neptune & Jupiter' },
];

export function getZodiacPairingSlug(firstSign, secondSign) {
  return `${firstSign.name}-and-${secondSign.name}-compatibility`;
}

export function getZodiacPairingPages() {
  return ZODIAC_SIGNS.flatMap((firstSign) => (
    ZODIAC_SIGNS.map((secondSign) => ({
      firstSign,
      secondSign,
      slug: getZodiacPairingSlug(firstSign, secondSign),
      path: `/blog/${getZodiacPairingSlug(firstSign, secondSign)}`,
    }))
  ));
}
