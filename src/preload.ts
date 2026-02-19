import forestLight from "./assets/hero-bg-forest-light.png";
import forestShiny from "./assets/hero-bg-forest-shiny.png";
import photoTime from "./assets/photo-time.png";
import photoTimeShiny from "./assets/photo-time-shiny.png";

// Overestimate total bytes by ~20% so the bar never stalls at 100% waiting for stragglers
const TOTAL_BYTES = 9_000_000;

const MESSAGES = [
  "First load, please wait while we prepare",
  "Getting awesomeness",
  "Downloading amazeballs",
  "Wait, where did I put that?",
  "OK found it",
  "Setting up the card",
];

export async function preload() {
  const overlay = document.getElementById("loading-overlay");
  const bar = document.getElementById("loading-bar");
  const label = document.getElementById("loading-label");
  if (!overlay || !bar) return;

  // Rotate messages every 2.5s while loading
  let msgIndex = 0;
  const rotateLabel = setInterval(() => {
    if (!label) return;
    msgIndex = Math.min(msgIndex + 1, MESSAGES.length - 1);
    label.style.opacity = "0";
    setTimeout(() => { label.textContent = MESSAGES[msgIndex]; label.style.opacity = "1"; }, 400);
  }, 2500);

  // Wait for the browser to paint the initial 0% bar before we start updating it.
  // Without this, width jumps from un-painted 0% to the first value with no transition.
  await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  // Show a small initial tick so the bar is visibly alive before real data arrives
  bar.style.width = "4%";

  let loaded = 0;

  const stream = async (url: string) => {
    const res = await fetch(url);
    const reader = res.body!.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      loaded += value.byteLength;
      bar.style.width = Math.min(98, (loaded / TOTAL_BYTES) * 100) + "%";
    }
  };

  try {
    await Promise.all([forestLight, forestShiny, photoTime, photoTimeShiny].map(stream));
  } catch {
    // On error (offline, etc.) just proceed — images will load via <img> tags as normal
  }

  clearInterval(rotateLabel);
  bar.style.width = "100%";
  await new Promise(r => setTimeout(r, 200));
  overlay.style.opacity = "0";
  await new Promise(r => setTimeout(r, 600));
  overlay.remove();
}
