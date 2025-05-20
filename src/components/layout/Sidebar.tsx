"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/duplicatas", label: "Duplicatas" },
    { href: "/clientes", label: "Clientes" },
    { href: "/consulta-credito", label: "Consulta de Crédito" },
    { href: "/borderos", label: "Borderôs" },
  ];

  return (
    <>
      {/* Botão mobile */}
      <div className="sm:hidden  p-4 border-b bg-white flex items-start gap-3">
        <button onClick={() => setOpen(!open)}>
          <Menu className="w-6 h-6 text-zinc-700" />
        </button>
      </div>

      {/* Sidebar mobile */}
      {open && (
        <aside className="sm:hidden bg-white border-b px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 transition font-medium",
                pathname === item.href
                  ? "bg-primary text-white"
                  : "text-zinc-700 hover:bg-primary/10"
              )}
            >
              {item.label}
            </Link>
          ))}
        </aside>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden sm:block w-60 h-full bg-white border-r text-sm">
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
    </>
  );
}
