import {
  Contract,
  TransactionBuilder,
  scValToNative,
  nativeToScVal,
  Account,
} from "soroban-client";
import { getSorobanClient } from "../client";
import { getSorobanConfig } from "../config";
import { signTransaction, waitForTransaction } from "@/lib/stellar";

export interface Invoice {
  id: string;
  amount: bigint;
  issuer: string;
  recipient: string;
  status: string;
  createdAt: number;
}

export interface InvoiceMetadata {
  debtorName: string;
  dueDate: string;
  supportingDocumentUri: string | null;
  timestamp: number;
}

export interface MintInvoiceParams {
  invoiceId: string;
  amount: bigint;
  recipient: string;
  callerPublicKey: string;
  metadata?: InvoiceMetadata;
}

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const client = getSorobanClient();
  const { contractIds, networkPassphrase } = getSorobanConfig();
  const contract = new Contract(contractIds.invoice);

  const args = [nativeToScVal(invoiceId, { type: "string" })];

  const result = await client.simulateTransaction(
    new TransactionBuilder(
      new Account("GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN", "0"),
      { fee: "100", networkPassphrase }
    )
      .addOperation(contract.call("get_invoice", ...args))
      .setTimeout(30)
      .build()
  );

  if ("error" in result) {
    throw new Error(`get_invoice simulation failed: ${(result as any).error}`);
  }

  const returnVal = (result as any).result?.retval;
  if (!returnVal) throw new Error("No return value from get_invoice.");

  const native = scValToNative(returnVal) as any;

  return {
    id: native.id ?? invoiceId,
    amount: BigInt(native.amount ?? 0),
    issuer: native.issuer ?? "",
    recipient: native.recipient ?? "",
    status: native.status ?? "unknown",
    createdAt: Number(native.created_at ?? 0),
  };
}

export async function mintInvoice(params: MintInvoiceParams): Promise<string> {
  const { invoiceId, amount, recipient, callerPublicKey, metadata } = params;
  const client = getSorobanClient();
  const { contractIds, networkPassphrase } = getSorobanConfig();
  const contract = new Contract(contractIds.invoice);

  const account = await client.getAccount(callerPublicKey);

  const args = [
    nativeToScVal(invoiceId, { type: "string" }),
    nativeToScVal(amount, { type: "i128" }),
    nativeToScVal(recipient, { type: "address" }),
  ];

  // Add metadata if provided
  if (metadata) {
    const metadataScVal = nativeToScVal({
      debtor_name: metadata.debtorName,
      due_date: metadata.dueDate,
      supporting_doc_uri: metadata.supportingDocumentUri,
      timestamp: metadata.timestamp
    }, { type: "map" });
    args.push(metadataScVal);
  }

  const tx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase,
  })
    .addOperation(contract.call("mint_invoice", ...args))
    .setTimeout(60)
    .build();

  const simResult = await client.simulateTransaction(tx);
  if ("error" in simResult) {
    throw new Error(`mint_invoice simulation failed: ${(simResult as any).error}`);
  }

  const preparedTx = await client.prepareTransaction(tx, networkPassphrase);
  const xdr = preparedTx.toXDR();

  const signedXdr = await signTransaction(xdr, {
    address: callerPublicKey,
    networkPassphrase,
  });

  const { hash } = await client.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, networkPassphrase)
  );

  return await waitForTransaction(hash);
}
