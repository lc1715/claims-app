import db from "./index";
import { users, claims, claimsNotes } from "./schema";

/**
 * Generates mock data for users, claims, and claims notes tables.
 * Run with: npm run db:seed
 *
 * Data shape:
 * - 2 users
 * - 6 claims (3 per user; mix of approved, pending, denied)
 * - 5 notes (1 claim with 2 notes, 3 claims with 1 note, 2 claims with no notes)
 */
async function seed() {
  console.log("Seeding database...");

  // 2 users
  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "john.doe@example.com", name: "John Doe", passwordHash: "$2a$10$dummy.hash" },
      { email: "jane.smith@example.com", name: "Jane Smith", passwordHash: "$2a$10$dummy.hash" },
    ])
    .returning({ id: users.id });

  const [user1, user2] = insertedUsers;

  // 6 claims: 3 per user, mix of statuses
  const claimsData = [
    {
      userId: user1.id,
      claimNumber: "CLM-2024-001847",
      service: "Office Visit - Level 3 (99213)",
      providerName: "Metro Family Medicine",
      serviceDate: "2024-01-15",
      billedAmount: "185.00",
      allowedAmount: "125.00",
      insurancePaid: "100.00",
      copayAmount: "25.00",
      appliedTowardsDeductible: "0.00",
      coinsuranceAmount: "0.00",
      otherAmount: "0.00",
      patientResponsibility: "25.00",
      policyNumber: "BCBS-8824-7741",
      insuranceProvider: "Blue Cross Blue Shield",
      status: "approved" as const,
    },
    {
      userId: user1.id,
      claimNumber: "CLM-2024-002103",
      service: "Comprehensive Lab Panel",
      providerName: "Quest Diagnostics",
      serviceDate: "2024-02-03",
      billedAmount: "342.00",
      allowedAmount: "89.50",
      insurancePaid: "71.60",
      copayAmount: "0.00",
      appliedTowardsDeductible: "17.90",
      coinsuranceAmount: "0.00",
      otherAmount: "0.00",
      patientResponsibility: "17.90",
      policyNumber: "BCBS-8824-7741",
      insuranceProvider: "Blue Cross Blue Shield",
      status: "approved" as const,
    },
    {
      userId: user1.id,
      claimNumber: "CLM-2024-005421",
      service: "Physical Therapy - 60 min",
      providerName: "Elite Sports Rehabilitation",
      serviceDate: "2024-03-08",
      billedAmount: "215.00",
      allowedAmount: "155.00",
      insurancePaid: "124.00",
      copayAmount: "25.00",
      appliedTowardsDeductible: "6.00",
      coinsuranceAmount: "0.00",
      otherAmount: "0.00",
      patientResponsibility: "31.00",
      policyNumber: "BCBS-8824-7741",
      insuranceProvider: "Blue Cross Blue Shield",
      status: "pending" as const,
    },
    {
      userId: user2.id,
      claimNumber: "CLM-2024-001203",
      service: "Annual Wellness Visit",
      providerName: "City Health Primary Care",
      serviceDate: "2024-01-22",
      billedAmount: "220.00",
      allowedAmount: "165.00",
      insurancePaid: "165.00",
      copayAmount: "0.00",
      appliedTowardsDeductible: "0.00",
      coinsuranceAmount: "0.00",
      otherAmount: "0.00",
      patientResponsibility: "0.00",
      policyNumber: "AETNA-5532-9921",
      insuranceProvider: "Aetna",
      status: "approved" as const,
    },
    {
      userId: user2.id,
      claimNumber: "CLM-2024-002847",
      service: "Mammography - Screening",
      providerName: "Women's Imaging Center",
      serviceDate: "2024-02-14",
      billedAmount: "395.00",
      allowedAmount: "285.00",
      insurancePaid: "228.00",
      copayAmount: "0.00",
      appliedTowardsDeductible: "57.00",
      coinsuranceAmount: "0.00",
      otherAmount: "0.00",
      patientResponsibility: "57.00",
      policyNumber: "AETNA-5532-9921",
      insuranceProvider: "Aetna",
      status: "approved" as const,
    },
    {
      userId: user2.id,
      claimNumber: "CLM-2024-004112",
      service: "Dermatology - Skin Lesion Removal",
      providerName: "Advanced Dermatology Associates",
      serviceDate: "2024-03-05",
      billedAmount: "425.00",
      allowedAmount: "0.00",
      insurancePaid: "0.00",
      copayAmount: "0.00",
      appliedTowardsDeductible: "0.00",
      coinsuranceAmount: "0.00",
      otherAmount: "425.00",
      otherAmountReason: "Procedure not covered - cosmetic indication",
      patientResponsibility: "425.00",
      policyNumber: "AETNA-5532-9921",
      insuranceProvider: "Aetna",
      status: "denied" as const,
    },
  ];

  const insertedClaims = await db
    .insert(claims)
    .values(claimsData)
    .returning({ id: claims.id });

  // 5 notes: claim 1 (1 note), claim 3 (1 note), claim 5 (1 note), claim 6 (2 notes), claims 2 & 4 (0 notes)
  const notesData = [
    {
      claimId: insertedClaims[0].id,
      userId: user1.id,
      content: "First visit with this provider. They took my insurance without any issues.",
    },
    {
      claimId: insertedClaims[2].id,
      userId: user1.id,
      content: "Paid the $25 copay for this visit. More sessions to come.",
    },
    {
      claimId: insertedClaims[4].id,
      userId: user2.id,
      content: "Need to call insurance about this charge.",
    },
    {
      claimId: insertedClaims[5].id,
      userId: user2.id,
      content: "Claim was denied. Asked Dr. Johnson's office to send more info to insurance.",
    },
    {
      claimId: insertedClaims[5].id,
      userId: user2.id,
      content: "Dr. Johnson's office sent the records. Waiting to see if insurance updates the claim.",
    },
  ];

  await db.insert(claimsNotes).values(notesData);

  console.log(
    `Inserted ${insertedUsers.length} users, ${insertedClaims.length} claims, and ${notesData.length} claims notes.`
  );
}

seed()
  .then(() => {
    console.log("Seed completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
