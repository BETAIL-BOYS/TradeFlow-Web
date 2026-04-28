import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const invoices = [
    {
      id: "INV-2026-001",
      riskScore: 15,
      status: "Approved",
      amount: "12,500.00",
      breakdown: [
        {
          label: "Payment History",
          type: "positive",
          description: "Debtor has 5 years clean payment history with no defaults."
        },
        {
          label: "Sector Volatility",
          type: "neutral",
          description: "Stable sector performance over the last 24 months."
        },
        {
          label: "Invoice Verification",
          type: "positive",
          description: "Invoice has been cryptographically verified on-chain."
        }
      ]
    },
    {
      id: "INV-2026-002",
      riskScore: 45,
      status: "Approved",
      amount: "8,200.00",
      breakdown: [
        {
          label: "Payment History",
          type: "neutral",
          description: "Limited payment history available for this debtor."
        },
        {
          label: "Sector Volatility",
          type: "neutral",
          description: "Moderate volatility in the construction sector."
        },
        {
          label: "Invoice Verification",
          type: "positive",
          description: "Invoice has been cryptographically verified on-chain."
        }
      ]
    },
    {
      id: "INV-2026-003",
      riskScore: 82,
      status: "Pending",
      amount: "25,000.00",
      breakdown: [
        {
          label: "Payment History",
          type: "negative",
          description: "Debtor has multiple late payments in the last 6 months."
        },
        {
          label: "Sector Volatility",
          type: "negative",
          description: "High sector volatility detected in the debtor's industry."
        },
        {
          label: "Concentration Risk",
          type: "negative",
          description: "High concentration of invoices from this specific debtor."
        }
      ]
    }
  ];

  return NextResponse.json(invoices);
}
