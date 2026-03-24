import { NextResponse } from "next/server";
import db from "@/db";
import { claims, users, claimsNotes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

//GET a single claim for a user
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [claimRow] = await db
      .select({
        claim: claims,
        user: {
          id: users.id,
          email: users.email,
          name: users.name,
        },
      })
      .from(claims)
      .leftJoin(users, eq(claims.userId, users.id))
      .where(eq(claims.id, id));

    if (!claimRow?.claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    //Get all notes for the claim
    const notes = await db
      .select()
      .from(claimsNotes)
      .where(eq(claimsNotes.claimId, id))
      .orderBy(desc(claimsNotes.createdAt));

    return NextResponse.json({
      ...claimRow.claim,
      user: claimRow.user,
      notes,
    });
  } catch (error) {
    console.error("GET /api/claims/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim" },
      { status: 500 }
    );
  }
}
