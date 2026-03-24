import { NextResponse } from "next/server";
import db from "@/db";
import { claims, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

//GET all claims for a user or all claims
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const baseQuery = db
      .select({
        claim: claims,
        user: {
          id: users.id,
          email: users.email,
          name: users.name,
        },
      })
      .from(claims)
      .leftJoin(users, eq(claims.userId, users.id));

    //If a userId is provided, filter the claims by the user id, otherwise get all claims
    const results = userId
      ? await baseQuery.where(eq(claims.userId, userId)).orderBy(desc(claims.createdAt))
      : await baseQuery.orderBy(desc(claims.createdAt));

    console.log("results", results);

    const claimsWithUser = results.map(({ claim, user }) => ({
      ...claim,
      user,
    }));

    console.log("claimsWithUser", claimsWithUser);

    return NextResponse.json(claimsWithUser);
  } catch (error) {
    console.error("GET /api/claims error:", error);
    return NextResponse.json(
      { error: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}
