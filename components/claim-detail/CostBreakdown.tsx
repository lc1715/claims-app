import formatCurrency from "@/lib/claims/formatCurrency";

interface Claim {
    billedAmount: string;
    allowedAmount: string | null;
    insurancePaid: string | null;
    copayAmount: string | null;
    appliedTowardsDeductible: string | null;
    coinsuranceAmount: string | null;
    otherAmount: string | null;
    otherAmountReason: string | null;
    patientResponsibility: string | null;
}

interface CostBreakdownProps {
    claim: Claim;
}

function BreakdownRow({ label, value }: { label: string, value: string | null }) {
    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">{label}</span>

            <span className="font-medium text-gray-900">
                {formatCurrency(value)}
            </span>
        </div>
    );
}

function CostBreakdown({ claim }: CostBreakdownProps) {
    return (
        <section className="bg-white border rounded-2xl shadow-sm p-6">

            {/* Title */}
            <div className="mb-5">
                <h2 className="text-xl font-semibold">
                    Cost Breakdown
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    See how your healthcare costs were split.
                </p>
            </div>

            {/* Main Costs */}
            <div className="space-y-1">

                <BreakdownRow
                    label="Amount Billed"
                    value={claim.billedAmount}
                />

                <BreakdownRow
                    label="Allowed Amount"
                    value={claim.allowedAmount}
                />

                <BreakdownRow
                    label="Insurance Paid"
                    value={claim.insurancePaid}
                />

            </div>

            {/* Divider */}
            <div className="border-t my-5"></div>

            {/* Patient Responsibility */}
            <div>
                <h3 className="text-lg font-medium mb-3">
                    Your Responsibility
                </h3>

                <div className="space-y-1">

                    <BreakdownRow
                        label="Copay"
                        value={claim.copayAmount}
                    />

                    <BreakdownRow
                        label="Applied to Deductible"
                        value={claim.appliedTowardsDeductible}
                    />

                    <BreakdownRow
                        label="Coinsurance"
                        value={claim.coinsuranceAmount}
                    />

                    {/* Optional Other Amount */}
                    {claim.otherAmount && (
                        <div>
                            <BreakdownRow
                                label={
                                    claim.otherAmountReason || "Other Charges"
                                }
                                value={claim.otherAmount}
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Final Total */}
            <div className="border-t mt-5 pt-5">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                        Total You Owe
                    </span>

                    <span className="text-2xl font-bold">
                        {formatCurrency(claim.patientResponsibility)}
                    </span>
                </div>
            </div>
        </section>
    );
}

export default CostBreakdown;