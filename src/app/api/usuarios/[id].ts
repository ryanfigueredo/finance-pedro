import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["MASTER", "ADMIN", "CLIENTE"]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "PUT") {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Dados inválidos", issues: parsed.error.issues });
    }

    const { name, email, role } = parsed.data;

    const atualizado = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    return res.status(200).json(atualizado);
  }

  if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id } });
    return res.status(204).end();
  }

  return res
    .setHeader("Allow", ["PUT", "DELETE"])
    .status(405)
    .end(`Method ${req.method} Not Allowed`);
}
