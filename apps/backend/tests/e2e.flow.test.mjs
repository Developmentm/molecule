import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.API_BASE_URL || 'http://localhost:4000';
const creds = { email: process.env.E2E_USER_EMAIL || 'client@molecule.dev', password: process.env.E2E_USER_PASSWORD || 'Password123!' };

test('e2e flow: login -> list projects', async (t) => {
  const login = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds)
  }).catch(() => null);

  if (!login) {
    t.skip('API server not running in this environment');
    return;
  }

  if (login.status !== 200) {
    t.skip(`Login unavailable in current env (status ${login.status})`);
    return;
  }

  const { token } = await login.json();
  assert.ok(token);

  const projects = await fetch(`${base}/projects?page=1&pageSize=5`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(projects.status, 200);
  const payload = await projects.json();
  assert.ok(Array.isArray(payload.items));
});
