import formatCurrency from "@/lib/claims/formatCurrency";

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

interface ClaimHeaderProps {
  id: string;
  claimNumber: string;
  service: string;
  providerName: string;
  serviceDate: string;
  insuranceProvider: string | null;
  policyNumber: string | null;
  status: "approved" | "pending" | "denied";
  patientResponsibility: string | null;
}

function ClaimHeader({ claim }: { claim: ClaimHeaderProps }) {
  console.log('claim data', claim);

  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {claim.service}
          </h1>

          <p className="text-gray-500 mt-1">
            {claim.providerName || "Unknown provider"}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(claim.status)}`}
        >
          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <div>
          <p className="text-gray-500">Claim Number</p>
          <p className="font-medium">{claim.claimNumber}</p>
        </div>

        <div>
          <p className="text-gray-500">Service Date</p>
          <p className="font-medium">{claim.serviceDate}</p>
        </div>

        <div>
          <p className="text-gray-500">Insurance</p>
          <p className="font-medium">
            {claim.insuranceProvider}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Patient Responsibility</p>
          <p className="font-semibold">
            {formatCurrency(claim.patientResponsibility)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClaimHeader;