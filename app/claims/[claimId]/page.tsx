import ClaimHeader from "@/components/claim-detail/ClaimHeader";
import CostBreakdown from "@/components/claim-detail/CostBreakdown";
import NotesSection from "@/components/notes/NotesSection";
import ClaimExplanation from "@/components/claim-detail/ClaimExplanation";
import AIClaimExplanation from "@/components/claim-detail/AIClaimExplanation";

import db from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

/**
 * Displays the details for a specific claim.
 * Retrieves the claim from the database using the claim ID 
 * and renders the claim details, explanations, and notes.
 */
async function ClaimDetailPage({ params }: { params: Promise<{ claimId: string }> }) {
  const { claimId } = await params;

  // Query the database for the claim with the claimId
  const claimArr = await db
    .select()
    .from(claims)
    .where(eq(claims.id, claimId))
    .limit(1);

  const claim = claimArr[0];

  if (!claim) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <ClaimHeader claim={claim} />
      <CostBreakdown claim={claim} />
      <ClaimExplanation claim={claim} />
      <AIClaimExplanation claim={claim} />
      <NotesSection claimId={claim.id} userId={claim.userId} />
    </div>
  );
}

export default ClaimDetailPage;