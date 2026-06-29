export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  const masked = '*'.repeat(Math.max(1, local.length - 2));
  return `${visible}${masked}@${domain}`;
}

export function getDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? '';
}
