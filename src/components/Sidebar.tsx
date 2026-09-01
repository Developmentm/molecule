"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "./nav-config";
import { IconChevron } from "./icons";

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const activeParent = NAV_ITEMS.find((item) =>
    item.children?.some((c) => pathname.startsWith(c.href))
  )?.label;
  const [openLabel, setOpenLabel] = useState<string | null>(activeParent ?? null);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#161b2c] text-slate-200">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-700 text-lg font-bold text-white">
          L
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">LexTrack</p>
          <p className="text-[11px] text-slate-400 leading-tight">Case Management</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const Icon = item.icon;
          if (!item.children) {
            const active = item.href ? pathname.startsWith(item.href) : false;
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-blue-900 text-white font-medium"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          }

          const isOpen = openLabel === item.label;
          const active = item.children.some((c) => pathname.startsWith(c.href));

          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => setOpenLabel(isOpen ? null : item.label)}
                className={`flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors ${
                  active ? "text-white font-medium" : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="flex-1">{item.label}</span>
                <IconChevron className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>
              {isOpen && (
                <div className="bg-black/20 pb-1">
                  {item.children.map((child) => {
                    const childActive = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-14 py-2 text-sm transition-colors ${
                          childActive
                            ? "text-white font-semibold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
