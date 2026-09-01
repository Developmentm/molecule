import Link from "next/link";
import type { ReactNode } from "react";

const COLORS: Record<string, string> = {
  red: "bg-red-700",
  navy: "bg-blue-950",
};

export default function StatCard({
  label,
  value,
  href,
  icon,
  color = "red",
}: {
  label: string;
  value: number | string;
  href: string;
  icon: ReactNode;
  color?: "red" | "navy";
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-lg ${COLORS[color]} px-6 py-7 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="opacity-90">{icon}</div>
      <div className="text-right">
        <p className="text-sm font-medium opacity-90">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </Link>
  );
}
