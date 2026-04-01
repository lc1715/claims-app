'use client'
import ClaimsList from "@/components/claims/ClaimsList";
import { useSearchParams } from "next/navigation";

function ClaimsPage() {
const searchParams = useSearchParams();
const userId = searchParams.get('userId');
console.log('userId', userId)

    return (
        <div>
            <ClaimsList userId={userId} />
        </div>
    )
}

export default ClaimsPage;