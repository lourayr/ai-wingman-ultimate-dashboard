import { NextResponse } from "next/server";

// Env vars:
//   SLACK_BOT_TOKEN    — xoxb-... from api.slack.com/apps → OAuth & Permissions
//   SLACK_CHANNEL_IDS  — comma-separated channel IDs (C0XXXXXXX format)
//
// Required OAuth scopes: channels:history, channels:read, groups:history, groups:read, im:history
// Note: Free Slack only exposes messages from the last 90 days — that's fine for demo.

interface SlackMessage {
  ts: string;
  text: string;
  user?: string;
  username?: string;
  bot_id?: string;
  subtype?: string;
}

interface SlackChannel {
  id: string;
  name?: string;
  is_private?: boolean;
  topic?: { value: string };
  purpose?: { value: string };
}

async function slackFetch(path: string, token: string) {
  const res = await fetch(`https://slack.com/api/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function GET() {
  const token = process.env.SLACK_BOT_TOKEN;
  const channelIds = (process.env.SLACK_CHANNEL_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token) {
    return NextResponse.json({ connected: false, channels: [] });
  }

  try {
    // If no channel IDs specified, fetch the workspace channel list
    let targetChannels = channelIds;
    if (targetChannels.length === 0) {
      const listData = await slackFetch(
        "conversations.list?exclude_archived=true&limit=10&types=public_channel,private_channel",
        token
      );
      if (listData.ok) {
        targetChannels = (listData.channels as SlackChannel[])
          .slice(0, 5)
          .map((c) => c.id);
      }
    }

    const channels = await Promise.all(
      targetChannels.slice(0, 5).map(async (channelId) => {
        // Channel info
        const info = await slackFetch(`conversations.info?channel=${channelId}`, token);
        const ch: SlackChannel = info.channel ?? { id: channelId };

        // Recent messages
        const hist = await slackFetch(
          `conversations.history?channel=${channelId}&limit=8`,
          token
        );

        if (!hist.ok) return null;

        const messages = (hist.messages as SlackMessage[])
          .filter((m) => m.text?.trim() && !m.subtype)
          .slice(0, 5)
          .map((m) => ({
            text: m.text.slice(0, 300),
            isBot: !!m.bot_id,
            ts: m.ts,
            // Convert Slack timestamp to readable date
            date: new Date(parseFloat(m.ts) * 1000).toLocaleDateString(),
            time: new Date(parseFloat(m.ts) * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

        return {
          id: channelId,
          name: ch.name ?? channelId,
          isPrivate: ch.is_private ?? false,
          topic: ch.topic?.value ?? ch.purpose?.value ?? "",
          messages,
          lastActivity: messages[0]?.date ?? "No recent messages",
        };
      })
    );

    const validChannels = channels.filter(Boolean);
    return NextResponse.json({ connected: true, channels: validChannels });
  } catch (error) {
    return NextResponse.json({ connected: false, error: String(error), channels: [] });
  }
}
