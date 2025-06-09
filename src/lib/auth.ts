import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function auth() {
  return await getServerSession(authOptions);
}
