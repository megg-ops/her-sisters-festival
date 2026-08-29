/* 文化问答代理（ADR-004/005）
   部署形态：Vercel Serverless Function（Node runtime）
   - 密钥只存在于环境变量 AI_GATEWAY_KEY，浏览器永不接触
   - 服务端 6s 硬超时；任何失败都返回 200 + status:"offline" + 该物件预设回答
   - 回答仅允许基于 knowledge.json 对应条目；条目外问题按边界话术拒绝
   协议：
   POST { objectId: string, question: string }
   200 { status: "ai" | "offline", objectId, answer, sources[], note? } */

import knowledge from "../src/data/knowledge.json";

interface AskBody {
  objectId?: string;
  question?: string;
}

interface KnowledgeEntry {
  id: string;
  topic: string;
  facts: { question: string; answer: string }[];
  boundary: string;
  sources: { org: string; title: string; url: string }[];
}

const GATEWAY_URL = process.env.AI_GATEWAY_URL || "https://api.openai-next.com/v1/chat/completions";
const GATEWAY_KEY = process.env.AI_GATEWAY_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "qwen3-max";
const TIMEOUT_MS = 5800; /* 预留 500ms 给序列化，整体不超 6s（PRD §8.4） */
const MAX_QUESTION = 120;

const META = (knowledge as any).meta || {};
const OBJECTS: KnowledgeEntry[] = (knowledge as any).objects || [];
const OFFLINE_LABEL = (META.boundaryScript && META.boundaryScript.timeoutOfflineLabel) || "离线资料";
const OUT_OF_KNOWLEDGE = (META.boundaryScript && META.boundaryScript.outOfKnowledge) || "这个我讲不准。";

function findEntry(objectId: string): KnowledgeEntry | undefined {
  return OBJECTS.find((entry) => entry.id === objectId);
}

function presetAnswer(entry: KnowledgeEntry, question: string): string {
  const hit = entry.facts.find((fact) => fact.question === question);
  return (hit || entry.facts[0]).answer;
}

async function askGateway(entry: KnowledgeEntry, question: string): Promise<string> {
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
    const data: any = await resp.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) throw new Error("empty answer");
    return answer.trim();
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }
  const body: AskBody = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const objectId = String(body.objectId || "");
  const question = String(body.question || "").slice(0, MAX_QUESTION);
  const entry = findEntry(objectId);

  if (!entry) {
    res.status(200).json({
      status: "offline",
      objectId,
      answer: OUT_OF_KNOWLEDGE,
      sources: [],
      note: OFFLINE_LABEL
    });
    return;
  }

  if (!question || !GATEWAY_KEY) {
    res.status(200).json({
      status: "offline",
      objectId,
      answer: presetAnswer(entry, question),
      sources: entry.sources,
      note: OFFLINE_LABEL
    });
    return;
  }

  try {
    const answer = await askGateway(entry, question);
    res.status(200).json({ status: "ai", objectId, answer, sources: entry.sources });
  } catch (err: any) {
    res.status(200).json({
      status: "offline",
      objectId,
      answer: presetAnswer(entry, question),
      sources: entry.sources,
      note: OFFLINE_LABEL
    });
  }
}

function safeParse(raw: string): AskBody {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
