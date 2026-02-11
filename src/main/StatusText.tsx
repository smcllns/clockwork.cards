import { useEffect, useState } from "react";
import { useTheme } from "../store/theme";

const MESSAGES = [
  "SYSTEM ONLINE",
  "BIOMETRIC SCAN COMPLETE",
  "ORBITAL TELEMETRY ACTIVE",
  "CARDIAC MONITOR LINKED",
  "ALL SYSTEMS NOMINAL",
];

export default function StatusText() {
  const shiny = useTheme(s => s.shiny);
  const [text, setText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!shiny) { setText(""); return; }

    const msg = MESSAGES[msgIndex];
    let charIndex = 0;
    setText("");

    const id = setInterval(() => {
      charIndex++;
      if (charIndex <= msg.length) {
        setText(msg.slice(0, charIndex));
      } else if (charIndex > msg.length + 30) {
        // pause then move to next
        setMsgIndex(i => (i + 1) % MESSAGES.length);
      }
    }, 60);

    return () => clearInterval(id);
  }, [shiny, msgIndex]);

  if (!shiny) return null;

  return (
    <div
      className="text-xs tracking-widest"
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--accent-1)",
        textShadow: "0 0 8px rgba(0, 255, 255, 0.5)",
        opacity: 0.7,
      }}
    >
      &gt; {text}<span className="animate-pulse">_</span>
    </div>
  );
}
