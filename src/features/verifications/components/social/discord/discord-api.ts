interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
  verified?: boolean;
  public_flags?: number;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = 'http://localhost:3000/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Discord OAuth not configured');
  }

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to exchange code for token: ${errorData}`);
  }

  const data: DiscordTokenResponse = await response.json();
  return data.access_token;
}

export async function getUserData(accessToken: string): Promise<DiscordUser> {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user information');
  }

  const user: DiscordUser = await response.json();
  return user;
}

export async function authenticateWithDiscord(code: string): Promise<DiscordUser> {
  const accessToken = await exchangeCodeForToken(code);
  const user = await getUserData(accessToken);
  return user;
}
