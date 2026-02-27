import './globals.css';
import Link from 'next/link';
import { ThemeToggle } from '../components/theme-toggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <header className="mb-6 flex flex-wrap gap-3 items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Molecule Execution Platform</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <nav className="flex gap-3 text-sm">
                {['/login', '/dashboard', '/chat', '/quotations', '/invoices', '/finance', '/pm', '/developer', '/admin'].map((href) => (
                  <Link className="text-indigo-600 dark:text-indigo-300 hover:underline" key={href} href={href}>
                    {href.replace('/', '') || 'home'}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
