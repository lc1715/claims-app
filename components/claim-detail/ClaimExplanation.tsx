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

interface CostExplanationProps {
    claim: Claim;
}

/**
 * Returns true if the amount is not null and greater than zero.
 * The type predicate (`value is string`) tells TypeScript that
 * the value is a string when this function returns true.
 */
function hasAmount(value: string | null): value is string {
    return value !== null && Number(value) > 0;
}

/**
 * Displays a plain-language explanation to help users understand 
 * how the claim costs were calculated.
 */
function ClaimExplanation({ claim }: CostExplanationProps) {
    const explanation: string[] = [];

    explanation.push(`Your provider billed ${formatCurrency(claim.billedAmount)} for this service.`);

    if (hasAmount(claim.allowedAmount)) {
        explanation.push(`Your insurance allowed ${formatCurrency(claim.allowedAmount)} for this service.`);
    }

    if (hasAmount(claim.insurancePaid)) {
        explanation.push(`Your insurance paid ${formatCurrency(claim.insurancePaid)} toward this claim.`);
    } else {
        explanation.push(`Your insurance did not pay anything toward this claim.`);
    }

    if (hasAmount(claim.copayAmount)) {
        explanation.push(`Your responsibility includes a ${formatCurrency(claim.copayAmount)} copay.`);
    }

    if (hasAmount(claim.appliedTowardsDeductible)) {
        explanation.push(`${formatCurrency(claim.appliedTowardsDeductible)} was applied towards your deductible.`);
    }

    if (hasAmount(claim.coinsuranceAmount)) {
        explanation.push(`Your responsibility includes ${formatCurrency(claim.coinsuranceAmount)} in coinsurance.`);
    }

    if (hasAmount(claim.otherAmount)) {
        explanation.push(`Your responsibility also includes ${formatCurrency(claim.otherAmount)} ${claim.otherAmountReason ? ` for ${claim.otherAmountReason}` : ` in other charges`}.`);
    }

    if (hasAmount(claim.patientResponsibility)) {
        explanation.push(`Your total responsibility for this claim is ${formatCurrency(claim.patientResponsibility)}.`);
    } else {
        explanation.push(`You owe $0.00 for this claim.`);
    }

    return (
        <div>
            {explanation.map((e, index) => (
                <p key={index}>{e}</p>
            ))}
        </div>
    )
}

export default ClaimExplanation;
