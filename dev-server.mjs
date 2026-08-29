#!/usr/bin/env node
/* 本地开发服务器（dev-only，不随前端部署）：
   - 静态服务仓库根目录（demo.html / assets / src）
   - POST /api/ask 与 api/ask.ts 同协议同行为（密钥走环境变量 AI_GATEWAY_KEY）
   启动：set -a && . ~/tools/envq/.agent.env.txt && set +a && NODE_USE_ENV_PROXY=1 node dev-server.mjs [port]
   （NODE_USE_ENV_PROXY 仅为本机 WSL 代理环境所需；Vercel 云端函数直接出网，无需设置）
   用途：在 Vercel 导入之前，本地验证 demo.html → /api/ask 的真实 AI 链路。 */
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.argv[2] || 8788);
const ROOT = process.cwd();
const GATEWAY_URL = process.env.AI_GATEWAY_URL || "https://api.openai-next.com/v1/chat/completions";
const GATEWAY_KEY = process.env.AI_GATEWAY_KEY || process.env.OPENAI_NEXT_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "qwen3-max";
const TIMEOUT_MS = 5800;
const MAX_QUESTION = 120;

const knowledge = JSON.parse(await readFile(path.join(ROOT, "src/data/knowledge.json"), "utf8"));
const META = knowledge.meta || {};
const OBJECTS = knowledge.objects || [];
const OFFLINE_LABEL = META.boundaryScript?.timeoutOfflineLabel ?? "离线资料";
const OUT_OF_KNOWLEDGE = META.boundaryScript?.outOfKnowledge ?? "这个我讲不准。";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".wav": "audio/wav",
  ".svg": "image/svg+xml"
};

function findEntry(objectId) {
  return OBJECTS.find((entry) => entry.id === objectId);
}

function presetAnswer(entry, question) {
  const hit = entry.facts.find((fact) => fact.question === question);
  return (hit || entry.facts[0]).answer;
}

async function askGateway(entry, question) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const facts = entry.facts.map((f) => "问：" + f.question + "｜答：" + f.answer).join("\n");
  const system = "扮演苗族女孩的外婆，用条目事实以2-4句口语中文回答。不得编造苗语、苗歌或条目外细节；无依据的问题只答：" + OUT_OF_KNOWLEDGE + "\n条目[" + entry.topic + "]：" + facts + "\n注意：" + entry.boundary;
    const resp = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GATEWAY_KEY}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: question }
        ],
        enable_thinking: false,
        max_tokens: 160,
        temperature: 0.6
      }),
      signal: controller.signal
    });
    if (!resp.ok) throw new Error(`gateway ${resp.status}`);
    const data = await resp.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) throw new Error("empty answer");
    return answer.trim();
  } finally {
    clearTimeout(timer);
  }
}

async function handleAsk(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  if (body.length > 4096) body = body.slice(0, 4096);
  let parsed = {};
  try { parsed = JSON.parse(body || "{}"); } catch { parsed = {}; }
  const objectId = String(parsed.objectId || "");
  const question = String(parsed.question || "").slice(0, MAX_QUESTION);
  const entry = findEntry(objectId);

  const send = (payload) => {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
  };

  if (!entry) return send({ status: "offline", objectId, answer: OUT_OF_KNOWLEDGE, sources: [], note: OFFLINE_LABEL });
  if (!question || !GATEWAY_KEY) {
    return send({ status: "offline", objectId, answer: presetAnswer(entry, question), sources: entry.sources, note: OFFLINE_LABEL });
  }
  try {
    const answer = await askGateway(entry, question);
    send({ status: "ai", objectId, answer, sources: entry.sources });
  } catch (err) {
    send({ status: "offline", objectId, answer: presetAnswer(entry, question), sources: entry.sources, note: OFFLINE_LABEL });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === "POST" && url.pathname === "/api/ask") {
    try { await handleAsk(req, res); } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "internal" }));
    }
    return;
  }
  let filePath = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (filePath.endsWith("/") || filePath.endsWith("\\")) filePath = path.join(filePath, "index.html");
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("not found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[dev-server] http://127.0.0.1:${PORT}/她的姊妹节-demo.html`);
  console.log(`[dev-server] /api/ask → ${AI_MODEL} @ ${new URL(GATEWAY_URL).host} key=${GATEWAY_KEY ? "loaded" : "MISSING(将始终走离线兜底)"}`);
});
