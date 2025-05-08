"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/duplicatas", label: "Duplicatas" },
    { href: "/clientes", label: "Clientes" },
    { href: "/consulta-credito", label: "Consulta de Crédito" },
  ];

  return (
    <aside className="w-60 h-full bg-white border-r text-sm">
      <div className="p-6 font-bold text-lg text-primary">Finance Pedro</div>
      <nav className="flex flex-col gap-1 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 transition font-medium",
              pathname === item.href
                ? "bg-primary text-white"
                : "text-zinc-700 hover:bg-primary/10"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
