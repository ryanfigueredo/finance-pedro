"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { data: session } = useSession();

  return (
    <div className="bg-white px-6 py-3 border-b text-sm flex justify-between">
      <p>Bem-vindo, {session?.user?.name}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Sair
      </Button>
    </div>
  );
}
