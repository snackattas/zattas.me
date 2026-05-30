import { NextResponse } from "next/server";

const REPO = "snackattas/zattas.me";
const WORKFLOW_NAME = "Automation Detection (zattas.me)";

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
};

type JobConclusion = "success" | "failure" | "cancelled" | "skipped" | "in_progress" | "unknown";

export async function GET() {
  const workflowsRes = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows`,
    { headers }
  );
  if (!workflowsRes.ok) {
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 502 });
  }

  const workflowsData = await workflowsRes.json();
  const workflow = workflowsData.workflows?.find(
    (w: { name: string }) => w.name === WORKFLOW_NAME
  );
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const [latestRes, lastSuccessRes] = await Promise.all([
    fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${workflow.id}/runs?branch=main&per_page=1`,
      { headers }
    ),
    fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${workflow.id}/runs?branch=main&per_page=1&status=success`,
      { headers }
    ),
  ]);

  if (!latestRes.ok) {
    return NextResponse.json({ error: "Failed to fetch runs" }, { status: 502 });
  }

  const latestData = await latestRes.json();
  const latestRun = latestData.workflow_runs?.[0];
  if (!latestRun) {
    return NextResponse.json({ error: "No runs found" }, { status: 404 });
  }

  const lastSuccessData = lastSuccessRes.ok ? await lastSuccessRes.json() : null;
  const lastSuccessRun = lastSuccessData?.workflow_runs?.[0] ?? null;

  const jobsRes = await fetch(
    `https://api.github.com/repos/${REPO}/actions/runs/${latestRun.id}/jobs?per_page=100`,
    { headers }
  );
  if (!jobsRes.ok) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 502 });
  }

  const jobsData = await jobsRes.json();
  const jobs: Record<string, { url: string; conclusion: JobConclusion }> = {};

  for (const job of jobsData.jobs ?? []) {
    // job.name format: "test (javascript, selenium, chrome)"
    const match = (job.name as string).match(/^test \((\w+), (\w+), \w+\)$/);
    if (!match) continue;

    const status = job.status as string;
    const rawConclusion = job.conclusion as string | null;
    const conclusion: JobConclusion =
      status !== "completed"
        ? "in_progress"
        : rawConclusion === "success" ||
            rawConclusion === "failure" ||
            rawConclusion === "cancelled" ||
            rawConclusion === "skipped"
          ? rawConclusion
          : "unknown";

    jobs[`${match[1]}-${match[2]}`] = {
      url: job.html_url,
      conclusion,
    };
  }

  return NextResponse.json(
    {
      runUrl: latestRun.html_url,
      runConclusion: (latestRun.conclusion ?? latestRun.status) as string,
      runCreatedAt: latestRun.created_at as string,
      jobs,
      lastSuccess:
        lastSuccessRun && lastSuccessRun.id !== latestRun.id
          ? {
              url: lastSuccessRun.html_url as string,
              createdAt: lastSuccessRun.created_at as string,
            }
          : null,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    }
  );
}
