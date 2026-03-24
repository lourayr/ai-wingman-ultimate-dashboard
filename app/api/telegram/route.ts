import { NextResponse } from "next/server";

// Env vars:
//   TELEGRAM_BOT_TOKEN  — from @BotFather: /newbot → copy the token
//   TELEGRAM_CHAT_IDS   — comma-separated chat/group/channel IDs
//
// Setup:
//   1. Open @BotFather in Telegram → /newbot → name your bot → copy token
//   2. Add bot to your group/channel as admin (for channels: admin with Read posts)
//   3. Get chat ID: message the bot, then visit:
//      https://api.telegram.org/bot{TOKEN}/getUpdates
//      Find "chat":{"id":-1001234567890} in the response
//   4. Add to Vercel: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_IDS (comma-separated)

interface TelegramMessage {
  message_id: number;
  text?: string;
  caption?: string;
  from?: { first_name?: string; username?: string; is_bot?: boolean };
  chat: { id: number; title?: string; type: string };
  date: number;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  channel_post?: TelegramMessage;
}

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token) {
    return NextResponse.json({ connected: false, chats: [] });
  }

  try {
    // getUpdates returns the last batch of messages sent to the bot / in groups
    // Works for groups and channels where bot is admin
    const updatesRes = await fetch(
      `https://api.telegram.org/bot${token}/getUpdates?limit=50&allowed_updates=["message","channel_post"]`,
      { next: { revalidate: 0 } }
    );

    if (!updatesRes.ok) {
      return NextResponse.json({ connected: false, error: `Telegram ${updatesRes.status}`, chats: [] });
    }

    const data = await updatesRes.json();
    if (!data.ok) {
      return NextResponse.json({ connected: false, error: data.description, chats: [] });
    }

    const updates: TelegramUpdate[] = data.result ?? [];

    // Group messages by chat
    const chatMap = new Map<number, { title: string; type: string; messages: typeof messages }>();
    const messages: Array<{
      id: number;
      text: string;
      sender: string;
      isBot: boolean;
      date: string;
      time: string;
    }> = [];

    for (const update of updates) {
      const msg = update.message ?? update.channel_post;
      if (!msg) continue;
      const text = msg.text ?? msg.caption ?? "";
      if (!text.trim()) continue;

      // Filter by configured chat IDs if specified
      if (chatIds.length > 0 && !chatIds.includes(String(msg.chat.id))) continue;

      const chatId = msg.chat.id;
      if (!chatMap.has(chatId)) {
        chatMap.set(chatId, {
          title: msg.chat.title ?? `Chat ${chatId}`,
          type: msg.chat.type,
          messages: [],
        });
      }

      const d = new Date(msg.date * 1000);
      chatMap.get(chatId)!.messages.push({
        id: msg.message_id,
        text: text.slice(0, 300),
        sender: msg.from?.first_name ?? msg.from?.username ?? "Unknown",
        isBot: msg.from?.is_bot ?? false,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    // Convert map to array, limit messages per chat
    const chats = Array.from(chatMap.entries()).map(([id, chat]) => ({
      id,
      title: chat.title,
      type: chat.type,
      messages: chat.messages.slice(-5).reverse(), // most recent first
    }));

    return NextResponse.json({ connected: true, chats });
  } catch (error) {
    return NextResponse.json({ connected: false, error: String(error), chats: [] });
  }
}
