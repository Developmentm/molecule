import './globals.css';
import Link from 'next/link';
import { ThemeToggle } from '../components/theme-toggle';
import { JourneySteps } from '../components/journey-steps';

const roleNav = [
  { href: '/dashboard', label: 'Client' },
  { href: '/finance', label: 'Finance' },
  { href: '/pm', label: 'PM' },
  { href: '/developer', label: 'Developer' },
  { href: '/admin', label: 'Admin' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
          <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Molecule Execution Platform</h1>
                <p className="text-sm text-slate-500">From client login to project delivery in one aligned workflow.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <ThemeToggle />
                <Link href="/login" className="px-3 py-2 rounded border text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Login</Link>
                {roleNav.map((item) => (
                  <Link key={item.href} href={item.href} className="px-3 py-2 rounded border text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <JourneySteps />
          {children}
        </div>
      </body>
    </html>
  );
}
