export interface SorobanConfig {
  rpcUrl: string;
  networkPassphrase: string;
  contractIds: {
    invoice: string;
  };
}

export function getSorobanConfig(): SorobanConfig {
  const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL?.trim();
  const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE?.trim();
  const invoiceContractId = process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID?.trim();

  if (!rpcUrl) throw new Error("NEXT_PUBLIC_SOROBAN_RPC_URL is not set.");
  if (!networkPassphrase) throw new Error("NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE is not set.");
  if (!invoiceContractId) throw new Error("NEXT_PUBLIC_INVOICE_CONTRACT_ID is not set.");

  return {
    rpcUrl,
    networkPassphrase,
    contractIds: {
      invoice: invoiceContractId,
    },
  };
}