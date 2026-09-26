// Loads math-quest.html in headless Chromium, captures console errors,
// simulates title->difficulty->gameplay, and saves screenshots.
const path = require('path');
const fs = require('fs');
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (e) {
  console.error('SKIP: puppeteer not installed, cannot run headless check');
  process.exit(0);
}

(async () => {
  const shotDir = path.join(__dirname, 'screenshots');
  fs.mkdirSync(shotDir, { recursive: true });
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push('Uncaught: ' + err.message));

  const file = 'file://' + path.join(__dirname, '..', 'math-quest.html');
  await page.goto(file, { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(shotDir, '01-title.png') });

  // Click start / difficulty pick via a tap in the middle-ish (Adventurer button area)
  // Try keyboard path first: Enter to start with default difficulty.
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(shotDir, '02-after-start.png') });

  // Move hero with arrow keys for a few frames to exercise gameplay loop.
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 600));
  await page.keyboard.up('ArrowRight');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(shotDir, '03-gameplay-3s.png') });

  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(shotDir, '04-gameplay-later.png') });

  // Open the quiz/question modal directly so we can verify its layout.
  await page.evaluate(() => { if (typeof openMathPopup === 'function') openMathPopup('ap'); });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(shotDir, '05-quiz-modal.png') });

  await browser.close();

  if (errors.length) {
    console.error('FAIL: console errors detected:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  }
  console.log('OK: no uncaught console errors; screenshots saved to tools/screenshots/');
  process.exit(0);
})().catch(e => {
  console.error('FAIL: headless check threw:', e);
  process.exit(1);
});
