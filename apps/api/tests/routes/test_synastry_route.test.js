const request = require('supertest');
const app = require('../../server'); // adjust path to match your Express app entry

describe('POST /api/synastry', () => {
  it('returns synastry JSON for simple charts', async () => {
    const res = await request(app)
      .post('/api/synastry')
      .send({
        chartA: { Sun: 10.0, Moon: 50.0 },
        chartB: { Sun: 10.0, Moon: 230.0 },
        options: { aspects: ['conjunction'] }
      })
      .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('aspects');
    expect(res.body).toHaveProperty('normalized_score');
  });
});
