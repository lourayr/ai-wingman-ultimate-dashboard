import { NextResponse } from "next/server";
import { googleFetch, getGoogleAccessToken } from "@/lib/google-fetch";

interface MimePart {
  mimeType: string;
  body?: { data?: string };
  parts?: MimePart[];
}

interface GmailMessage {
  id: string;
  snippet: string;
  payload?: MimePart & {
    headers?: Array<{ name: string; value: string }>;
  };
}

interface GmailListResponse {
  messages?: Array<{ id: string; threadId: string }>;
}

function decodeBase64(data: string): string {
  try {
    return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  } catch {
    return "";
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Recursively walk the full MIME tree and collect all leaf parts
function extractParts(part: MimePart): MimePart[] {
  if (part.mimeType.startsWith("multipart/")) {
    return (part.parts ?? []).flatMap(extractParts);
  }
  return [part];
}

function getBody(msg: GmailMessage): string {
  const payload = msg.payload;
  if (!payload) return msg.snippet ?? "";

  const allParts = extractParts(payload);

  // Prefer plain text
  for (const part of allParts) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      return decodeBase64(part.body.data).trim();
    }
  }

  // Fall back to HTML — strip tags before returning
  for (const part of allParts) {
    if (part.mimeType === "text/html" && part.body?.data) {
      return stripHtml(decodeBase64(part.body.data));
    }
  }

  // Last resort: if payload itself has body data (non-multipart top-level)
  if (payload.body?.data) {
    const raw = decodeBase64(payload.body.data);
    return payload.mimeType === "text/html" ? stripHtml(raw) : raw.trim();
  }

  return msg.snippet ?? "";
}

function getHeader(msg: GmailMessage, name: string): string {
  return (
    msg.payload?.headers?.find(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    )?.value ?? ""
  );
}

export async function GET() {
  const token = await getGoogleAccessToken();

  if (!token) {
    return NextResponse.json({ connected: false });
  }

  try {
    // Get user email
    const profileRes = await googleFetch(
      "https://www.googleapis.com/gmail/v1/users/me/profile"
    );
    const profile = profileRes ? await profileRes.json() : {};
    const email = profile.emailAddress ?? "";

    // Gemini Weekly Summary
    let geminiSummary = null;
    const geminiRes = await googleFetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent('subject:"Weekly Email Summary"')}&maxResults=1`
    );
    if (geminiRes?.ok) {
      const geminiList = (await geminiRes.json()) as GmailListResponse;
      if (geminiList.messages?.length) {
        const msgRes = await googleFetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${geminiList.messages[0].id}?format=full`
        );
        if (msgRes?.ok) {
          const msg = (await msgRes.json()) as GmailMessage;
          const body = getBody(msg);
          geminiSummary = {
            subject: getHeader(msg, "Subject"),
            date: getHeader(msg, "Date"),
            body: body.slice(0, 2500),
            snippet: msg.snippet ?? "",
          };
        }
      }
    }

    // Calendar daily notification
    let calendarSummary = null;
    const calRes = await googleFetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent("from:calendar-notification@google.com")}&maxResults=1`
    );
    if (calRes?.ok) {
      const calList = (await calRes.json()) as GmailListResponse;
      if (calList.messages?.length) {
        const msgRes = await googleFetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${calList.messages[0].id}?format=full`
        );
        if (msgRes?.ok) {
          const msg = (await msgRes.json()) as GmailMessage;
          calendarSummary = {
            date: getHeader(msg, "Date"),
            body: getBody(msg).slice(0, 1000),
            snippet: msg.snippet ?? "",
          };
        }
      }
    }

    // Important unread emails
    const importantQuery = encodeURIComponent(
      "is:important is:unread -category:promotions -category:social -category:updates -from:calendar-notification@google.com -subject:\"Weekly Email Summary\""
    );
    const importantRes = await googleFetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${importantQuery}&maxResults=8`
    );
    const importantMessages: Array<{
      id: string;
      subject: string;
      from: string;
      date: string;
      snippet: string;
    }> = [];
    if (importantRes?.ok) {
      const list = (await importantRes.json()) as GmailListResponse;
      for (const item of list.messages ?? []) {
        const msgRes = await googleFetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`
        );
        if (msgRes?.ok) {
          const msg = (await msgRes.json()) as GmailMessage;
          importantMessages.push({
            id: item.id,
            subject: getHeader(msg, "Subject"),
            from: getHeader(msg, "From"),
            date: getHeader(msg, "Date"),
            snippet: msg.snippet ?? "",
          });
        }
      }
    }

    // Order count
    const ordersRes = await googleFetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent('is:unread (subject:"New order" OR subject:"You have a new order" OR from:woocommerce)')}&maxResults=5`
    );
    let orderCount = 0;
    if (ordersRes?.ok) {
      const orderList = (await ordersRes.json()) as GmailListResponse;
      orderCount = orderList.messages?.length ?? 0;
    }

    return NextResponse.json({
      connected: true,
      email,
      importantCount: importantMessages.length,
      orderCount,
      geminiSummary,
      calendarSummary,
      importantMessages,
    });
  } catch (error) {
    console.error("Gmail API error:", error);
    return NextResponse.json({ connected: false, error: String(error) });
  }
}
