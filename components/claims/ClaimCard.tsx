'use client'

import { useEffect, useState } from "react";

interface ClaimCardProps {
    userId: string | null;
}

interface Claim {
    service: string,
    providerName: string,
    status: string,
    patientResponsibility: number
}

function ClaimCard({ userId }: ClaimCardProps) {
    const [claim, setClaim] = useState<Claim | null>(null);

    useEffect(() => {
        async function getClaim() {
            let resp = await fetch(`/api/claims?userId=${userId}`);
            let data = await resp.json();
            setClaim(data);
        }
        getClaim();
    }, [])

    console.log('claims for claims list', claim)
    return (
        <div>
            <h1>This is in the Claim Card</h1>
        </div>
    )
}

export default ClaimCard;