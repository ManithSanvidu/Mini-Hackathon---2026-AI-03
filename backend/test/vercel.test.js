const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const middleware = require('../middleware/vercelDatabase');

test('Vercel initialization reuses concurrent connections and retries failures', async t => {
  const previous = process.env.MONGO_URI;
  process.env.MONGO_URI = 'mongodb://example.invalid/test';
  t.after(() => {
    if (previous === undefined) delete process.env.MONGO_URI;
    else process.env.MONGO_URI = previous;
  });
  let attempts = 0;
  t.mock.method(mongoose, 'connect', async () => {
    attempts++;
    if (attempts === 1) throw new Error('Simulated connection failure');
    return mongoose;
  });
  const results = await Promise.allSettled([connectDB(), connectDB()]);
  assert.equal(attempts, 1);
  assert.ok(results.every(result => result.status === 'rejected'));
  assert.equal(await connectDB(), mongoose);
  assert.equal(attempts, 2);
});

test('Vercel entrypoint checks configuration before handling requests', async t => {
  const previous = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  t.after(() => {
    if (previous !== undefined) process.env.JWT_SECRET = previous;
  });
  let status;
  let body;
  await middleware({}, {
    status(value) { status = value; return this; },
    json(value) { body = value; },
  }, () => assert.fail('Unconfigured request must not reach routes'));
  assert.equal(status, 503);
  assert.equal(body.message, 'Backend environment is not configured.');
});
