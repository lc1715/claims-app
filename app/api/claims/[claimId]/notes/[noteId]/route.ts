import { NextResponse } from "next/server";
import db from "@/db";
import { claimsNotes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Updates a note's content for a claim. The note must belong to the given claim.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ claimId: string; noteId: string }> }
) {
  try {
    const { claimId, noteId } = await params;
    const body = await request.json();
    const { content } = body;

    if (typeof content !== "string" || content.trim() === "") {  
      return NextResponse.json(
        { error: "content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const [updatedNote] = await db
      .update(claimsNotes)
      .set({ content: content.trim(), updatedAt: new Date() })
      .where(
        and(
          eq(claimsNotes.id, noteId),
          eq(claimsNotes.claimId, claimId)
        )
      )
      .returning();

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("PATCH /api/claims/[claimId]/notes/[noteId] error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

/**
 * Deletes a note for a claim. The note must belong to the given claim.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ claimId: string; noteId: string }> }
) {
  try {
    const { claimId, noteId } = await params;

    const [deletedNote] = await db
      .delete(claimsNotes)
      .where(
        and(
          eq(claimsNotes.id, noteId),
          eq(claimsNotes.claimId, claimId)
        )
      )
      .returning({ deletedNote : claimsNotes.id});

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/claims/[claimId]/notes/[noteId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
