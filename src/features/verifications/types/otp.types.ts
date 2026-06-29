export type OtpStep = 'input' | 'code' | 'done';

export type OtpVerifyResult = 'ok' | 'expired' | 'invalid' | 'too-many-attempts';

export type ContactChannel = 'phone' | 'email';

export interface OtpFlowState {
  step: OtpStep;
  loading: boolean;
  error: string;
  cooldown: number;
}

export interface OtpSendPayload {
  action: 'send';
  wallet?: string;
  phone?: string;
  email?: string;
}

export interface OtpVerifyPayload {
  action: 'verify';
  code: string;
  wallet?: string;
  phone?: string;
  email?: string;
}

export type OtpPayload = OtpSendPayload | OtpVerifyPayload;

export interface OtpApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export interface RateLimitEntry {
  count: number;
  windowStart: number;
}

export interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}
