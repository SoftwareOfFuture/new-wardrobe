import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkMeshyStatus } from "@/lib/image-to-3d";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  const model = await prisma.model3D.findFirst({ where: { taskId } });
  if (!model) {
    return NextResponse.json({ error: "Model bulunamadı" }, { status: 404 });
  }

  if (model.status === "COMPLETED" || model.status === "FAILED") {
    return NextResponse.json(model);
  }

  try {
    const status = await checkMeshyStatus(taskId);

    const updated = await prisma.model3D.update({
      where: { id: model.id },
      data: {
        status:
          status.status === "completed"
            ? "COMPLETED"
            : status.status === "failed"
              ? "FAILED"
              : "PROCESSING",
        modelUrl: status.modelUrl || model.modelUrl,
        thumbnailUrl: status.thumbnailUrl || model.thumbnailUrl,
        errorMessage: status.error || null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[model-status] checkMeshyStatus failed:", err);
    return NextResponse.json(model);
  }
}
