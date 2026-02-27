import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.API_BASE_URL || 'http://localhost:4000';

test('health endpoint responds', async (t) => {
  const response = await fetch(`${base}/health`).catch(() => null);
  if (!response) {
    t.skip('API server not running in this environment');
    return;
  }
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
});
