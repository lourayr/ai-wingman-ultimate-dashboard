import { NextResponse } from "next/server";

// Env vars:
//   ASANA_TOKEN          — Personal Access Token from app.asana.com/0/my-apps
//   ASANA_WORKSPACE_GID  — Workspace GID (get from /api/1.0/workspaces after auth)
//
// Shows tasks even from 2024 — useful for demo to show "here's what's been sitting open"
// and the AI can flag them as backlog risk.

interface AsanaTask {
  gid: string;
  name: string;
  completed: boolean;
  completed_at: string | null;
  due_on: string | null;
  modified_at: string;
  projects: Array<{ gid: string; name: string }>;
  assignee_status?: string;
  notes?: string;
}

interface AsanaProject {
  gid: string;
  name: string;
  completed: boolean;
  modified_at: string;
  current_status?: { text: string; color: string } | null;
}

async function asanaFetch(path: string, token: string) {
  const res = await fetch(`https://app.asana.com/api/1.0/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET() {
  const token = process.env.ASANA_TOKEN;
  const workspaceGid = process.env.ASANA_WORKSPACE_GID;

  if (!token) {
    return NextResponse.json({ connected: false, tasks: [], projects: [] });
  }

  try {
    // Get workspaces if GID not set
    let wsGid = workspaceGid;
    if (!wsGid) {
      const wsData = await asanaFetch("workspaces", token);
      if (wsData?.data?.length > 0) {
        wsGid = wsData.data[0].gid;
      }
    }

    if (!wsGid) {
      return NextResponse.json({ connected: false, error: "No workspace found", tasks: [], projects: [] });
    }

    // Fetch tasks assigned to me — includes completed ones to show history
    const taskFields = "name,completed,completed_at,due_on,modified_at,projects.name,notes,assignee_status";
    const [taskData, projectData] = await Promise.all([
      asanaFetch(
        `tasks?workspace=${wsGid}&assignee=me&opt_fields=${taskFields}&limit=20`,
        token
      ),
      asanaFetch(
        `projects?workspace=${wsGid}&archived=false&opt_fields=name,completed,modified_at,current_status&limit=10`,
        token
      ),
    ]);

    const tasks: AsanaTask[] = (taskData?.data ?? []).slice(0, 15).map((t: AsanaTask) => ({
      gid: t.gid,
      name: t.name,
      completed: t.completed,
      completed_at: t.completed_at,
      due_on: t.due_on,
      modified_at: t.modified_at,
      projects: t.projects ?? [],
      notes: (t.notes ?? "").slice(0, 200),
    }));

    const projects: AsanaProject[] = (projectData?.data ?? []).slice(0, 8).map((p: AsanaProject) => ({
      gid: p.gid,
      name: p.name,
      completed: p.completed,
      modified_at: p.modified_at,
      current_status: p.current_status ?? null,
    }));

    const openTasks = tasks.filter((t) => !t.completed).length;
    const overdueTasks = tasks.filter(
      (t) => !t.completed && t.due_on && new Date(t.due_on) < new Date()
    ).length;

    return NextResponse.json({
      connected: true,
      workspaceGid: wsGid,
      tasks,
      projects,
      summary: {
        total: tasks.length,
        open: openTasks,
        overdue: overdueTasks,
        completed: tasks.filter((t) => t.completed).length,
      },
    });
  } catch (error) {
    return NextResponse.json({ connected: false, error: String(error), tasks: [], projects: [] });
  }
}
