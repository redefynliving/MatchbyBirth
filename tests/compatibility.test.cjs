const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateGroupResult,
  calculatePairResult,
  getZodiacSign,
  isNearSignTransition,
  validatePeople,
} = require('../shared/compatibility.cjs');

test('getZodiacSign uses calendar dates without timezone drift', () => {
  assert.equal(getZodiacSign('2000-03-21'), 'Aries');
  assert.equal(getZodiacSign('2000-04-19'), 'Aries');
  assert.equal(getZodiacSign('2000-04-20'), 'Taurus');
});

test('validatePeople rejects incomplete, invalid, and future birth dates', () => {
  assert.throws(
    () => validatePeople([{ id: 'a', name: '', birthDate: '2000-01-01' }], 1, 1),
    /name/i,
  );
  assert.throws(
    () => validatePeople([{ id: 'a', name: 'Alex', birthDate: 'not-a-date' }], 1, 1),
    /birth date/i,
  );
  assert.throws(
    () => validatePeople([{ id: 'a', name: 'Alex', birthDate: '2999-01-01' }], 1, 1),
    /future/i,
  );
});

test('pair results are order independent and include five breakdown scores', () => {
  const alex = { id: 'alex', name: 'Alex', birthDate: '1990-03-21' };
  const jordan = { id: 'jordan', name: 'Jordan', birthDate: '1992-09-23' };

  const forward = calculatePairResult([alex, jordan], 'love');
  const reverse = calculatePairResult([jordan, alex], 'love');

  assert.equal(forward.score, reverse.score);
  assert.deepEqual(forward.breakdown, reverse.breakdown);
  assert.deepEqual(Object.keys(forward.breakdown).sort((left, right) => (
    left.localeCompare(right)
  )), [
    'chemistry',
    'communication',
    'growth',
    'intuition',
    'overall',
    'stability',
  ]);
  assert.equal(forward.people[0].birthDate, undefined);
  assert.equal(forward.people[0].sign, 'Aries');
});

test('optional birth time and free-text place stay private without enabling exact mode', () => {
  const result = calculatePairResult([
    {
      id: 'alex',
      name: 'Alex',
      birthDate: '1990-03-21',
      birthTime: '08:15',
      birthPlace: 'Atlanta, GA',
    },
    {
      id: 'jordan',
      name: 'Jordan',
      birthDate: '1992-09-23',
      birthTime: '',
      birthPlace: '',
    },
  ], 'love');

  assert.equal(result.people[0].precision.hasBirthTime, true);
  assert.equal(result.people[0].precision.hasBirthPlace, false);
  assert.equal(result.people[0].precision.nearSignTransition, true);
  assert.equal(result.people[0].precision.level, 'date-only');
  assert.equal(result.people[0].precision.exact, false);
  assert.equal(result.people[1].precision.level, 'date-only');
  assert.equal(result.precision.mode, 'date-only');
  assert.equal(result.people[0].birthTime, undefined);
  assert.equal(result.people[0].birthPlace, undefined);
  assert.equal(JSON.stringify(result).includes('08:15'), false);
  assert.equal(JSON.stringify(result).includes('Atlanta'), false);
});

test('pair result uses MBB Exact Mode signs when both people provide exact birth details', () => {
  const result = calculatePairResult([
    {
      id: 'one',
      name: 'Before',
      birthDate: '2024-03-19',
      birthTime: '20:00',
      birthPlace: {
        label: 'Atlanta, Georgia, United States',
        timezone: 'America/New_York',
        lat: 33.749,
        lng: -84.388,
      },
    },
    {
      id: 'two',
      name: 'After',
      birthDate: '2024-03-19',
      birthTime: '23:30',
      birthPlace: {
        label: 'Atlanta, Georgia, United States',
        timezone: 'America/New_York',
        lat: 33.749,
        lng: -84.388,
      },
    },
  ], 'love');

  assert.equal(result.precision.mode, 'exact-sun');
  assert.equal(result.precision.label, 'MBB Exact Mode');
  assert.equal(result.people[0].sign, 'Pisces');
  assert.equal(result.people[1].sign, 'Aries');
  assert.equal(result.people[0].precision.level, 'exact-sun');
  assert.equal(result.people[0].precision.exact, true);
  assert.equal(result.people[0].precision.placeLabel, 'Atlanta, Georgia, United States');
  assert.equal(result.people[0].birthTime, undefined);
  assert.equal(result.people[0].birthPlace, undefined);
  assert.equal(JSON.stringify(result).includes('20:00'), false);
  assert.equal(JSON.stringify(result).includes('33.749'), false);
});

test('pair result reports mixed precision when only one person has exact details', () => {
  const result = calculatePairResult([
    {
      id: 'one',
      name: 'Exact',
      birthDate: '2024-03-19',
      birthTime: '23:30',
      birthPlace: {
        label: 'Atlanta, Georgia, United States',
        timezone: 'America/New_York',
        lat: 33.749,
        lng: -84.388,
      },
    },
    { id: 'two', name: 'Date Only', birthDate: '1992-09-23' },
  ], 'love');

  assert.equal(result.precision.mode, 'mixed');
  assert.equal(result.precision.label, 'Mixed precision');
  assert.equal(result.people[0].precision.level, 'exact-sun');
  assert.equal(result.people[1].precision.level, 'date-only');
});

test('optional birth time validates format and cusp dates are detected', () => {
  assert.equal(isNearSignTransition('1990-03-20'), true);
  assert.equal(isNearSignTransition('1990-03-21'), true);
  assert.equal(isNearSignTransition('1990-03-22'), true);
  assert.equal(isNearSignTransition('1990-03-25'), false);
  assert.throws(
    () => validatePeople([
      { id: 'a', name: 'Alex', birthDate: '1990-03-21', birthTime: '25:99' },
    ], 1, 1),
    /birth time/i,
  );
});

test('group results contain each unique pair and preserve duplicate display names', () => {
  const result = calculateGroupResult([
    {
      id: 'one',
      name: 'Alex',
      birthDate: '2024-03-19',
      birthTime: '23:30',
      birthPlace: {
        label: 'Atlanta, Georgia, United States',
        timezone: 'America/New_York',
        lat: 33.749,
        lng: -84.388,
      },
    },
    { id: 'two', name: 'Alex', birthDate: '1991-04-20' },
    { id: 'three', name: 'Jordan', birthDate: '1992-09-23' },
    { id: 'four', name: 'Morgan', birthDate: '1993-12-22' },
  ]);

  assert.equal(result.precision.mode, 'mixed');
  assert.equal(result.precision.exactCount, 1);
  assert.equal(result.people[0].precision.level, 'exact-sun');
  assert.equal(result.pairs.length, 6);
  assert.equal(result.memberAverages.length, 4);
  assert.equal(result.memberAverages.filter((member) => member.name === 'Alex').length, 2);
  assert.ok(result.groupScore >= 0 && result.groupScore <= 100);
  assert.ok(result.bestPair);
  assert.ok(result.groupGlue);
  assert.equal(result.people.every((person) => person.birthDate === undefined), true);
});

test('group mode only accepts three through seven people', () => {
  const person = (id) => ({
    id: String(id),
    name: `Person ${id}`,
    birthDate: `199${id}-01-01`,
  });

  assert.throws(() => calculateGroupResult([person(1), person(2)]), /at least 3/i);
  assert.throws(
    () => calculateGroupResult(Array.from({ length: 8 }, (_, index) => person(index + 1))),
    /no more than 7/i,
  );
});
