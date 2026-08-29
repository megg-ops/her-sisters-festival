/* 《她的姊妹节》演示视频录制：全流程闭环 + 演示节奏 + 点击涟漪高亮。
 * 前置：dev-server 已在 8788（AI 真实路径）。
 * 输出：/tmp/videos/*.webm（后续 ffmpeg 转 MP4 + 垫 BGM）。 */
const { chromium } = require("playwright-core");
const fs = require("fs");
const EXE = "/home/freya/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";
const URL = "http://127.0.0.1:8788/她的姊妹节-demo.html";
const VDIR = "/tmp/videos";
fs.mkdirSync(VDIR, { recursive: true });

/* 涟漪高亮：每次点击在坐标处闪一个扩散圆环 */
const PING_CSS = `
#clickPing{position:fixed;z-index:9999;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;
border:3px solid #7fd7de;pointer-events:none;animation:pingA .55s ease-out forwards}
@keyframes pingA{from{transform:scale(.4);opacity:.95}to{transform:scale(2.4);opacity:0}}
`;

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 810 },
    recordVideo: { dir: VDIR, size: { width: 1440, height: 810 } },
  });
  const page = await ctx.newPage();
  await page.addInitScript(`(()=>{const s=document.createElement("style");s.textContent=${JSON.stringify(PING_CSS)};document.addEventListener("DOMContentLoaded",()=>document.head.appendChild(s));})();`);
  await page.evaluate(() => {}).catch(() => {});

  const beat = (ms) => page.waitForTimeout(ms);
  async function pingClick(locator, pauseAfter = 700) {
    const box = await locator.boundingBox().catch(() => null);
    if (box) {
      const x = box.x + box.width / 2, y = box.y + box.height / 2;
      await page.evaluate(([x, y]) => {
        const d = document.createElement("div");
        d.id = "clickPing";
        d.style.left = x + "px"; d.style.top = y + "px";
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 600);
      }, [x, y]);
    }
    await beat(420);
    await locator.click({ timeout: 8000 }); /* 定位器点击：自动等待重渲染，避免坐标竞态 */
    await beat(pauseAfter);
  }
  const clickText = async (label, pause) => pingClick(page.getByRole("button", { name: label }), pause);

  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await beat(2500); /* 封面停留 */

  await clickText(/从清晨开始/, 2200); /* 开场旁白 */

  /* 换装五层（每层停一拍让叠层可见） */
  await pingClick(page.locator("#spotWardrobe"), 900);
  await page.screenshot({ path: `${VDIR}/still-wardrobe.png` }).catch(() => {});
  for (const label of ["穿上大领对襟衣", "穿上百褶裙", "穿上围腰", "穿上银项圈", "穿上银角银冠"]) {
    await clickText(label, 850);
  }
  await beat(1200); /* 确认页：全身盛装 */
  await clickText("确认穿好", 1600); /* 场景立绘切换 + 外婆气泡 */
  await beat(1800); /* 外婆气泡停留 */
  await pingClick(page.locator("#speechBubble"), 900); /* 收起 */

  /* 做饭四步 */
  await pingClick(page.locator("#spotKitchen"), 900);
  for (const c of ["红色", "紫色", "黄色", "黑色", "白色"]) {
    await pingClick(page.locator(`[data-dye="${c}"]`), 420);
  }
  await beat(900); /* 米盆五色染色团 */
  await clickText("继续", 800);
  for (const step of ["煮色素", "浸泡上色", "分甑蒸制"]) {
    await pingClick(page.locator(`[data-cook]`, { hasText: step }), 600);
  }
  await beat(1500); /* 蒸汽 */
  await clickText("继续", 800);
  await pingClick(page.locator('[data-pack="fill"]'), 1100); /* 装篮切帧 */
  await pingClick(page.locator('[data-pack="wrap"]'), 1100); /* 包帕切帧 */
  await clickText("继续", 900);
  await pingClick(page.locator('[data-mood="沉静的河青"]'), 1400); /* 心情色 + 像话术 */
  await clickText("带上心情出发", 1600);

  /* 文化问答（AI 真实路径：思考态→回答） */
  await pingClick(page.locator("#objHairpin"), 900);
  await beat(600);
  await pingClick(page.locator(".ai-q").first(), 600);
  await beat(2600); /* 外婆想了想……→ AI 回答 */
  await beat(2200); /* 回答停留 */
  await pingClick(page.locator("#bubbleSource"), 1400); /* 来源抽屉 */
  await pingClick(page.locator("#srcDone"), 800);
  await pingClick(page.locator("#speechBubble"), 1000); /* 收起 */

  /* 出门 → 第二幕 */
  await pingClick(page.locator("#spotDoor"), 2200); /* 场景切换 */

  /* 听歌（音频由页面播放；录屏无声，后期垫 BGM） */
  await pingClick(page.locator("#spotSong"), 1600);
  await beat(1800);
  const songNext = page.getByRole("button", { name: "继续" });
  if (await songNext.count()) { await pingClick(songNext, 900); }
  const intents = page.locator("[data-intent]");
  if (await intents.count()) {
    await pingClick(intents.first(), 900);
    await clickText("继续", 900);       /* 选中心意 → 回应步 */
    await clickText("完成回应", 1400);
  } else { await beat(800); }

  /* 赠饭 → 记忆卡 */
  await pingClick(page.locator("#spotGift"), 1200);
  await pingClick(page.locator("[data-gift]").first(), 1300); /* 先选心意（有守卫） */
  await clickText("把饭递出去", 2000);
  await beat(3000); /* 记忆卡 */

  await ctx.close(); /* 落盘视频 */
  await browser.close();
  console.log("recording done:", fs.readdirSync(VDIR).join(", "));
})().catch((e) => { console.error("RECORD FAILED:", e); process.exit(1); });
