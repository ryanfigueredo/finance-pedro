import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="text-sm font-medium text-zinc-700">Bem-vindo, Ryan</div>
      <Button onClick={() => signOut({ callbackUrl: "/login" })}>Sair</Button>
    </header>
  );
}
