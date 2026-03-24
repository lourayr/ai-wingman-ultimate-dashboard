import { NextResponse } from "next/server";
import { googleFetch, getGoogleAccessToken } from "@/lib/google-fetch";

interface CalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
  htmlLink?: string;
}

interface CalendarListResponse {
  items?: CalendarEvent[];
}

export async function GET() {
  const token = await getGoogleAccessToken();
  if (!token) {
    return NextResponse.json({ connected: false, events: [] });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const res = await googleFetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay}&timeMax=${endOfDay}&singleEvents=true&orderBy=startTime&maxResults=10`
    );

    if (!res?.ok) {
      return NextResponse.json({ connected: false, events: [] });
    }

    const data = (await res.json()) as CalendarListResponse;
    const events = (data.items ?? []).map((e) => ({
      id: e.id,
      title: e.summary ?? "(No title)",
      start: e.start?.dateTime ?? e.start?.date ?? "",
      end: e.end?.dateTime ?? e.end?.date ?? "",
      location: e.location ?? "",
      description: e.description ?? "",
      link: e.htmlLink ?? "",
    }));

    return NextResponse.json({ connected: true, events });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json({ connected: false, events: [], error: String(error) });
  }
}
