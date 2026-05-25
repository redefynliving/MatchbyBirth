
export function getScoreInterpretation(score, relationshipType = 'love') {
  const safeScore = typeof score === 'number' ? score : 0;
  const type = relationshipType?.toLowerCase() || 'love';
  
  // Normalize relationship type to match the three categories
  let category = 'between';
  if (type === 'love' || type === 'romantic') category = 'love';
  if (type === 'friendship' || type === 'friend') category = 'friendship';

  if (safeScore >= 80) {
    if (category === 'love') {
      return { label: "High Romantic Harmony", explanation: "This is an exceptionally harmonious romantic match." };
    }
    if (category === 'friendship') {
      return { label: "High Friendship Harmony", explanation: "You're naturally aligned as friends with effortless compatibility." };
    }
    return { label: "Powerful Natural Connection", explanation: "You have rare and exceptional natural alignment." };
  } 
  
  if (safeScore >= 60) {
    if (category === 'love') {
      return { label: "Strong Romantic Potential", explanation: "This is a promising romantic connection with natural chemistry." };
    }
    if (category === 'friendship') {
      return { label: "Strong Friendship Match", explanation: "You have the foundation for a strong and lasting friendship." };
    }
    return { label: "Meaningful Connection", explanation: "You share genuine compatibility and natural understanding." };
  }

  if (safeScore >= 40) {
    if (category === 'love') {
      return { label: "Mixed Romantic Match", explanation: "There's potential here, but it will take effort and understanding." };
    }
    if (category === 'friendship') {
      return { label: "Developing Friendship Match", explanation: "You could develop a solid friendship with some mutual effort." };
    }
    return { label: "Potential Connection", explanation: "With intention and openness, this could grow into something meaningful." };
  }

  // 0 - 39
  if (category === 'love') {
    return { label: "Challenging Match", explanation: "This pairing may require significant effort and understanding to work." };
  }
  if (category === 'friendship') {
    return { label: "Uneven Friendship Fit", explanation: "Building a strong friendship here would take intentional work." };
  }
  return { label: "Unclear Connection", explanation: "This connection may need time and intention to develop." };
}
