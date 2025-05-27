import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // você pode renomear como quiser

export async function auth() {
  return await getServerSession(authOptions);
}
