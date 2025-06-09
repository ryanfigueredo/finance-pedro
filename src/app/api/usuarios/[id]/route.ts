import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { NextRequest } from "next/server";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["MASTER", "ADMIN", "CLIENTE"]),
});

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { [key: string]: string } }
// ) {
//   const { id } = params;
//   const body = await req.json();
//   const parsed = schema.safeParse(body);

//   if (!parsed.success) {
//     return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
//   }

//   const { name, email, role } = parsed.data;

//   const atualizado = await prisma.user.update({
//     where: { id },
//     data: { name, email, role },
//   });

//   return NextResponse.json(atualizado);
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { [key: string]: string } }
// ) {
//   const { id } = params;

//   await prisma.user.delete({ where: { id } });

//   return NextResponse.json({ ok: true });
// }
