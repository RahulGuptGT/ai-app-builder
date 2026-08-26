import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { DeployResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { projectId } = (await req.json()) as { projectId: string };

    const supabase = createSupabaseServerClient();
    const admin = createSupabaseAdminClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: deployment } = await admin
      .from("deployments")
      .insert({
        project_id: projectId,
        version: 1,
        status: "building",
        files_snapshot: project.files,
      })
      .select()
      .single();

    const files = project.files as Record<string, { content: string; visible: boolean }>;
    const html = buildStandaloneHTML(files);

    const version = Date.now();
    const storagePath = `${projectId}/v${version}/index.html`;
    const { error: uploadError } = await admin.storage
      .from("deployments")
      .upload(storagePath, html, {
        contentType: "text/html",
        upsert: true,
      });

    if (uploadError) {
      await admin
        .from("deployments")
        .update({ status: "failed", build_log: uploadError.message })
        .eq("id", deployment.id);
      return NextResponse.json(
        { error: "Deploy failed: " + uploadError.message },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const deployUrl = `${supabaseUrl}/storage/v1/object/public/deployments/${storagePath}`;

    await admin
      .from("deployments")
      .update({ status: "success", deploy_url: deployUrl })
      .eq("id", deployment.id);

    await admin
      .from("projects")
      .update({
        status: "deployed",
        deployed_url: deployUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return NextResponse.json({
      url: deployUrl,
      version,
    } as DeployResponse);
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildStandaloneHTML(
  files: Record<string, { content: string; visible: boolean }>
): string {
  const appContent = files["src/App.tsx"]?.content ||
    files["src/App.jsx"]?.content ||
    `<div style="padding:2rem;font-family:sans-serif"><h1>App not found</h1></div>`;

  const cssContent = files["src/index.css"]?.content || "";

  const componentCode = appContent
    .replace(/import\s+.*from\s+['"][^'"]+['"];?/g, "")
    .replace(/export\s+default\s+/, "")
    .replace(/export\s+/, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deployed App</title>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<style>${cssContent}</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
${componentCode}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>
</body>
</html>`;
}
