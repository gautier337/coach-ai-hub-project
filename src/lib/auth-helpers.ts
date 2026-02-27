import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getAuthenticatedUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      userId: null,
      error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
    };
  }

  return { userId: session.user.id, error: null };
}
