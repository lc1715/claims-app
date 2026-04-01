import ClaimCard from "./ClaimCard";

interface ClaimsListProps{
    userId: string | null;
}

function ClaimsList({ userId }: ClaimsListProps) {
    return (
        <div>
            < ClaimCard userId={userId}/>
        </div>
    )
}

export default ClaimsList;