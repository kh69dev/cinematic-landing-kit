// QA screenshots for a cinematic page: hero, mid-film and full page at three widths.
// Usage: node scripts/shots.mjs http://localhost:8123   (needs: npm i -D playwright && npx playwright install chromium)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2];
if (!url) { console.error("Usage: node scripts/shots.mjs <url>"); process.exit(1); }
mkdirSync("qa", { recursive: true });

// CHROMIUM_PATH lets you point at a preinstalled browser when the Playwright version and browser build differ.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const [name, width] of [["desktop", 1440], ["tablet", 1024], ["phone", 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000); // hero entrance + first film frames
  await page.screenshot({ path: `qa/${name}-hero.png` });

  // Scroll to the middle of the film through Lenis so ScrollTrigger updates.
  await page.evaluate(() => {
    const film = document.querySelector("#film");
    if (!film) return;
    const y = film.offsetTop + film.offsetHeight / 2 - innerHeight / 2;
    if (window.lenis) window.lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
    window.ScrollTrigger?.update();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `qa/${name}-film.png` });

  await page.evaluate(() => (window.lenis ? window.lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)));
  await page.screenshot({ path: `qa/${name}-full.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(name, { overflow, errors });
  await page.close();
}
await browser.close();
