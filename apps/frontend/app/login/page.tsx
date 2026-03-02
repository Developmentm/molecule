'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, tokenStore } from '../../lib/api';

const presets = [
  { role: 'Client', email: 'client@molecule.dev', route: '/dashboard' },
  { role: 'Finance', email: 'finance@molecule.dev', route: '/finance' },
  { role: 'PM', email: 'pm@molecule.dev', route: '/pm' },
  { role: 'Developer', email: 'dev1@molecule.dev', route: '/developer' },
  { role: 'Admin', email: 'admin@molecule.dev', route: '/admin' }
];

export default function LoginPage() {
  const router = useRouter();
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
      const preset = presets.find((p) => p.email === email);
      router.push(preset?.route || '/dashboard');
    } catch (error) {
      setResult((error as Error).message);
    }
  };

  return (
    <main className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold">Client Entry: Login</h2>
        <p className="text-sm text-slate-500">Start the sequence here. After login, continue through requirement → quotation → invoice → verification.</p>
        <div className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={login} className="bg-indigo-600 text-white w-full">Sign In</button>
        </div>
        {result ? <p className="text-sm text-slate-600 dark:text-slate-300">{result}</p> : null}
      </section>

      <section className="rounded-xl border bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
        <h3 className="font-semibold">Quick Demo Accounts</h3>
        {presets.map((preset) => (
          <button
            key={preset.email}
            className="w-full text-left border rounded px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => {
              setEmail(preset.email);
              setPassword('Password123!');
            }}
          >
            <p className="font-medium">{preset.role}</p>
            <p className="text-xs text-slate-500">{preset.email}</p>
          </button>
        ))}
      </section>
    </main>
  );
}
