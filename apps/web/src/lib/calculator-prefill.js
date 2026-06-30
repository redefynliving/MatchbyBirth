const allowedRelationshipTypes = new Set(['love', 'friendship', 'work']);

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;

  const [year, month, day] = String(value).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    && date.getTime() <= Date.now();
}

function cleanName(value, fallback) {
  const cleaned = String(value || '').trim().slice(0, 80);
  return cleaned || fallback;
}

function cleanRelationshipType(value) {
  return allowedRelationshipTypes.has(value) ? value : 'love';
}

function cleanSource(value) {
  const cleaned = String(value || '').trim().slice(0, 80);
  return cleaned || 'tool_prefill';
}

export function buildCalculatorPrefill({
  firstName,
  firstDate,
  secondName,
  secondDate,
  relationshipType = 'love',
  source = 'tool_prefill',
} = {}) {
  if (!isValidDateString(firstDate) || !isValidDateString(secondDate)) return null;

  return {
    mode: 'pair',
    relationshipType: cleanRelationshipType(relationshipType),
    source: cleanSource(source),
    people: [
      {
        id: 'pair-1',
        name: cleanName(firstName, 'Person A'),
        birthDate: firstDate,
        birthTime: '',
        place: null,
      },
      {
        id: 'pair-2',
        name: cleanName(secondName, 'Person B'),
        birthDate: secondDate,
        birthTime: '',
        place: null,
      },
    ],
  };
}

export function normalizeCalculatorPrefill(value) {
  if (!value || value.mode !== 'pair' || !Array.isArray(value.people) || value.people.length !== 2) {
    return null;
  }

  return buildCalculatorPrefill({
    firstName: value.people[0]?.name,
    firstDate: value.people[0]?.birthDate,
    secondName: value.people[1]?.name,
    secondDate: value.people[1]?.birthDate,
    relationshipType: value.relationshipType,
    source: value.source,
  });
}
