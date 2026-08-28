import Link from "next/link";
import formatCurrency from "@/lib/claims/formatCurrency";

/**
 * Returns the styles used to display each claim status.
 */
function getStatusStyles(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "denied":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

interface Claim {
  userId: string;
  id: string;
  service: string;
  providerName: string;
  status: "approved" | "pending" | "denied";
  patientResponsibility: string | null;
}

/**
 * Displays a summary of each claim in the ClaimsList component.
 * Clicking the claim card navigates the user to the ClaimDetailPage component.
 */
function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <Link href={`/claims/${claim.id}?userId=${claim.userId}`} className="block">
      <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white">

        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{claim.service}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(claim.status)}`}>
            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3">{claim.providerName || "Unknown provider"}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">You owe</span>
          <span className="text-lg font-bold text-gray-900">
            {claim.patientResponsibility != null
              ? formatCurrency(claim.patientResponsibility)
              : "N/A"}
          </span>
        </div>

      </div>
    </Link>
  );
}

export default ClaimCard;