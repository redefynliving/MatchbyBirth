const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateGroupResult,
  calculatePairResult,
  getZodiacSign,
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
  assert.equal(typeof forward.people[0].moon.sign, 'string');
  assert.equal(typeof forward.people[0].lifePath.number, 'number');
  assert.equal(forward.people[0].moon.precision, 'date-only');
});

test('report focus changes the paid edition without changing the pair evidence', () => {
  const people = [
    { id: 'alex', name: 'Alex', birthDate: '1990-03-21' },
    { id: 'jordan', name: 'Jordan', birthDate: '1992-09-23' },
  ];

  const moon = calculatePairResult(people, 'love', {
    source: 'moon_sign_compatibility',
    clarityGoal: 'reassurance',
  });
  const lifePath = calculatePairResult(people, 'love', {
    reportFocus: 'life_path',
    clarityGoal: 'shared_goals',
  });

  assert.deepEqual(moon.reportContext, {
    focus: 'moon_sign',
    clarityGoal: 'reassurance',
  });
  assert.deepEqual(lifePath.reportContext, {
    focus: 'life_path',
    clarityGoal: 'shared_goals',
  });
  assert.equal(moon.score, lifePath.score);
  assert.deepEqual(moon.breakdown, lifePath.breakdown);
  assert.deepEqual(moon.people, lifePath.people);
  assert.equal(JSON.stringify(moon).includes('1990-03-21'), false);
  assert.equal(JSON.stringify(lifePath).includes('1992-09-23'), false);
});

test('invalid clarity goals fall back to the chosen report edition default', () => {
  const result = calculatePairResult([
    { id: 'alex', name: 'Alex', birthDate: '1990-03-21' },
    { id: 'jordan', name: 'Jordan', birthDate: '1992-09-23' },
  ], 'love', {
    source: 'crush_birthday_compatibility',
    clarityGoal: 'repair_after_conflict',
  });

  assert.deepEqual(result.reportContext, {
    focus: 'crush',
    clarityGoal: 'mixed_signals',
  });
});

test('group results contain each unique pair and preserve duplicate display names', () => {
  const result = calculateGroupResult([
    { id: 'one', name: 'Alex', birthDate: '1990-03-21' },
    { id: 'two', name: 'Alex', birthDate: '1991-04-20' },
    { id: 'three', name: 'Jordan', birthDate: '1992-09-23' },
    { id: 'four', name: 'Morgan', birthDate: '1993-12-22' },
  ]);

  assert.equal(result.pairs.length, 6);
  assert.equal(result.memberAverages.length, 4);
  assert.equal(result.memberAverages.filter((member) => member.name === 'Alex').length, 2);
  assert.ok(result.groupScore >= 0 && result.groupScore <= 100);
  assert.ok(result.bestPair);
  assert.ok(result.groupGlue);
  assert.equal(result.groupInsights.bridgePerson.id, result.groupGlue.id);
  assert.equal(result.groupInsights.focusPair.score, result.pairs.at(-1).score);
  assert.equal(result.groupInsights.balanceGap, result.bestPair.score - result.pairs.at(-1).score);
  assert.match(result.groupInsights.action, /group plan|shared expectation/i);
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

// ── Exact sign integration ──────────────────────────────────────────────

test('pair result includes exactSunSign and precision fields', () => {
  const alex = { id: 'alex', name: 'Alex', birthDate: '1990-03-21' };
  const jordan = { id: 'jordan', name: 'Jordan', birthDate: '1992-09-23' };

  const result = calculatePairResult([alex, jordan], 'love');
  assert.equal(result.people[0].exactSunSign, 'Aries');
  assert.equal(result.people[0].precision, 'date-only');
  assert.equal(result.people[0].birthDate, undefined);
  assert.equal(result.people[0].place, undefined);
  assert.equal(result.people[0].birthTime, undefined);
});

test('pair result uses exact sign when place and birthTime are provided', () => {
  const placeWithTZ = {
    label: 'New York, NY',
    city: 'New York',
    state: 'NY',
    timezone: 'America/New_York',
    lat: 40.75,
    lng: -73.98,
  };

  const alex = {
    id: 'alex',
    name: 'Alex',
    birthDate: '2000-03-21',
    birthTime: '12:00',
    place: placeWithTZ,
  };
  const jordan = {
    id: 'jordan',
    name: 'Jordan',
    birthDate: '2000-09-23',
    birthTime: '12:00',
    place: placeWithTZ,
  };

  const result = calculatePairResult([alex, jordan], 'love');
  assert.equal(result.people[0].sign, 'Aries');
  assert.equal(result.people[0].exactSunSign, 'Aries');
  assert.equal(result.people[0].precision, 'exact');
  assert.ok(result.people[0].sign);
});

test('group result includes precision fields for all members', () => {
  const placeWithTZ = {
    label: 'Los Angeles, CA',
    city: 'Los Angeles',
    state: 'CA',
    timezone: 'America/Los_Angeles',
    lat: 34.05,
    lng: -118.24,
  };

  const result = calculateGroupResult([
    { id: 'a', name: 'A', birthDate: '2000-03-21', birthTime: '12:00', place: placeWithTZ },
    { id: 'b', name: 'B', birthDate: '2000-04-20' }, // no time/place
    { id: 'c', name: 'C', birthDate: '2000-05-21' },
  ]);

  // First person has exact data
  assert.equal(result.people[0].precision, 'exact');
  // Others fall back to date-only
  assert.equal(result.people[1].precision, 'date-only');
  assert.equal(result.people[2].precision, 'date-only');
});

test('result never exposes raw birth time or place data', () => {
  const placeWithTZ = {
    label: 'Chicago, IL',
    city: 'Chicago',
    state: 'IL',
    timezone: 'America/Chicago',
    lat: 41.88,
    lng: -87.63,
  };

  const result = calculatePairResult([
    { id: 'a', name: 'A', birthDate: '2000-03-21', birthTime: '14:30', place: placeWithTZ },
    { id: 'b', name: 'B', birthDate: '2000-04-20' },
  ]);

  // Raw data must not leak into the result
  assert.equal(result.people[0].birthTime, undefined);
  assert.equal(result.people[0].place, undefined);
  assert.equal(result.people[0].timezone, undefined);
});

test('exact sign calculation rejects invalid place objects', () => {
  const invalidPlace = { timezone: 'America/New_York' }; // no label

  const result = calculatePairResult([
    { id: 'a', name: 'A', birthDate: '2000-03-21', birthTime: '12:00', place: invalidPlace },
    { id: 'b', name: 'B', birthDate: '2000-04-20' },
  ]);

  // Should fall back to date-only because place is invalid
  assert.equal(result.people[0].precision, 'date-only');
});
