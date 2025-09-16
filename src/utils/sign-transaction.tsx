import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";

export interface SignTransactionParams {
  unsignedTransaction: string;
  address: string;
}

export const signTransaction = async ({
  unsignedTransaction,
  address,
}: SignTransactionParams): Promise<string> => {
  try {
    // Import the kit dynamically to avoid SSR issues
    const { kit } = await import("../constants/wallet-kit.constant");
    const networkPassphrase = WalletNetwork.TESTNET;

    // Sign the transaction using the real StellarWalletsKit API
    const result = await kit.signTransaction(unsignedTransaction, {
      address,
      networkPassphrase,
    });

    if (!result || !result.signedTxXdr) {
      throw new Error("Failed to sign transaction");
    }

    return result.signedTxXdr;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw new Error(
      `Transaction signing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
