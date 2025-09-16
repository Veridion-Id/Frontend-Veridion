import {
  Client,
  networks,
  VerificationType,
  Verification,
  PassportError,
} from "stellar_passport";
import { Keypair, BASE_FEE } from "@stellar/stellar-sdk";
import { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { env } from "@/config/env.config";

/**
 * Configuración del servicio Stellar Passport
 */
export interface StellarPassportConfig {
  rpcUrl?: string;
  networkPassphrase?: string;
  contractId?: string;
  defaultFee?: number;
  timeoutInSeconds?: number;
}

/**
 * Resultado de operaciones del contrato
 */
export interface ContractResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  transactionHash?: string;
}

/**
 * Parámetros para registro de usuario
 */
export interface RegisterUserParams {
  wallet: string;
  name: string;
  surnames: string;
}

/**
 * Parámetros para actualización de perfil
 */
export interface UpdateProfileParams {
  wallet: string;
  name: string;
  surnames: string;
}

/**
 * Parámetros para upsert de verificación
 */
export interface UpsertVerificationParams {
  wallet: string;
  vtype: VerificationType;
  points: number;
}

/**
 * Servicio para interactuar con el contrato Stellar Passport
 */
export class StellarPassportService {
  private client: Client;
  private config: Required<StellarPassportConfig>;

  constructor(config: StellarPassportConfig = {}) {
    this.config = {
      rpcUrl: config.rpcUrl || env.RPC_ENDPOINTS.testnet,
      networkPassphrase:
        config.networkPassphrase || networks.testnet.networkPassphrase,
      contractId: config.contractId || networks.testnet.contractId,
      defaultFee: config.defaultFee || Number(BASE_FEE),
      timeoutInSeconds: config.timeoutInSeconds || 30,
    };

    this.client = new Client({
      contractId: this.config.contractId,
      networkPassphrase: this.config.networkPassphrase,
      rpcUrl: this.config.rpcUrl,
    });
  }

