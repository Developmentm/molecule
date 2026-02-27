'use client';

import { useState } from 'react';
import { apiFetch, tokenStore } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('client@molecule.dev');
  const [password, setPassword] = useState('Password123!');
  const [result, setResult] = useState('');

  const login = async () => {
    try {
      const data = await apiFetch<{ token: string; user: { role: string; name: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      tokenStore.set(data.token);
      setResult(`Logged in as ${data.user.name} (${data.user.role})`);
    } catch (error) {
      setResult((error as Error).message);
    }
  };

  return (
    <main className="max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Login</h2>
      <div className="space-y-3 mt-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={login} className="bg-indigo-600 text-white w-full">Sign In</button>
      </div>
      {result ? <p className="mt-3 text-sm text-slate-600">{result}</p> : null}
    </main>
  );
}
