import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";

/**
 * Lists all users with public profile fields.
 */
export async function GET() {
  try {
    const usersRows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    return NextResponse.json(usersRows);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
