export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-slate-200 h-2 rounded">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2 rounded" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
