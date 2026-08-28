'use client'

import { useEffect, useState } from "react";
import ClaimCard from "./ClaimCard";

interface Claim {
  userId: string;
  id: string;
  service: string;
  providerName: string;
  status: "approved" | "pending" | "denied";
  patientResponsibility: string | null;
}

/**
 * Displays all the claims for a specific user.
 * Fetches the user's claims from the claims API route and displays each claim 
 * using the ClaimCard component.
 */
function ClaimsList({ userId }: { userId: string | null }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch all claims for a specific user whenever the userId changes
  useEffect(() => {
    if (!userId) return;

    async function fetchClaims() {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/claims?userId=${userId}`);

        if (!res.ok) throw new Error("Failed to fetch claims");

        const data = await res.json();
        setClaims(data);
      } catch (err) {
        setError(true);
        console.error("Error fetching claims:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClaims();
  }, [userId]);

  // If no userId is provided, prompt the user to select a demo user.
  if (!userId) return <p>Please select a demo user to view claims.</p>;

  // Loading state
  if (loading) return <p>Loading claims...</p>;

  // Error state
  if (error) return <p>An error occurred. Please try again later.</p>;

  // Empty state
  if (claims.length === 0) return <p>No claims found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Claims</h1>
      {claims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)}
    </div>
  );
}

export default ClaimsList;