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
  assert.deepEqual(Object.keys(forward.breakdown).sort(), [
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
