export function StatusBadge({ status }: { status: string }) {
  const styles = status.toLowerCase().includes('progress') || status.toLowerCase().includes('verified')
    ? 'bg-emerald-100 text-emerald-700'
    : status.toLowerCase().includes('pending')
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-100 text-slate-700';
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>{status}</span>;
}
