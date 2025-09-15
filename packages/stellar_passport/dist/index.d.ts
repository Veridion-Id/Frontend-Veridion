import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from '@stellar/stellar-sdk/contract';
import type { u32, i32, u64 } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CAWLDMLCOUPD4OSXQF3WHMTCXW6MS3QNYNFFCTXT2J3VLDH7AUECDDB3";
    };
};
export declare const PassportError: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
    5: {
        message: string;
    };
    6: {
        message: string;
    };
};
/**
 * Tipos de verificación soportados.
 * `Custom(Symbol)` permite extensiones (p.ej. "over18_cr", "kyc_sumsub").
 */
export type VerificationType = {
    tag: "Over18";
    values: void;
} | {
    tag: "Twitter";
    values: void;
} | {
    tag: "GitHub";
    values: void;
} | {
    tag: "BrightID";
    values: void;
} | {
    tag: "WorldID";
    values: void;
} | {
    tag: "Custom";
    values: readonly [string];
};
/**
 * Una verificación concreta aplicada a un usuario.
 */
export interface Verification {
    issuer: string;
    points: i32;
    timestamp: u64;
    vtype: VerificationType;
}
/**
 * Datos agregados del usuario.
 * `name` / `surnames` son opcionales a nivel de producto (pueden quedar vacíos para privacidad).
 */
export interface User {
    name: string;
    score: i32;
    surnames: string;
    ver_count: u32;
    wallet: string;
}
/**
 * Claves de almacenamiento del contrato.
 */
export type DataKey = {
    tag: "User";
    values: readonly [string];
} | {
    tag: "Verifications";
    values: readonly [string];
};
/**
 * Eventos de negocio (útiles para indexadores y backends).
 */
export type Event = {
    tag: "UserRegistered";
    values: readonly [string];
} | {
    tag: "VerificationUpserted";
    values: readonly [string, VerificationType, i32, i32, i32];
};
export interface Client {
    /**
     * Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    version: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a register transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    register: ({ wallet, name, surnames }: {
        wallet: string;
        name: string;
        surnames: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_score transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_score: ({ wallet }: {
        wallet: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<i32>>;
    /**
     * Construct and simulate a get_verifications transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_verifications: ({ wallet }: {
        wallet: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Array<Verification>>>;
    /**
     * Construct and simulate a upsert_verification transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    upsert_verification: ({ wallet, vtype, points }: {
        wallet: string;
        vtype: VerificationType;
        points: i32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<i32>>;
    /**
     * Construct and simulate a update_profile transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    update_profile: ({ wallet, name, surnames }: {
        wallet: string;
        name: string;
        surnames: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        version: (json: string) => AssembledTransaction<number>;
        register: (json: string) => AssembledTransaction<null>;
        get_score: (json: string) => AssembledTransaction<number>;
        get_verifications: (json: string) => AssembledTransaction<Verification[]>;
        upsert_verification: (json: string) => AssembledTransaction<number>;
        update_profile: (json: string) => AssembledTransaction<null>;
    };
}
