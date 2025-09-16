import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import {
  stellarPassportService,
  RegisterUserParams,
} from "./stellar-passport.service";
import { Keypair } from "@stellar/stellar-sdk";

/**
 * Estructura del usuario en Firebase
 */
export interface FirebaseUser {
  id: string;
  wallet: string;
  name: string;
  surnames: string;
  email?: string;
  avatar?: string;
  createdAt: unknown; // Firebase Timestamp
  updatedAt: unknown; // Firebase Timestamp
  stellarRegistered: boolean;
  stellarScore?: number;
  verifications?: unknown[];
  metadata?: {
    walletType?: string;
    lastLogin?: unknown;
    loginCount?: number;
  };
}

/**
 * Parámetros para registro de usuario
 */
export interface UserRegistrationParams {
  wallet: string;
  name: string;
  surnames: string;
  email?: string;
  avatar?: string;
  walletType?: string;
}

/**
 * Resultado de operaciones del servicio
 */
export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Servicio de gestión de usuarios con Firebase y Stellar
 */
export class FirebaseUserService {
  private readonly COLLECTION_NAME = "users";

  /**
   * Verifica si un usuario existe en Firebase por wallet
   */
  async checkUserExists(wallet: string): Promise<ServiceResult<boolean>> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, wallet);
      const userSnap = await getDoc(userRef);

      return {
        success: true,
        data: userSnap.exists(),
      };
    } catch (error) {
      const errorMessage = this.handleError(error);

      // Check if it's a permissions error
      if (
        errorMessage.includes("permissions") ||
        errorMessage.includes("PERMISSION_DENIED")
      ) {
        return {
          success: false,
          error:
            "Firebase permissions error. Please configure Firestore rules. See FIREBASE_SETUP.md for instructions.",
          code: "FIREBASE_PERMISSIONS_ERROR",
        };
      }

      return {
        success: false,
        error: errorMessage,
        code: "CHECK_USER_ERROR",
      };
    }
  }

  /**
   * Obtiene un usuario por wallet
   */
  async getUserByWallet(
    wallet: string
  ): Promise<ServiceResult<FirebaseUser | null>> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, wallet);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return {
          success: true,
          data: null,
        };
      }

      const userData = userSnap.data() as FirebaseUser;
      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "GET_USER_ERROR",
      };
    }
  }

  /**
   * Registra un nuevo usuario en Firebase y Stellar
   */
  async registerUser(
    params: UserRegistrationParams,
    signer: Keypair | null
  ): Promise<ServiceResult<FirebaseUser>> {
    try {
      // 1. Verificar que el usuario no exista
      const existsResult = await this.checkUserExists(params.wallet);
      if (!existsResult.success) {
        return {
          success: false,
          error: existsResult.error,
          code: "CHECK_USER_ERROR",
        };
      }

      if (existsResult.data) {
        return {
          success: false,
          error: "Usuario ya existe",
          code: "USER_ALREADY_EXISTS",
        };
      }

      // 2. Registrar en Stellar Passport (solo si hay signer)
      let stellarResult: {
        success: boolean;
        transactionHash?: string;
        error?: string;
      } = { success: true };

      if (signer) {
        const stellarParams: RegisterUserParams = {
          wallet: params.wallet,
          name: params.name,
          surnames: params.surnames,
        };

        stellarResult = await stellarPassportService.registerUser(
          stellarParams,
          signer
        );
        if (!stellarResult.success) {
          return {
            success: false,
            error: `Error en Stellar: ${stellarResult.error}`,
            code: "STELLAR_REGISTRATION_ERROR",
          };
        }
      }

      // 3. Crear usuario en Firebase
      const userData: FirebaseUser = {
        id: params.wallet,
        wallet: params.wallet,
        name: params.name,
        surnames: params.surnames,
        email: params.email,
        avatar: params.avatar,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        stellarRegistered: !!signer,
        stellarScore: 0,
        verifications: [],
        metadata: {
          walletType: params.walletType,
          lastLogin: serverTimestamp(),
          loginCount: 1,
        },
      };

      const userRef = doc(db, this.COLLECTION_NAME, params.wallet);
      await setDoc(userRef, userData);

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "REGISTRATION_ERROR",
      };
    }
  }

  /**
   * Actualiza el perfil de un usuario
   */
  async updateUserProfile(
    wallet: string,
    updates: Partial<
      Pick<FirebaseUser, "name" | "surnames" | "email" | "avatar">
    >,
    signer?: Keypair
  ): Promise<ServiceResult<FirebaseUser>> {
    try {
      // 1. Actualizar en Firebase
      const userRef = doc(db, this.COLLECTION_NAME, wallet);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);

      // 2. Si se proporciona signer, actualizar también en Stellar
      if (signer && (updates.name || updates.surnames)) {
        const userResult = await this.getUserByWallet(wallet);
        if (userResult.success && userResult.data) {
          const stellarParams = {
            wallet,
            name: updates.name || userResult.data.name,
            surnames: updates.surnames || userResult.data.surnames,
          };

          await stellarPassportService.updateProfile(stellarParams, signer);
        }
      }

      // 3. Obtener datos actualizados
      const updatedUserResult = await this.getUserByWallet(wallet);
      return {
        success: true,
        data: updatedUserResult.data!,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "UPDATE_PROFILE_ERROR",
      };
    }
  }

  /**
   * Actualiza el score de Stellar del usuario
   */
  async updateStellarScore(wallet: string): Promise<ServiceResult<number>> {
    try {
      const scoreResult = await stellarPassportService.getUserScore(wallet);
      if (!scoreResult.success) {
        return {
          success: false,
          error: scoreResult.error,
          code: "GET_SCORE_ERROR",
        };
      }

      // Actualizar en Firebase
      const userRef = doc(db, this.COLLECTION_NAME, wallet);
      await updateDoc(userRef, {
        stellarScore: scoreResult.data,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        data: scoreResult.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "UPDATE_SCORE_ERROR",
      };
    }
  }

  /**
   * Actualiza las verificaciones del usuario
   */
  async updateUserVerifications(
    wallet: string
  ): Promise<ServiceResult<unknown[]>> {
    try {
      const verificationsResult =
        await stellarPassportService.getUserVerifications(wallet);
      if (!verificationsResult.success) {
        return {
          success: false,
          error: verificationsResult.error,
          code: "GET_VERIFICATIONS_ERROR",
        };
      }

      // Actualizar en Firebase
      const userRef = doc(db, this.COLLECTION_NAME, wallet);
      await updateDoc(userRef, {
        verifications: verificationsResult.data,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        data: verificationsResult.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "UPDATE_VERIFICATIONS_ERROR",
      };
    }
  }

  /**
   * Actualiza la información de login del usuario
   */
  async updateLoginInfo(wallet: string): Promise<ServiceResult<void>> {
    try {
      const userResult = await this.getUserByWallet(wallet);
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: "Usuario no encontrado",
          code: "USER_NOT_FOUND",
        };
      }

      const currentLoginCount = userResult.data.metadata?.loginCount || 0;

      const userRef = doc(db, this.COLLECTION_NAME, wallet);
      await updateDoc(userRef, {
        "metadata.lastLogin": serverTimestamp(),
        "metadata.loginCount": currentLoginCount + 1,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "UPDATE_LOGIN_ERROR",
      };
    }
  }

  /**
   * Obtiene información completa del usuario (Firebase + Stellar)
   */
  async getUserCompleteInfo(wallet: string): Promise<
    ServiceResult<{
      firebase: FirebaseUser;
      stellar: {
        score: number;
        verifications: unknown[];
      };
    }>
  > {
    try {
      // Obtener datos de Firebase
      const firebaseResult = await this.getUserByWallet(wallet);
      if (!firebaseResult.success || !firebaseResult.data) {
        return {
          success: false,
          error: "Usuario no encontrado en Firebase",
          code: "USER_NOT_FOUND",
        };
      }

      // Obtener datos de Stellar
      const stellarResult = await stellarPassportService.getUserInfo(wallet);
      if (!stellarResult.success) {
        return {
          success: false,
          error: `Error obteniendo datos de Stellar: ${stellarResult.error}`,
          code: "STELLAR_DATA_ERROR",
        };
      }

      return {
        success: true,
        data: {
          firebase: firebaseResult.data,
          stellar: stellarResult.data!,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "GET_COMPLETE_INFO_ERROR",
      };
    }
  }

  /**
   * Busca usuarios por nombre o email
   */
  async searchUsers(
    searchTerm: string
  ): Promise<ServiceResult<FirebaseUser[]>> {
    try {
      const usersRef = collection(db, this.COLLECTION_NAME);

      // Buscar por nombre
      const nameQuery = query(
        usersRef,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );

      // Buscar por apellidos
      const surnamesQuery = query(
        usersRef,
        where("surnames", ">=", searchTerm),
        where("surnames", "<=", searchTerm + "\uf8ff")
      );

      const [nameResults, surnamesResults] = await Promise.all([
        getDocs(nameQuery),
        getDocs(surnamesQuery),
      ]);

      const users = new Map<string, FirebaseUser>();

      // Agregar resultados de búsqueda por nombre
      nameResults.forEach((doc) => {
        users.set(doc.id, doc.data() as unknown as FirebaseUser);
      });

      // Agregar resultados de búsqueda por apellidos
      surnamesResults.forEach((doc) => {
        users.set(doc.id, doc.data() as unknown as FirebaseUser);
      });

      return {
        success: true,
        data: Array.from(users.values()),
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
        code: "SEARCH_USERS_ERROR",
      };
    }
  }

  /**
   * Maneja errores del servicio
   */
  private handleError(error: unknown): string {
    if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;

      if (errorObj.message) {
        return String(errorObj.message);
      }

      if (errorObj.code) {
        return `Firebase error: ${errorObj.code}`;
      }
    }

    return "Error desconocido en el servicio de usuarios";
  }
}

/**
 * Instancia singleton del servicio
 */
export const firebaseUserService = new FirebaseUserService();

/**
 * Factory para crear instancias del servicio
 */
export const createFirebaseUserService = () => {
  return new FirebaseUserService();
};
