import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const taskId = "019dfd74-2b0c-77e8-8639-aca70eead137";

  const res = await fetch(
    `https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`,
    {
      headers: { Authorization: `Bearer ${process.env.MESHY_API_KEY}` },
    }
  );
  const data = await res.json();
  console.log("Meshy status:", data.status, "progress:", data.progress);

  if (data.status === "SUCCEEDED" && data.model_urls?.glb) {
    const model = await prisma.model3D.findFirst({ where: { taskId } });
    if (!model) {
      console.log("Model record not found for taskId");
      return;
    }
    const updated = await prisma.model3D.update({
      where: { id: model.id },
      data: {
        status: "COMPLETED",
        modelUrl: data.model_urls.glb,
        thumbnailUrl: data.thumbnail_url || null,
      },
    });
    console.log("✓ Updated:", updated.id, "→ COMPLETED");
  } else {
    console.log("Task not yet succeeded:", data.status);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
