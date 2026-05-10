import { NextResponse } from "next/server";

const WORKFLOW_ID = 274213003;
const REPO = "snackattas/zattas.me";

export async function GET() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  const runsRes = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_ID}/runs?branch=main&per_page=1&status=success`,
    { headers }
  );
  if (!runsRes.ok) {
    return NextResponse.json({ error: "Failed to fetch runs" }, { status: 502 });
  }

  const runsData = await runsRes.json();
  const latestRun = runsData.workflow_runs?.[0];
  if (!latestRun) {
    return NextResponse.json({ error: "No runs found" }, { status: 404 });
  }

  const jobsRes = await fetch(
    `https://api.github.com/repos/${REPO}/actions/runs/${latestRun.id}/jobs?per_page=100`,
    { headers }
  );
  if (!jobsRes.ok) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 502 });
  }

  const jobsData = await jobsRes.json();
  const jobUrls: Record<string, string> = {};

  for (const job of jobsData.jobs ?? []) {
    // job.name format: "test (javascript, selenium, chrome)"
    const match = (job.name as string).match(/^test \((\w+), (\w+), \w+\)$/);
    if (match) {
      jobUrls[`${match[1]}-${match[2]}`] = job.html_url;
    }
  }

  return NextResponse.json(
    { runUrl: latestRun.html_url, jobUrls },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
