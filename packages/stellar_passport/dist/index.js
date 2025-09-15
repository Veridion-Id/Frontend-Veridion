import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CAWLDMLCOUPD4OSXQF3WHMTCXW6MS3QNYNFFCTXT2J3VLDH7AUECDDB3",
    }
};
export const PassportError = {
    1: { message: "AlreadyRegistered" },
    2: { message: "NotRegistered" },
    3: { message: "Unauthorized" },
    4: { message: "InvalidPoints" },
    5: { message: "Overflow" },
    6: { message: "TooManyVerifications" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAADVBhc3Nwb3J0RXJyb3IAAAAAAAAGAAAAAAAAABFBbHJlYWR5UmVnaXN0ZXJlZAAAAAAAAAEAAAAAAAAADU5vdFJlZ2lzdGVyZWQAAAAAAAACAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAADAAAAAAAAAA1JbnZhbGlkUG9pbnRzAAAAAAAABAAAAAAAAAAIT3ZlcmZsb3cAAAAFAAAAAAAAABRUb29NYW55VmVyaWZpY2F0aW9ucwAAAAY=",
            "AAAAAgAAAGpUaXBvcyBkZSB2ZXJpZmljYWNpw7NuIHNvcG9ydGFkb3MuCmBDdXN0b20oU3ltYm9sKWAgcGVybWl0ZSBleHRlbnNpb25lcyAocC5lai4gIm92ZXIxOF9jciIsICJreWNfc3Vtc3ViIikuAAAAAAAAAAAAEFZlcmlmaWNhdGlvblR5cGUAAAAGAAAAAAAAAAAAAAAGT3ZlcjE4AAAAAAAAAAAAAAAAAAdUd2l0dGVyAAAAAAAAAAAAAAAABkdpdEh1YgAAAAAAAAAAAAAAAAAIQnJpZ2h0SUQAAAAAAAAAAAAAAAdXb3JsZElEAAAAAAEAAAAAAAAABkN1c3RvbQAAAAAAAQAAABE=",
            "AAAAAQAAADFVbmEgdmVyaWZpY2FjacOzbiBjb25jcmV0YSBhcGxpY2FkYSBhIHVuIHVzdWFyaW8uAAAAAAAAAAAAAAxWZXJpZmljYXRpb24AAAAEAAAAAAAAAAZpc3N1ZXIAAAAAABMAAAAAAAAABnBvaW50cwAAAAAABQAAAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAAAAAAAAFdnR5cGUAAAAAAAfQAAAAEFZlcmlmaWNhdGlvblR5cGU=",
            "AAAAAQAAAHxEYXRvcyBhZ3JlZ2Fkb3MgZGVsIHVzdWFyaW8uCmBuYW1lYCAvIGBzdXJuYW1lc2Agc29uIG9wY2lvbmFsZXMgYSBuaXZlbCBkZSBwcm9kdWN0byAocHVlZGVuIHF1ZWRhciB2YWPDrW9zIHBhcmEgcHJpdmFjaWRhZCkuAAAAAAAAAARVc2VyAAAABQAAAAAAAAAEbmFtZQAAABAAAAAAAAAABXNjb3JlAAAAAAAABQAAAAAAAAAIc3VybmFtZXMAAAAQAAAAAAAAAAl2ZXJfY291bnQAAAAAAAAEAAAAAAAAAAZ3YWxsZXQAAAAAABM=",
            "AAAAAgAAACZDbGF2ZXMgZGUgYWxtYWNlbmFtaWVudG8gZGVsIGNvbnRyYXRvLgAAAAAAAAAAAAdEYXRhS2V5AAAAAAIAAAABAAAAAAAAAARVc2VyAAAAAQAAABMAAAABAAAAAAAAAA1WZXJpZmljYXRpb25zAAAAAAAAAQAAABM=",
            "AAAAAgAAADlFdmVudG9zIGRlIG5lZ29jaW8gKMO6dGlsZXMgcGFyYSBpbmRleGFkb3JlcyB5IGJhY2tlbmRzKS4AAAAAAAAAAAAABUV2ZW50AAAAAAAAAgAAAAEAAAAAAAAADlVzZXJSZWdpc3RlcmVkAAAAAAABAAAAEwAAAAEAAAAAAAAAFFZlcmlmaWNhdGlvblVwc2VydGVkAAAABQAAABMAAAfQAAAAEFZlcmlmaWNhdGlvblR5cGUAAAAFAAAABQAAAAU=",
            "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAIcmVnaXN0ZXIAAAADAAAAAAAAAAZ3YWxsZXQAAAAAABMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAhzdXJuYW1lcwAAABAAAAAA",
            "AAAAAAAAAAAAAAAJZ2V0X3Njb3JlAAAAAAAAAQAAAAAAAAAGd2FsbGV0AAAAAAATAAAAAQAAAAU=",
            "AAAAAAAAAAAAAAARZ2V0X3ZlcmlmaWNhdGlvbnMAAAAAAAABAAAAAAAAAAZ3YWxsZXQAAAAAABMAAAABAAAD6gAAB9AAAAAMVmVyaWZpY2F0aW9u",
            "AAAAAAAAAAAAAAATdXBzZXJ0X3ZlcmlmaWNhdGlvbgAAAAADAAAAAAAAAAZ3YWxsZXQAAAAAABMAAAAAAAAABXZ0eXBlAAAAAAAH0AAAABBWZXJpZmljYXRpb25UeXBlAAAAAAAAAAZwb2ludHMAAAAAAAUAAAABAAAABQ==",
            "AAAAAAAAAAAAAAAOdXBkYXRlX3Byb2ZpbGUAAAAAAAMAAAAAAAAABndhbGxldAAAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAAAAAACHN1cm5hbWVzAAAAEAAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        version: (this.txFromJSON),
        register: (this.txFromJSON),
        get_score: (this.txFromJSON),
        get_verifications: (this.txFromJSON),
        upsert_verification: (this.txFromJSON),
        update_profile: (this.txFromJSON)
    };
}
