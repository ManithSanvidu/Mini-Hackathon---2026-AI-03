const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'test-only-secret';
const app = require('../app');
const FaultReport = require('../models/FaultReport');
let server;
let base;
before(async () => {
  server = await new Promise(resolve => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
const headers = role => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${jwt.sign({ id: 'test-user', role }, process.env.JWT_SECRET)}`,
});

test('unauthenticated callers cannot read, create, or modify reports', async () => {
  for (const [method, path] of [['GET', '/api/faults'], ['POST', '/api/faults'], ['PATCH', '/api/faults/507f1f77bcf86cd799439011/status']]) {
    assert.equal((await fetch(base + path, { method })).status, 401);
  }
});
test('villagers cannot access officer data or change status', async () => {
  assert.equal((await fetch(base + '/api/faults', { headers: headers('Villager') })).status, 403);
  assert.equal((await fetch(base + '/api/faults/507f1f77bcf86cd799439011/status', { method: 'PATCH', headers: headers('Villager'), body: JSON.stringify({ status: 'Repaired' }) })).status, 403);
});
test('seed route is unavailable even to officers', async () => {
  assert.equal((await fetch(base + '/api/seed', { method: 'POST', headers: headers('Officer') })).status, 404);
});
test('health check does not claim a disconnected database is healthy', async () => {
  assert.equal((await fetch(base + '/api/health')).status, 503);
});
test('officer status updates reach persistence; invalid IDs are rejected', async t => {
  const id = '507f1f77bcf86cd799439011';
  t.mock.method(FaultReport, 'findByIdAndUpdate', async (actualId, update, options) => {
    assert.equal(actualId, id);
    assert.equal(options.runValidators, true);
    return { _id: actualId, ...update };
  });
  const options = { method: 'PATCH', headers: headers('Officer'), body: JSON.stringify({ status: 'Repaired' }) };
  const response = await fetch(base + `/api/faults/${id}/status`, options);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'Repaired');
  assert.equal((await fetch(base + '/api/faults/invalid/status', options)).status, 400);
});
test('stats return database counts rather than demo values', async t => {
  t.mock.method(FaultReport, 'countDocuments', async query => query.status === 'Repaired' ? 2 : 3);
  t.mock.method(FaultReport, 'distinct', async () => ['A', 'B']);
  const response = await fetch(base + '/api/stats');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { activeFaults: 3, fencesRepaired: 2, monitoredFences: 2 });
});

test('public map lists active reports with an explicit safe field projection', async t => {
  const report = { _id: '507f1f77bcf86cd799439011', district: 'Ampara', status: 'Pending' };
  t.mock.method(FaultReport, 'find', query => {
    assert.deepEqual(query, { status: { $ne: 'Repaired' } });
    return {
      select(fields) {
        assert.equal(fields, '_id fenceId district damageType urgency status createdAt');
        return this;
      },
      sort() { return this; },
      async lean() { return [report]; },
    };
  });
  const response = await fetch(base + '/api/faults/map');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [report]);
});

test('public map reports database failure instead of an empty success', async t => {
  t.mock.method(FaultReport, 'find', () => { throw new Error('Database unavailable'); });
  assert.equal((await fetch(base + '/api/faults/map')).status, 503);
});