  /**
   * Obtiene la versión del contrato
   */
  async getVersion(): Promise<ContractResult<number>> {
    try {
      const transaction = await this.client.version({
        fee: this.config.defaultFee,
        timeoutInSeconds: this.config.timeoutInSeconds,
        simulate: true,
      });

      const result = await transaction.simulate();

      return {
        success: true,
        data: result.result,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Registra un nuevo usuario en el contrato
   */
  async registerUser(
    params: RegisterUserParams,
    _signer: Keypair
  ): Promise<ContractResult<null>> {
    try {
      const transaction = await this.client.register(
        {
          wallet: params.wallet,
          name: params.name,
          surnames: params.surnames,
        },
        {
          fee: this.config.defaultFee,
          timeoutInSeconds: this.config.timeoutInSeconds,
          simulate: true,
        }
      );

      // Firmar y enviar la transacción
      const signedTransaction = await this.signAndSendTransaction(transaction);

      return {
        success: true,
        data: null,
        transactionHash: signedTransaction.hash,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Obtiene el score de un usuario
   */
  async getUserScore(wallet: string): Promise<ContractResult<number>> {
    try {
      const transaction = await this.client.get_score(
        { wallet },
        {
          fee: this.config.defaultFee,
          timeoutInSeconds: this.config.timeoutInSeconds,
          simulate: true,
        }
      );

      const result = await transaction.simulate();

      return {
        success: true,
        data: result.result,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Obtiene las verificaciones de un usuario
   */
  async getUserVerifications(
    wallet: string
  ): Promise<ContractResult<Verification[]>> {
    try {
      const transaction = await this.client.get_verifications(
        { wallet },
        {
          fee: this.config.defaultFee,
          timeoutInSeconds: this.config.timeoutInSeconds,
          simulate: true,
        }
      );

      const result = await transaction.simulate();

      return {
        success: true,
        data: result.result,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Agrega o actualiza una verificación para un usuario
   */
  async upsertVerification(
    params: UpsertVerificationParams,
    _signer: Keypair
  ): Promise<ContractResult<number>> {
    try {
      const transaction = await this.client.upsert_verification(
        {
          wallet: params.wallet,
          vtype: params.vtype,
          points: params.points,
        },
        {
          fee: this.config.defaultFee,
          timeoutInSeconds: this.config.timeoutInSeconds,
          simulate: true,
        }
      );

      // Firmar y enviar la transacción
      const signedTransaction = await this.signAndSendTransaction(transaction);

      return {
        success: true,
        data: signedTransaction.result as number,
        transactionHash: signedTransaction.hash,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Actualiza el perfil de un usuario
   */
  async updateProfile(
    params: UpdateProfileParams,
    _signer: Keypair
  ): Promise<ContractResult<null>> {
    try {
      const transaction = await this.client.update_profile(
        {
          wallet: params.wallet,
          name: params.name,
          surnames: params.surnames,
        },
        {
          fee: this.config.defaultFee,
          timeoutInSeconds: this.config.timeoutInSeconds,
          simulate: true,
        }
      );

      // Firmar y enviar la transacción
      const signedTransaction = await this.signAndSendTransaction(transaction);

      return {
        success: true,
        data: null,
        transactionHash: signedTransaction.hash,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Obtiene información completa del usuario (score + verificaciones)
   */
  async getUserInfo(wallet: string): Promise<
    ContractResult<{
      score: number;
      verifications: Verification[];
    }>
  > {
    try {
      const [scoreResult, verificationsResult] = await Promise.all([
        this.getUserScore(wallet),
        this.getUserVerifications(wallet),
      ]);

      if (!scoreResult.success || !verificationsResult.success) {
        return {
          success: false,
          error: scoreResult.error || verificationsResult.error,
        };
      }

      return {
        success: true,
        data: {
          score: scoreResult.data!,
          verifications: verificationsResult.data!,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Firma y envía una transacción
   */
  private async signAndSendTransaction(
    transaction: AssembledTransaction<unknown>
  ): Promise<{ hash: string; result: unknown }> {
    // Firmar y enviar la transacción
    const response = await transaction.signAndSend();

    return {
      hash:
        ((response as unknown as Record<string, unknown>).hash as string) ||
        ((response as unknown as Record<string, unknown>)
          .transactionHash as string) ||
        "unknown",
      result: response.result,
    };
  }

  /**
   * Maneja errores del contrato
   */
  private handleError(error: unknown): string {
    if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;

      // Error del contrato
      if (
        errorObj.code &&
        PassportError[errorObj.code as keyof typeof PassportError]
      ) {
        return PassportError[errorObj.code as keyof typeof PassportError]
          .message;
      }

      // Error de red
      if (errorObj.message) {
        return String(errorObj.message);
      }

      // Error desconocido
      return "Error desconocido al interactuar con el contrato";
    }

    return String(error);
  }

  /**
   * Crea tipos de verificación predefinidos
   */
  static createVerificationType(
    type: "Over18" | "Twitter" | "GitHub" | "BrightID" | "WorldID" | "Custom",
    customValue?: string
  ): VerificationType {
    switch (type) {
      case "Over18":
        return { tag: "Over18", values: undefined };
      case "Twitter":
        return { tag: "Twitter", values: undefined };
      case "GitHub":
        return { tag: "GitHub", values: undefined };
      case "BrightID":
        return { tag: "BrightID", values: undefined };
      case "WorldID":
        return { tag: "WorldID", values: undefined };
      case "Custom":
        if (!customValue) {
          throw new Error("Custom verification type requires a custom value");
        }
        return { tag: "Custom", values: [customValue] };
      default:
        throw new Error(`Invalid verification type: ${type}`);
    }
  }

  /**
   * Obtiene la configuración actual del servicio
   */
  getConfig(): Required<StellarPassportConfig> {
    return { ...this.config };
  }

  /**
   * Actualiza la configuración del servicio
   */
  updateConfig(newConfig: Partial<StellarPassportConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Recrear el cliente si cambió la configuración de red
    if (
      newConfig.rpcUrl ||
      newConfig.networkPassphrase ||
      newConfig.contractId
    ) {
      this.client = new Client({
        contractId: this.config.contractId,
        networkPassphrase: this.config.networkPassphrase,
        rpcUrl: this.config.rpcUrl,
      });
    }
  }
}

/**
 * Instancia singleton del servicio
 */
export const stellarPassportService = new StellarPassportService();

/**
 * Factory para crear instancias del servicio con configuración personalizada
 */
export const createStellarPassportService = (
  config?: StellarPassportConfig
) => {
  return new StellarPassportService(config);
};
