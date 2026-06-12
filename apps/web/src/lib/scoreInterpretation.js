
export function getScoreInterpretation(score, relationshipType = 'love') {
  const safeScore = typeof score === 'number' ? score : 0;
  const type = relationshipType?.toLowerCase() || 'love';

  let category = 'between';
  if (type === 'love' || type === 'romantic') category = 'love';
  if (type === 'friendship' || type === 'friend') category = 'friendship';

  if (safeScore >= 80) {
    if (category === 'love') {
      return { label: 'Very compatible', explanation: 'Several parts of this romantic match may feel easy.' };
    }
    if (category === 'friendship') {
      return { label: 'Very compatible', explanation: 'You share several qualities that may make friendship feel easy.' };
    }
    return { label: 'Very compatible', explanation: 'You share several qualities that may make this connection feel easy.' };
  }

  if (safeScore >= 60) {
    if (category === 'love') {
      return { label: 'Good compatibility', explanation: 'This romantic match has several strengths and a few differences.' };
    }
    if (category === 'friendship') {
      return { label: 'Good compatibility', explanation: 'This friendship has several strengths and a few differences.' };
    }
    return { label: 'Good compatibility', explanation: 'This connection has several strengths and a few differences.' };
  }

  if (safeScore >= 40) {
    if (category === 'love') {
      return { label: 'Mixed compatibility', explanation: 'Some parts of this romantic match may click while others take more effort.' };
    }
    if (category === 'friendship') {
      return { label: 'Mixed compatibility', explanation: 'Some parts of this friendship may click while others take more effort.' };
    }
    return { label: 'Mixed compatibility', explanation: 'Some parts of this connection may click while others take more effort.' };
  }

  if (category === 'love') {
    return { label: 'More differences than similarities', explanation: 'This romantic match may require patience and clearer communication.' };
  }
  if (category === 'friendship') {
    return { label: 'More differences than similarities', explanation: 'This friendship may require patience and clearer communication.' };
  }
  return { label: 'More differences than similarities', explanation: 'This connection may require patience and clearer communication.' };
}
