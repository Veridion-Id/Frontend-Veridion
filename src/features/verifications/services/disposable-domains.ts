const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', '10minutemail.net', '20minutemail.com',
  'dispostable.com', 'fakeinbox.com', 'getnada.com', 'grr.la',
  'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.net',
  'guerrillamail.org', 'guerrillamail.de', 'guerrillamailblock.com',
  'mailinator.com', 'mailinator2.com', 'mailinator3.com',
  'maildrop.cc', 'mailnull.com', 'mailscrap.com',
  'sharklasers.com', 'spam4.me', 'spamgourmet.com',
  'tempmail.com', 'tempr.email', 'throwam.com',
  'trashmail.at', 'trashmail.com', 'trashmail.io',
  'trashmail.me', 'trashmail.net', 'trashmail.org',
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf',
  'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx',
  'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf',
  'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
  'spamgourmet.net', 'spamgourmet.org', 'spaml.com',
  'spamspot.com', 'spamthis.co.uk', 'spamtrap.ro',
  'filzmail.com', 'dea-mail.com', 'throwam.com',
  'burnermail.io', 'emailondeck.com', 'tempinbox.com',
  'guerrillamail.biz', 'amilegit.com', 'anonbox.net',
  'antichef.com', 'antichef.net', 'antireg.com',
  'antispam.de', 'armyspy.com', 'baxomale.ht.cx',
  'beefmilk.com', 'binkmail.com', 'bio-muesli.net',
]);

export function isDisposableDomain(domain: string): boolean {
  return DISPOSABLE_DOMAINS.has(domain.toLowerCase());
}

export function isDisposableEmail(email: string): boolean {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  return isDisposableDomain(parts[1]);
}
