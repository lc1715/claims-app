"use client";

import { useEffect, useState } from "react";
import ClaimCard from "./ClaimCard";

interface Claim {
  id: string;
  service: string;
  providerName: string;
  status: string;
  patientResponsibility: number;
}

function ClaimsList({ userId }: { userId: string | null }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function fetchClaims() {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/claims?userId=${userId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch claims");
        }

        const data = await res.json();
        setClaims(data);
      } catch (err: any) {
        setError(true);
        console.error('Error fetching claims:', err)
      } finally {
        setLoading(false);
      }
    }

    fetchClaims();
  }, [userId]);

  // Loading state
  if (loading) return <p>Loading claims...</p>;

  // Error state
  if (error) return <p>An error occurred. Please try again later.</p>;

  // Empty state
  if (claims.length === 0) return <p>No claims found.</p>;

  return (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Claims</h1>
      {claims.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} />
      ))}
    </div>
  );
}

export default ClaimsList;