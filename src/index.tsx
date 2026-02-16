import { useState, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import Hero from "./hero";
import type { HeroMode } from "./hero";
import Cards from "./cards";
import Footer from "./footer";

declare global {
  interface Window { __CARD__?: { name: string; displayName?: string; dob: string; sex?: string } }
}

const card = window.__CARD__;
const isOwned = !!card;

const POLAR_CHECKOUT = "https://buy.polar.sh/polar_cl_e4UijEKyYPBWwsVHxdg6jJt1t3tOqiHi5CtRI3itZ5L";
const NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/;

type NameStatus = "idle" | "checking" | "available" | "taken" | "invalid" | "reserved" | "too_short";

// ── Welcome Mat (shown at root, no __CARD__) ─────────────────────
function WelcomeMat({ onNameChange, onDobChange, nameValue, dobValue }: {
  onNameChange: (name: string) => void;
  onDobChange: (dob: string) => void;
  nameValue: string;
  dobValue: string;
}) {
  const [status, setStatus] = useState<NameStatus>("idle");
  const checkTimer = useRef<ReturnType<typeof setTimeout>>();
  const currentName = useRef(nameValue);

  const checkName = useCallback(async (name: string) => {
    if (name !== currentName.current) return;
    try {
      const res = await fetch(`/api/check/${encodeURIComponent(name)}`);
      const data = await res.json();
      if (name !== currentName.current) return;
      if (data.available) {
        setStatus("available");
      } else {
        setStatus(data.reason === "reserved" ? "reserved" : "taken");
      }
    } catch {
      setStatus("idle");
    }
  }, []);

  function handleNameInput(raw: string) {
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    currentName.current = cleaned;
    onNameChange(cleaned);

    if (cleaned.length < 2) {
      setStatus(cleaned.length > 0 ? "too_short" : "idle");
      return;
    }
    if (!NAME_PATTERN.test(cleaned)) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");
    clearTimeout(checkTimer.current);
    checkTimer.current = setTimeout(() => checkName(cleaned), 300);
  }

  const isReady = status === "available" && dobValue;
  const checkoutUrl = isReady
    ? `${POLAR_CHECKOUT}?${new URLSearchParams({
        "metadata[cardName]": nameValue,
        "metadata[dob]": dobValue,
        "metadata[displayName]": nameValue.charAt(0).toUpperCase() + nameValue.slice(1),
        "success_url": `https://clockwork.cards/${nameValue}?welcome=true`,
      })}`
    : undefined;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      style={{
        background: "#faf7f2",
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: "#2a2420",
      }}
    >
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ padding: "28px 0 0", textAlign: "center" }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.8rem",
              color: "#b8b0a6",
              letterSpacing: "0.02em",
            }}
          >
            clockwork.cards
          </span>
        </div>

        {/* Hero */}
        <div style={{ padding: "56px 0 40px", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 7vw, 3.2rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#2a2420",
              marginBottom: 16,
            }}
          >
            A birthday card that never stops counting
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              fontWeight: 300,
              lineHeight: 1.55,
              color: "#8a8279",
              maxWidth: 380,
              margin: "0 auto",
            }}
          >
            Heartbeats, miles through space, seconds alive — a permanent URL that updates in real time.
          </p>
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#b5650a",
              marginTop: 14,
            }}
          >
            From $2.99
          </span>
        </div>

        {/* Builder */}
        <div style={{ paddingBottom: 16 }}>
          {/* Name input */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="name-input"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#8a8279",
                marginBottom: 8,
                letterSpacing: "0.02em",
              }}
            >
              Pick your URL
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                border: `1.5px solid ${
                  status === "available" ? "#2d7a44"
                  : status === "taken" || status === "reserved" || status === "invalid" ? "#b83a2e"
                  : "#e0d8ce"
                }`,
                borderRadius: 14,
                padding: "0 16px",
                height: 56,
                boxShadow:
                  status === "available" ? "0 0 0 3px rgba(45, 122, 68, 0.08)"
                  : status === "taken" || status === "reserved" || status === "invalid" ? "0 0 0 3px rgba(184, 58, 46, 0.08)"
                  : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.85rem",
                  color: "#b8b0a6",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                clockwork.cards/
              </span>
              <input
                id="name-input"
                type="text"
                placeholder="name"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={30}
                autoFocus
                value={nameValue}
                onChange={(e) => handleNameInput(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#2a2420",
                  padding: 0,
                  minWidth: 0,
                }}
              />
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                marginTop: 6,
                height: 20,
                display: "flex",
                alignItems: "center",
                gap: 4,
                color:
                  status === "available" ? "#2d7a44"
                  : status === "taken" || status === "reserved" || status === "invalid" || status === "too_short" ? "#b83a2e"
                  : "#8a8279",
              }}
            >
              {status === "checking" && <><span style={{ animation: "pulse 1s ease-in-out infinite" }}>•</span> Checking…</>}
              {status === "available" && "✓ Available"}
              {status === "taken" && "✗ Already taken"}
              {status === "reserved" && "✗ Reserved name"}
              {status === "invalid" && "✗ Letters, numbers, and hyphens only"}
              {status === "too_short" && "✗ At least 2 characters"}
            </div>
          </div>

          {/* DOB input */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="dob-input"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#8a8279",
                marginBottom: 8,
                letterSpacing: "0.02em",
              }}
            >
              When were they born?
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                border: "1.5px solid #e0d8ce",
                borderRadius: 14,
                padding: "0 16px",
                height: 56,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <input
                id="dob-input"
                type="date"
                min="1900-01-01"
                max={today}
                value={dobValue}
                onChange={(e) => onDobChange(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1rem",
                  color: "#2a2420",
                  padding: 0,
                }}
              />
            </div>
          </div>
        </div>

        {/* Buy CTA */}
        {isReady && (
          <div style={{ paddingBottom: 48 }}>
            <a
              href={checkoutUrl}
              style={{
                display: "block",
                width: "100%",
                padding: "16px 24px",
                background: "#b5650a",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 500,
                textAlign: "center",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#d4820a";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(181, 101, 10, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#b5650a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Get clockwork.cards/{nameValue} — $2.99
            </a>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: 14,
                fontSize: "0.75rem",
                color: "#b8b0a6",
              }}
            >
              <span>✓ One-time payment</span>
              <span>✓ No subscription</span>
              <span>✓ Lives forever</span>
            </div>
          </div>
        )}

        {/* Scroll hint */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: 32,
            fontSize: "0.82rem",
            color: "#b8b0a6",
          }}
        >
          ↓ Preview below
        </div>
      </div>
    </div>
  );
}

// ── "Get your own" CTA for owned cards ───────────────────────────
function GetYourOwn() {
  return (
    <div
      className="px-6 py-3 flex items-center justify-center gap-2 text-sm"
      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
    >
      <span>Make one for someone you love</span>
      <a
        href="/"
        style={{
          color: "var(--text-accent)",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Get your own →
      </a>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────
function App() {
  const params = card ? null : new URLSearchParams(window.location.search);
  const defaultName = card?.displayName ?? card?.name ?? params?.get("name") ?? process.env.DEFAULT_NAME ?? "Oscar";
  const defaultDob = card?.dob ?? params?.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-02-20";

  const [name, setName] = useState(defaultName);
  const [dob, setDob] = useState(defaultDob);
  const [mode, setMode] = useState<HeroMode>("off");
  const shinyOn = mode === "on" || mode === "broken";

  function toggleShiny() {
    if (mode === "broken") return;
    const next = mode === "off" ? "on" : "off";
    setMode(next);
    document.documentElement.classList.toggle("shiny", next === "on");
  }

  function breakGlass() {
    if (mode === "broken") return;
    if (mode === "off") {
      document.documentElement.classList.add("shiny");
    }
    setMode("broken");
  }

  const displayName = isOwned ? defaultName : (name || defaultName);
  const displayDob = isOwned ? defaultDob : (dob || defaultDob);

  return (
    <div>
      {/* Welcome mat for root visitors */}
      {!isOwned && (
        <WelcomeMat
          nameValue={name}
          dobValue={dob}
          onNameChange={setName}
          onDobChange={setDob}
        />
      )}

      {/* The card */}
      <div
        className="h-[90dvh] relative snap-section"
        style={{ background: mode === "off" ? "#fff" : "#0a0a0f", transition: "background-color 0.5s" }}
      >
        <Hero name={displayName} dob={displayDob} mode={mode} />

        {/* Top nav */}
        <nav className="absolute top-0 left-0 right-0 z-10 flex items-center px-6 py-4">
          <span
            className="text-sm font-medium"
            style={{
              color: mode === "off" ? "#71717a" : "#7a7a9a",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              transition: "color 0.5s",
            }}
          >
            clockwork.cards/{displayName.toLowerCase()}
          </span>
        </nav>

        {/* 🚨 CHAOS TOGGLE */}
        <div
          className="absolute top-3 z-10"
          style={{ right: 92 }}
        >
          <div
            className="select-none flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-500"
            style={{
              backgroundColor: mode === "broken"
                ? "rgba(41,37,36,0.85)"
                : mode === "off" ? "rgba(255,255,255,0.85)" : "rgba(30,10,10,0.85)",
              backdropFilter: "blur(8px)",
              border: mode === "broken"
                ? "1px solid #44403c"
                : mode === "off" ? "1px solid #e7e5e4" : "1px solid rgba(153,27,27,0.5)",
              boxShadow: mode === "broken"
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: mode === "broken"
                  ? "#57534e"
                  : mode === "off" ? "#dc2626" : "#fca5a5",
                transition: "color 0.5s",
              }}
            >🚫 Do not touch</span>
            <button
              onClick={mode !== "broken" ? breakGlass : undefined}
              className={`relative flex-shrink-0 transition-all duration-300 ${
                mode === "broken" ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: mode === "broken"
                  ? "#292524"
                  : mode === "off" ? "#78716c" : "#57534e",
                boxShadow: mode === "broken"
                  ? "inset 0 1px 3px rgba(0,0,0,0.4)"
                  : "inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)",
                border: mode === "broken"
                  ? "1px solid #44403c"
                  : "1px solid #a8a29e",
                transition: "all 0.5s",
              }}
            >
              <div
                className="absolute top-[2px] rounded-full shadow-md transition-all duration-500"
                style={{
                  width: 18,
                  height: 18,
                  left: mode === "broken" ? 23 : 2,
                  backgroundColor: mode === "broken" ? "#57534e" : "#e7e5e4",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        </div>

        {/* ⚡ SHINY TOGGLE */}
        <div className="fixed top-3 right-3 z-50">
          <div
            className={`select-none flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 ${
              mode === "broken" ? "opacity-50" : ""
            }`}
            style={{
              backgroundColor: shinyOn
                ? "rgba(30,20,0,0.85)"
                : "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              border: shinyOn
                ? "1px solid rgba(217,119,6,0.4)"
                : "1px solid #e7e5e4",
              boxShadow: shinyOn
                ? "0 0 16px rgba(245,158,11,0.3), 0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: shinyOn ? "#f59e0b" : "#d97706",
                transition: "color 0.3s",
              }}
            >✨ Shiny</span>
            <button
              onClick={toggleShiny}
              disabled={mode === "broken"}
              className={`relative transition-all duration-300 ${
                mode === "broken" ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: shinyOn ? "#f59e0b" : "#fbbf24",
                boxShadow: shinyOn
                  ? "0 0 10px rgba(245,158,11,0.5), inset 0 1px 2px rgba(255,255,255,0.2)"
                  : "0 0 6px rgba(251,191,36,0.4), inset 0 1px 2px rgba(255,255,255,0.15)",
                border: shinyOn
                  ? "1px solid #d97706"
                  : "1px solid #f59e0b",
                transition: "all 0.3s",
              }}
            >
              <div
                className="absolute top-[2px] rounded-full bg-white transition-all duration-300"
                style={{
                  width: 18,
                  height: 18,
                  left: shinyOn ? 23 : 2,
                  boxShadow: shinyOn
                    ? "0 1px 4px rgba(0,0,0,0.2), 0 0 6px rgba(245,158,11,0.3)"
                    : "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <Cards name={displayName} dob={displayDob} />
      {isOwned && <GetYourOwn />}
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
