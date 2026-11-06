import { timingSafeEqual } from "node:crypto";
import { GenerateVideosOperation, GoogleGenAI } from "@google/genai";

const validOperation = (name: unknown): name is string =>
  typeof name === "string" && /^models\/veo-3\.1-fast-generate-preview\/operations\/[\w-]+$/.test(name);

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const accessCode = process.env.VIDEO_ACCESS_CODE;
  if (!apiKey || !accessCode) {
    return Response.json({ error: "Video generation is not configured yet." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid request");
    body = parsed;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const supplied = Buffer.from(typeof body.code === "string" ? body.code : "");
  const expected = Buffer.from(accessCode);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return Response.json({ error: "Incorrect video access code." }, { status: 401 });
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    if (body.action === "start") {
      const female = typeof body.female === "string" ? body.female.trim() : "";
      const male = typeof body.male === "string" ? body.male.trim() : "";
      if (!female || !male || female.length > 80 || male.length > 80) {
        return Response.json({ error: "Two valid character names are required." }, { status: 400 });
      }
      const operation = await ai.models.generateVideos({
        model: "veo-3.1-fast-generate-preview",
        prompt: `Create a playful, cinematic romantic-comedy meet-cute featuring fictional characters named ${JSON.stringify(female)} and ${JSON.stringify(male)}. Warm, whimsical, family-friendly, no on-screen text.`,
        config: { numberOfVideos: 1, durationSeconds: 8, resolution: "720p" },
      });
      if (!validOperation(operation.name)) throw new Error("Unexpected operation name");
      return Response.json({ operation: operation.name });
    }
    if ((body.action !== "status" && body.action !== "download") || !validOperation(body.operation)) {
      return Response.json({ error: "Invalid video request." }, { status: 400 });
    }
    const pending = new GenerateVideosOperation();
    pending.name = body.operation;
    const operation = await ai.operations.getVideosOperation({ operation: pending });
    if (operation.error) return Response.json({ error: "Google could not generate this video. Try another match." }, { status: 502 });
    if (!operation.done) return Response.json({ done: false });
    const video = operation.response?.generatedVideos?.[0]?.video;
    if (!video?.uri) return Response.json({ error: "Google returned no video for this match." }, { status: 502 });
    if (body.action === "status") return Response.json({ done: true });
    const url = new URL(video.uri);
    if (url.protocol !== "https:" || url.hostname !== "generativelanguage.googleapis.com") throw new Error("Unexpected video host");
    const response = await fetch(url, { headers: { "x-goog-api-key": apiKey } });
    if (!response.ok || !response.body) throw new Error("Video download failed");
    return new Response(response.body, { headers: { "Content-Type": "video/mp4", "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Video service failed. Check your Google API key, billing and quota, then try again." }, { status: 502 });
  }
}
