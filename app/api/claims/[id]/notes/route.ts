import { NextResponse } from "next/server";
import db from "@/db";
import { claims, claimsNotes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

//GET all notes for a claim
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  //Get the claim id from the params

    const [claim] = await db.select({ id: claims.id }).from(claims).where(eq(claims.id, id));

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const notes = await db
      .select()
      .from(claimsNotes)
      .where(eq(claimsNotes.claimId, id))
      .orderBy(desc(claimsNotes.createdAt));

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/claims/[id]/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

//POST a new note for a claim
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  //Get the claim id from the params
    const body = await request.json();
    const { content, userId } = body;

    if (!content || !userId) {
      return NextResponse.json(
        { error: "content and userId are required" },
        { status: 400 }
      );
    }

    const [claim] = await db.select({ id: claims.id }).from(claims).where(eq(claims.id, id));

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const [note] = await db
      .insert(claimsNotes)
      .values({
        claimId: id,
        userId,
        content,
      })
      .returning();

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/claims/[id]/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
