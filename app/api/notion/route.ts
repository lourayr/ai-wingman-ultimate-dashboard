import { NextResponse } from "next/server";

// Env vars:
//   NOTION_TOKEN  — Internal Integration Token from notion.so/my-integrations
//
// Setup: create an integration at notion.so/my-integrations, then share each
// page/database with the integration (Share → Invite → select your integration).

interface NotionPage {
  id: string;
  object: string;
  last_edited_time: string;
  created_time: string;
  url: string;
  properties?: Record<string, {
    type: string;
    title?: Array<{ plain_text: string }>;
    rich_text?: Array<{ plain_text: string }>;
    checkbox?: boolean;
    date?: { start: string } | null;
    status?: { name: string };
    select?: { name: string } | null;
  }>;
  parent?: { type: string; page_id?: string; database_id?: string };
}

function getPageTitle(page: NotionPage): string {
  if (!page.properties) return "(Untitled)";
  for (const prop of Object.values(page.properties)) {
    if (prop.type === "title" && prop.title?.length) {
      return prop.title.map((t) => t.plain_text).join("") || "(Untitled)";
    }
  }
  return "(Untitled)";
}

function getPageStatus(page: NotionPage): string | null {
  if (!page.properties) return null;
  for (const prop of Object.values(page.properties)) {
    if (prop.type === "status" && prop.status?.name) return prop.status.name;
    if (prop.type === "select" && prop.select?.name) return prop.select.name;
    if (prop.type === "checkbox") return prop.checkbox ? "Done" : "Not done";
  }
  return null;
}

export async function GET() {
  const token = process.env.NOTION_TOKEN;

  if (!token) {
    return NextResponse.json({ connected: false, pages: [] });
  }

  try {
    // Search all pages the integration has access to, sorted by last edited
    const res = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sort: { direction: "descending", timestamp: "last_edited_time" },
        filter: { value: "page", property: "object" },
        page_size: 15,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ connected: false, error: `Notion API ${res.status}`, pages: [] });
    }

    const data = await res.json();
    const pages: NotionPage[] = data.results ?? [];

    const formatted = pages.slice(0, 12).map((p) => ({
      id: p.id,
      title: getPageTitle(p),
      status: getPageStatus(p),
      lastEdited: p.last_edited_time,
      created: p.created_time,
      url: p.url,
      parentType: p.parent?.type ?? "unknown",
    }));

    return NextResponse.json({
      connected: true,
      pages: formatted,
      total: pages.length,
    });
  } catch (error) {
    return NextResponse.json({ connected: false, error: String(error), pages: [] });
  }
}
