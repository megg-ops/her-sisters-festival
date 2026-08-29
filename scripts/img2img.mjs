#!/usr/bin/env node
// 图生图脚本：openai-next 网关 → doubao-seedream-5-0-pro-260628
// 已验证管线见 assets/probe/README.md（/v1/images/generations + image 数组 data URI）
//
// 用法：
//   NODE_USE_ENV_PROXY=1 node scripts/img2img.mjs \
//     --prompt "提示词" \
//     -i 参考图1.jpg [-i 参考图2.png ...] \
//     -o assets/char/输出名.png
//
// 密钥：AI_GATEWAY_KEY 或 OPENAI_NEXT_API_KEY（set -a && . ~/tools/envq/.agent.env.txt && set +a）
// 注意：返回 URL 24h 失效，脚本已自动即时下载；账号 8/31 00:00 失效

import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, extname } from "node:path";

const GATEWAY_BASE = process.env.AI_IMAGE_BASE || "https://api.openai-next.com";
const KEY = process.env.AI_GATEWAY_KEY || process.env.OPENAI_NEXT_API_KEY || "";
const MODEL = process.env.AI_IMAGE_MODEL || "doubao-seedream-5-0-pro-260628";
const UA = "her-sisters-festival-img2img/1.0 (hackathon asset pipeline)";

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

// 若环境有代理但没开 NODE_USE_ENV_PROXY，自动带该变量重新执行自己
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.https_proxy)) {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(process.execPath, [process.argv[1], ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_ENV_PROXY: "1" },
  });
  process.exit(r.status ?? 1);
}

function parseArgs(argv) {
  const opts = { prompt: "", images: [], out: "", size: "", format: "png", n: 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--prompt" || a === "-p") opts.prompt = argv[++i];
    else if (a === "-i" || a === "--image") opts.images.push(argv[++i]);
    else if (a === "-o" || a === "--out") opts.out = argv[++i];
    else if (a === "--size") opts.size = argv[++i];
    else if (a === "--format") opts.format = argv[++i];
    else if (a === "--n") opts.n = Number(argv[++i]);
    else { console.error(`未知参数: ${a}`); process.exit(2); }
  }
  if (!opts.prompt) { console.error("缺少 --prompt"); process.exit(2); }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
if (!KEY) { console.error("未找到密钥：请先 set -a && . ~/tools/envq/.agent.env.txt && set +a（需要 AI_GATEWAY_KEY）"); process.exit(2); }
if (!opts.out) opts.out = `assets/probe/img2img-${Date.now()}.${opts.format}`;

const imageUris = opts.images.map((p) => {
  const mime = MIME[extname(p).toLowerCase()];
  if (!mime) { console.error(`不支持的图片格式: ${p}`); process.exit(2); }
  const bytes = statSync(p).size;
  if (bytes > 4 * 1024 * 1024) {
    console.error(`⚠ 参考图过大（${(bytes / 1048576).toFixed(1)}MB）：${p}`);
    console.error("  网关对大请求体不稳定（16MB 实测必挂）。建议先缩图，例如：");
    console.error(`  uv run --with pillow -- python -c "from PIL import Image; im=Image.open('${p}'); im.thumbnail((1200,1200)); im.save('${p}',quality=82)"`);
    process.exit(2);
  }
  return `data:${mime};base64,${readFileSync(p).toString("base64")}`;
});

const body = {
  model: MODEL,
  prompt: opts.prompt,
  output_format: opts.format,
  response_format: "url",
  watermark: false,
  ...(opts.size ? { size: opts.size } : {}),
  ...(opts.n > 1 ? { n: opts.n } : {}),
  ...(imageUris.length ? { image: imageUris } : {}),
};

console.log(`→ ${MODEL}｜参考图 ${imageUris.length} 张｜图生图单张约 35–90s，请耐心等待…`);
const t0 = Date.now();

let json = null, res = null;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    res = await fetch(`${GATEWAY_BASE}/v1/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(290000),
    });
    json = await res.json().catch(() => null);
    if (res.ok && json?.data?.length) break;
  } catch (e) {
    json = null;
    console.error(`attempt ${attempt} 网络错误：${e.message ?? e}`);
  }
  /* 网关 ~130s 硬超时会返回 524/断连：多为本次生成超时，重试常可过；连续失败则减重 */
  if (attempt < 3) {
    console.error(`attempt ${attempt} 失败（HTTP ${res?.status ?? "???"}），5s 后重试…`);
    if (res?.status === 524) console.error("  524 = 网关超时。若连续出现：减少参考图数量、压缩参考图、或降低 --size（1280x720 稳定）。");
    await new Promise((r) => setTimeout(r, 5000));
  }
}

if (!res?.ok || !json?.data?.length) {
  console.error(`请求失败 HTTP ${res?.status ?? "???"}（重试 3 次后）：`);
  console.error(typeof json === "string" || !json ? String(json ?? await res?.text().catch(() => "")) : JSON.stringify(json, null, 2));
  mkdirSync(dirname(opts.out), { recursive: true });
  writeFileSync(`${opts.out}.failed.json`, JSON.stringify({ endpoint: `${GATEWAY_BASE}/v1/images/generations`, model: MODEL, prompt: opts.prompt, reference_images: opts.images, http_status: res?.status ?? null, failed_at: new Date().toISOString(), body: json ?? null }, null, 2));
  console.error(`✗ 原始响应已存：${opts.out}.failed.json`);
  process.exit(1);
}
console.log(`← 生成成功（${((Date.now() - t0) / 1000).toFixed(1)}s），共 ${json.data.length} 张，开始下载…`);

mkdirSync(dirname(opts.out), { recursive: true });
const record = { endpoint: `${GATEWAY_BASE}/v1/images/generations`, model: MODEL, prompt: opts.prompt, reference_images: opts.images, size: opts.size || null, generated_at: new Date().toISOString(), response: json };
writeFileSync(`${opts.out}.response.json`, JSON.stringify(record, null, 2));

for (let i = 0; i < json.data.length; i++) {
  const out = json.data.length === 1 ? opts.out : opts.out.replace(/(\.\w+)$/, `-${i + 1}$1`);
  const img = await fetch(json.data[i].url);
  if (!img.ok) { console.error(`下载失败 ${img.status}: ${out}`); process.exit(1); }
  writeFileSync(out, Buffer.from(await img.arrayBuffer()));
  console.log(`✓ ${out}`);
}
console.log(`✓ 响应记录：${opts.out}.response.json（URL 24h 失效，已落盘）`);
