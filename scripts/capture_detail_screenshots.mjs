import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const port = process.argv[2] || "9229";
const output = path.resolve("artifacts/image-curation");
await mkdir(output, { recursive: true });

const restaurants = [
  ["taian", "taian-table"],
  ["fu", "fu-he-hui"],
  ["sushi", "sushi-oyama"],
  ["bombana", "bombana"],
  ["yi", "yi-long-court"],
];

const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
  method: "PUT",
}).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function command(method, params = {}) {
  const commandId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(commandId, { resolve, reject });
    socket.send(JSON.stringify({ id: commandId, method, params }));
  });
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function screenshot(filename) {
  const result = await command("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(path.join(output, filename), Buffer.from(result.data, "base64"));
}

async function show(selector) {
  await command("Runtime.evaluate", {
    expression: `(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return false;
      element.querySelectorAll('img').forEach((image) => {
        image.loading = 'eager';
        if (image.dataset.src && !image.src) image.src = image.dataset.src;
      });
      element.scrollIntoView({ block: 'center', behavior: 'instant' });
      return true;
    })()`,
    returnByValue: true,
  });
  await wait(1400);
}

await command("Page.enable");
await command("Runtime.enable");
await command("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});

for (const [name, slug] of restaurants) {
  const url = `http://127.0.0.1:4173/?v=image-curation-cdp#restaurant=${slug}`;
  await command("Page.navigate", { url });
  await wait(2300);
  await command("Runtime.evaluate", {
    expression: "window.scrollTo({ top: 0, behavior: 'instant' })",
  });
  await wait(450);
  await screenshot(`${name}-hero-cdp.png`);

  await show(".pm-visual-story");
  await screenshot(`${name}-visual-story.png`);

  await show(".pm-food-grid");
  await screenshot(`${name}-food-visual.png`);
}

await command("Browser.close");
