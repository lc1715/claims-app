import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

interface ClaimExplanationData {
    providerName: string;
    service: string;
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

interface ExplainClaimRequest {
    claim: ClaimExplanationData;
}

/**
 * Handles POST requests to generate a plain-language explanation of a health insurance claim.
 * Sends the provided claim data to the Gemini API and returns the AI-generated explanation.
 */
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as ExplainClaimRequest;
        const { claim } = body;

        if (!claim) {
            return NextResponse.json(
                { error: "Claim data is required." },
                { status: 400 }
            );
        }

        const prompt =
            `You explain health insurance claim cost breakdowns in clear, plain language.

            Follow these rules:
            - Use only the claim information provided.
            - Do not invent missing information.
            - Do not provide medical, legal, or financial advice.
            - Do not say that the patient has already paid an amount.
            - Describe patient responsibility as the amount the claim says the patient may owe.
            - Explain that this may not be the provider's final bill.
            - Do not mention values that are null.
            - Keep the explanation concise.
            - Use short paragraphs.

            Claim information:
            Provider: ${claim.providerName}
            Service: ${claim.service}
            Provider billed: ${claim.billedAmount}
            Allowed amount: ${claim.allowedAmount ?? "Not provided"}
            Insurance paid: ${claim.insurancePaid ?? "Not provided"}
            Copay: ${claim.copayAmount ?? "Not provided"}
            Applied toward deductible: ${claim.appliedTowardsDeductible ?? "Not provided"}
            Coinsurance: ${claim.coinsuranceAmount ?? "Not provided"}
            Other amount: ${claim.otherAmount ?? "Not provided"}
            Other amount reason: ${claim.otherAmountReason ?? "Not provided"}
            Patient responsibility: ${claim.patientResponsibility ?? "Not provided"}`.trim();

        // Generate a claim explanation using the Gemini model
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
        });

        const explanation = response.text?.trim();

        if (!explanation) {
            return NextResponse.json(
                { error: "The AI did not generate an explanation." },
                { status: 502 }
            );
        }

        return NextResponse.json({ explanation });
    } catch (error) {
        console.error("Gemini explanation error:", error);

        return NextResponse.json(
            { error: "The AI explanation is temporarily unavailable." },
            { status: 500 }
        );
    }
}
