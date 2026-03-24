import { NextResponse } from "next/server";

// Env vars required:
//   DISCORD_BOT_TOKEN   — Bot token from discord.com/developers
//   DISCORD_CHANNEL_IDS — Comma-separated channel IDs to monitor

interface DiscordMessage {
  id: string;
  content: string;
  author: { username: string; bot?: boolean };
  timestamp: string;
}

interface DiscordChannel {
  id: string;
  name?: string;
  topic?: string;
}

export async function GET() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelIds = (process.env.DISCORD_CHANNEL_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token || channelIds.length === 0) {
    return NextResponse.json({ connected: false, channels: [] });
  }

  try {
    const channels = await Promise.all(
      channelIds.slice(0, 4).map(async (channelId) => {
        // Fetch channel metadata
        const chanRes = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
          headers: { Authorization: `Bot ${token}` },
        });
        const chanData: DiscordChannel = chanRes.ok ? await chanRes.json() : { id: channelId };

        // Fetch recent messages
        const msgRes = await fetch(
          `https://discord.com/api/v10/channels/${channelId}/messages?limit=8`,
          { headers: { Authorization: `Bot ${token}` } }
        );

        if (!msgRes.ok) return null;

        const messages: DiscordMessage[] = await msgRes.json();

        return {
          id: channelId,
          name: chanData.name ?? `Channel ${channelId}`,
          topic: chanData.topic ?? "",
          messages: messages
            .filter((m) => m.content?.trim())
            .slice(0, 5)
            .map((m) => ({
              id: m.id,
              content: m.content.slice(0, 300),
              author: m.author.username,
              isBot: m.author.bot ?? false,
              timestamp: m.timestamp,
            })),
        };
      })
    );

    const validChannels = channels.filter(Boolean);
    return NextResponse.json({ connected: true, channels: validChannels });
  } catch (error) {
    return NextResponse.json({ connected: false, error: String(error), channels: [] });
  }
}
