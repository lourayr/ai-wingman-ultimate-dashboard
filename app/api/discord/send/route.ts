import { NextRequest, NextResponse } from "next/server";

// POST a message to a Discord channel via the bot token.
// Body: { channelId: string; content: string }
// Env: DISCORD_BOT_TOKEN

const DISCORD_API = "https://discord.com/api/v10";
const MAX_CHARS = 1900; // Discord limit is 2000; leave headroom

export async function POST(request: NextRequest) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "DISCORD_BOT_TOKEN not set" }, { status: 500 });
  }

  const { channelId, content } = await request.json();
  if (!channelId || !content) {
    return NextResponse.json({ ok: false, error: "Required: channelId, content" }, { status: 400 });
  }

  // Split into chunks if over Discord limit
  const chunks: string[] = [];
  let remaining = String(content);
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, MAX_CHARS));
    remaining = remaining.slice(MAX_CHARS);
  }

  try {
    const results = [];
    for (const chunk of chunks) {
      const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: chunk }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ ok: false, error: `Discord ${res.status}: ${err.slice(0, 200)}` }, { status: res.status });
      }
      const d = await res.json();
      results.push(d.id);
    }
    return NextResponse.json({ ok: true, messageIds: results });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
