"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UsuariosTable } from "@/components/usuarios/UsuariosTable";

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session.user.role !== "MASTER") {
      router.replace("/acesso-negado");
    }
  }, [status, session, router]);

  if (status === "loading") return null;

  return <UsuariosTable />;
}
