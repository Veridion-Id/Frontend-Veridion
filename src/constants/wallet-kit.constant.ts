import {
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

// Session and network storage keys
const SESSION_KEY = "swk_session_v1";
const NETWORK_KEY = "network";

// Network types
export type NetworkType = "testnet" | "mainnet";

// Create singleton StellarWalletsKit instance
export const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule()],
});

// Network management
export const getCurrentNetwork = (): NetworkType => {
  if (typeof window === "undefined") return "testnet";

  const savedNetwork = localStorage.getItem(NETWORK_KEY) as NetworkType;
  return savedNetwork || "testnet";
};

export const getNetworkPassphrase = (): string => {
  const network = getCurrentNetwork();
  return network === "mainnet"
    ? "Public Global Stellar Network ; September 2015"
    : "Test SDF Network ; September 2015";
};

export const setNetwork = async (network: NetworkType): Promise<void> => {
  if (typeof window === "undefined") return;

  localStorage.setItem(NETWORK_KEY, network);
  // Note: The kit network is set during initialization
  // You may need to reinitialize the kit or handle network changes differently
};

// Session management
export const saveSession = (session: {
  address: string;
  walletId: string;
}): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const loadSession = (): { address: string; walletId: string } | null => {
  if (typeof window === "undefined") return null;

  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_KEY);
};

// Wallet modal - real implementation
export const openSelectWalletModal = async (): Promise<{
  address: string;
  walletId: string;
} | null> => {
  return new Promise((resolve) => {
    try {
      // Open the modal to let user select a wallet
      kit.openModal({
        onWalletSelected: async (wallet) => {
          try {
            // Set the selected wallet
            await kit.setWallet(wallet.id);

            // Get the address from the wallet
            const { address } = await kit.getAddress();

            if (address) {
              resolve({
                address,
                walletId: wallet.id,
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error("Error getting address:", error);
            resolve(null);
          }
        },
        onClosed: (error) => {
          if (error) {
            console.error("Modal closed with error:", error);
          }
          resolve(null);
        },
      });
    } catch (error) {
      console.error("Failed to open wallet modal:", error);
      resolve(null);
    }
  });
};
