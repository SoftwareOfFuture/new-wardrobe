const HF_API_URL =
  "https://api-inference.huggingface.co/models/stabilityai/TripoSR";
const MESHY_API_URL = "https://api.meshy.ai/openapi/v1/image-to-3d";

interface ConversionResult {
  taskId: string;
  provider: "triposr" | "meshy";
}

interface StatusResult {
  status: "pending" | "processing" | "completed" | "failed";
  modelUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export async function startConversion(
  imageUrl: string
): Promise<ConversionResult> {
  if (process.env.MESHY_API_KEY) {
    try {
      return await startMeshyConversion(imageUrl);
    } catch (err) {
      console.error("[Meshy] failed, falling back to TripoSR:", err);
      if (process.env.HF_API_TOKEN) {
        return startTripoSRConversion(imageUrl);
      }
      throw err;
    }
  }
  return startTripoSRConversion(imageUrl);
}

async function startMeshyConversion(
  imageUrl: string
): Promise<ConversionResult> {
  const response = await fetch(MESHY_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageUrl,
      ai_model: "meshy-6",
      topology: "triangle",
      target_polycount: 30000,
      should_remesh: true,
      should_texture: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `Meshy API error (${response.status}): ${errorText.slice(0, 200)}`
    );
  }

  const data = await response.json();
  // Meshy v1 API: returns { result: "task_id" }
  const taskId = data.result || data.task_id || data.id;
  if (!taskId) {
    throw new Error(
      `Meshy API: task ID missing in response: ${JSON.stringify(data).slice(0, 200)}`
    );
  }
  return { taskId, provider: "meshy" };
}

async function startTripoSRConversion(
  imageUrl: string
): Promise<ConversionResult> {
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    body: Buffer.from(imageBuffer),
  });

  if (!response.ok) {
    throw new Error(`TripoSR API error: ${response.statusText}`);
  }

  const taskId = `triposr_${Date.now()}`;
  return { taskId, provider: "triposr" };
}

export async function checkMeshyStatus(taskId: string): Promise<StatusResult> {
  const response = await fetch(`${MESHY_API_URL}/${taskId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Meshy status check failed: ${response.statusText}`);
  }

  const data = await response.json();

  switch (data.status) {
    case "SUCCEEDED":
      return {
        status: "completed",
        modelUrl: data.model_urls?.glb,
        thumbnailUrl: data.thumbnail_url,
      };
    case "FAILED":
      return {
        status: "failed",
        error: data.message || "Conversion failed",
      };
    case "IN_PROGRESS":
      return { status: "processing" };
    default:
      return { status: "pending" };
  }
}
