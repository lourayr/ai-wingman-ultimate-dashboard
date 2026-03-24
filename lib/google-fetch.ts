import sql from "./db";
import { refreshAccessToken } from "./google-auth";

const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export async function getGoogleAccessToken(
  userId = "ray"
): Promise<string | null> {
  try {
    const rows = await sql`
      SELECT access_token, refresh_token, expires_at
      FROM user_tokens
      WHERE user_id = ${userId} AND service = 'google'
      LIMIT 1
    `;
    if (!rows.length) return null;

    const row = rows[0];
    const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
    const now = Date.now();

    if (expiresAt - now < REFRESH_THRESHOLD_MS && row.refresh_token) {
      // Refresh the token
      const refreshed = await refreshAccessToken(row.refresh_token);
      const newExpiresAt = new Date(now + refreshed.expires_in * 1000);
      await sql`
        UPDATE user_tokens
        SET access_token = ${refreshed.access_token},
            expires_at = ${newExpiresAt.toISOString()},
            updated_at = now()
        WHERE user_id = ${userId} AND service = 'google'
      `;
      return refreshed.access_token;
    }

    return row.access_token;
  } catch {
    return null;
  }
}

export async function googleFetch(
  url: string,
  userId = "ray"
): Promise<Response | null> {
  const token = await getGoogleAccessToken(userId);
  if (!token) return null;

  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
