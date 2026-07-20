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

function cleanBirthTime(value) {
  const cleaned = String(value || '').trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(cleaned)) return '';
  return cleaned;
}

function cleanPlace(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const label = String(value.label || '').trim().slice(0, 120);
  const timezone = String(value.timezone || '').trim().slice(0, 80);
  if (!label || !timezone) return null;

  const place = { label, timezone };
  for (const key of ['city', 'state', 'country']) {
    const cleaned = String(value[key] || '').trim().slice(0, 80);
    if (cleaned) place[key] = cleaned;
  }
  for (const key of ['lat', 'lng']) {
    const coordinate = Number(value[key]);
    if (Number.isFinite(coordinate)) place[key] = coordinate;
  }
  return place;
}

export function buildCalculatorPrefill({
  firstName,
  firstDate,
  firstBirthTime,
  firstPlace,
  secondName,
  secondDate,
  secondBirthTime,
  secondPlace,
  relationshipType = 'love',
  source = 'tool_prefill',
} = {}) {
  if (!isValidDateString(firstDate) || !isValidDateString(secondDate)) return null;

  const firstExact = {
    birthTime: cleanBirthTime(firstBirthTime),
    place: cleanPlace(firstPlace),
  };
  const secondExact = {
    birthTime: cleanBirthTime(secondBirthTime),
    place: cleanPlace(secondPlace),
  };
  const exactMode = Boolean(
    firstExact.birthTime
    || firstExact.place
    || secondExact.birthTime
    || secondExact.place,
  );

  return {
    mode: 'pair',
    relationshipType: cleanRelationshipType(relationshipType),
    source: cleanSource(source),
    ...(exactMode ? { exactMode: true } : {}),
    people: [
      {
        id: 'pair-1',
        name: cleanName(firstName, 'Person A'),
        birthDate: firstDate,
        ...firstExact,
      },
      {
        id: 'pair-2',
        name: cleanName(secondName, 'Person B'),
        birthDate: secondDate,
        ...secondExact,
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
    firstBirthTime: value.people[0]?.birthTime,
    firstPlace: value.people[0]?.place,
    secondName: value.people[1]?.name,
    secondDate: value.people[1]?.birthDate,
    secondBirthTime: value.people[1]?.birthTime,
    secondPlace: value.people[1]?.place,
    relationshipType: value.relationshipType,
    source: value.source,
  });
}
