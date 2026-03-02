import Link from 'next/link';

const steps = [
  { label: '1. Client Login', href: '/login' },
  { label: '2. Requirement', href: '/chat' },
  { label: '3. Quotation', href: '/quotations' },
  { label: '4. Invoice', href: '/invoices' },
  { label: '5. Finance Verify', href: '/finance' },
  { label: '6. PM Tracking', href: '/pm' },
  { label: '7. Dev Execution', href: '/developer' },
  { label: '8. Admin Oversight', href: '/admin' }
];

export function JourneySteps() {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 dark:bg-slate-900 dark:border-slate-800 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300 mb-2">Delivery Sequence</p>
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className="rounded-full border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1 text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
          >
            {step.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
