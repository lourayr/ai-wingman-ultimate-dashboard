import { NextResponse } from "next/server";

// Env vars:
//   ASANA_TOKEN          — Personal Access Token from app.asana.com/0/my-apps
//   ASANA_PROJECT_GID    — Pull tasks from one specific project (recommended)
//                          e.g. 1205445321065853 from URL /project/{gid}/board/...
//   ASANA_WORKSPACE_GID  — Fallback: workspace GID (auto-detected if not set)
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
  const projectGid = process.env.ASANA_PROJECT_GID;
  const workspaceGid = process.env.ASANA_WORKSPACE_GID;

  if (!token) {
    return NextResponse.json({ connected: false, tasks: [], projects: [] });
  }

  try {
    const taskFields = "name,completed,completed_at,due_on,modified_at,projects.name,notes,assignee_status";

    if (projectGid) {
      // Project-specific mode: only pull tasks from the configured board
      const [taskData, projectInfo] = await Promise.all([
        asanaFetch(
          `projects/${projectGid}/tasks?opt_fields=${taskFields}&limit=50`,
          token
        ),
        asanaFetch(
          `projects/${projectGid}?opt_fields=name,completed,modified_at,current_status`,
          token
        ),
      ]);

      const tasks: AsanaTask[] = (taskData?.data ?? []).slice(0, 20).map((t: AsanaTask) => ({
        gid: t.gid,
        name: t.name,
        completed: t.completed,
        completed_at: t.completed_at,
        due_on: t.due_on,
        modified_at: t.modified_at,
        projects: t.projects ?? [],
        notes: (t.notes ?? "").slice(0, 200),
      }));

      const proj = projectInfo?.data;
      const projects: AsanaProject[] = proj ? [{ gid: proj.gid, name: proj.name, completed: proj.completed, modified_at: proj.modified_at, current_status: proj.current_status ?? null }] : [];

      const openTasks = tasks.filter((t) => !t.completed).length;
      const overdueTasks = tasks.filter((t) => !t.completed && t.due_on && new Date(t.due_on) < new Date()).length;

      return NextResponse.json({
        connected: true,
        projectGid,
        tasks,
        projects,
        summary: { total: tasks.length, open: openTasks, overdue: overdueTasks, completed: tasks.filter((t) => t.completed).length },
      });
    }

    // Workspace-wide fallback (no project GID set)
    let wsGid = workspaceGid;
    if (!wsGid) {
      const wsData = await asanaFetch("workspaces", token);
      if (wsData?.data?.length > 0) wsGid = wsData.data[0].gid;
    }

    if (!wsGid) {
      return NextResponse.json({ connected: false, error: "No workspace found. Set ASANA_PROJECT_GID or ASANA_WORKSPACE_GID.", tasks: [], projects: [] });
    }

    // Fetch tasks assigned to me — includes completed ones to show history
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
