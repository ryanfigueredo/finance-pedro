import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "MASTER" | "ADMIN" | "CLIENTE";
    };
  }

  // 👇 Remover o campo `password` aqui
  interface User {
    id: string;
    name: string;
    email: string;
    role: "MASTER" | "ADMIN" | "CLIENTE";
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    role: "MASTER" | "ADMIN" | "CLIENTE";
  }
}
