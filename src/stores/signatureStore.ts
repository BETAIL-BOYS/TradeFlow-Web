import { create } from 'zustand';

export interface TransactionDetails {
  networkFee?: string;
  contractAddress?: string;
  amount?: string;
  fromToken?: string;
  toToken?: string;
}

export interface SignatureState {
  // State
  isSigning: boolean;
  signingMessage: string;
  transactionDetails: TransactionDetails | null;

  // Actions
  startSigning: (message?: string, details?: TransactionDetails | null) => void;
  stopSigning: () => void;
  updateMessage: (message: string) => void;
  setTransactionDetails: (details: TransactionDetails | null) => void;
}

export const useSignatureStore = create<SignatureState>((set) => ({
  // Initial state
  isSigning: false,
  signingMessage: 'Please sign the transaction in your wallet.',
  transactionDetails: null,

  // Actions
  startSigning: (
    message = 'Please sign the transaction in your wallet.',
    details: TransactionDetails | null = null
  ) => {
    set({
      isSigning: true,
      signingMessage: message,
      transactionDetails: details,
    });
  },

  stopSigning: () => {
    set({
      isSigning: false,
      signingMessage: 'Please sign the transaction in your wallet.',
      transactionDetails: null,
    });
  },

  updateMessage: (message: string) => {
    set({ signingMessage: message });
  },

  setTransactionDetails: (details: TransactionDetails | null) => {
    set({ transactionDetails: details });
  },
}));

// Selector hooks for common use cases
export const useIsSigning = (): boolean => useSignatureStore((state) => state.isSigning);
export const useSigningMessage = (): string => useSignatureStore((state) => state.signingMessage);
export const useTransactionDetails = (): TransactionDetails | null =>
  useSignatureStore((state) => state.transactionDetails);

export interface SigningActions {
  startSigning: SignatureState['startSigning'];
  stopSigning: SignatureState['stopSigning'];
  updateMessage: SignatureState['updateMessage'];
  setTransactionDetails: SignatureState['setTransactionDetails'];
}

export const useSigningActions = (): SigningActions => {
  const startSigning = useSignatureStore((state) => state.startSigning);
  const stopSigning = useSignatureStore((state) => state.stopSigning);
  const updateMessage = useSignatureStore((state) => state.updateMessage);
  const setTransactionDetails = useSignatureStore((state) => state.setTransactionDetails);

  return {
    startSigning,
    stopSigning,
    updateMessage,
    setTransactionDetails,
  };
};
