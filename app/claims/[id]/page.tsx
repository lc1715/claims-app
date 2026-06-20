import ClaimHeader from "@/components/claim-detail/ClaimHeader";
import CostBreakdown from "@/components/claim-detail/CostBreakdown";
import NotesSection from "@/components/notes/NotesSection";
import db from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

async function getClaim(id: string) {
  const claim = await db
    .select()
    .from(claims)
    .where(eq(claims.id, id))
    .limit(1);

  const claimRow = claim[0];

  if (!claimRow) {
    notFound();
  }

  return claimRow;
}

export default async function ClaimDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;     //params is a Promise
  const claim = await getClaim(id);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <ClaimHeader claim={claim} />
      <CostBreakdown claim={claim} />
      <NotesSection claimId={claim.id} userId={claim.userId} />
    </div>
  );
}