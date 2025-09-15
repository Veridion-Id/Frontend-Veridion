interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export function decodeGoogleJWT(credential: string): GoogleUser {
  try {
    // Decode the JWT payload
    const payload = JSON.parse(atob(credential.split('.')[1]));
    return payload;
  } catch (error) {
    throw new Error('Failed to decode Google JWT');
  }
}

export function initializeGoogleAuth(clientId: string, callback: (response: { credential: string }) => void) {
  if (typeof window === 'undefined' || !window.google) {
    throw new Error('Google Identity Services not loaded');
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: callback,
  });
}

export function renderGoogleButton(element: HTMLElement, config: {
  theme: string;
  size: string;
  text: string;
  width: string;
  locale?: string;
}) {
  if (typeof window === 'undefined' || !window.google) {
    throw new Error('Google Identity Services not loaded');
  }

  window.google.accounts.id.renderButton(element, config);
}
