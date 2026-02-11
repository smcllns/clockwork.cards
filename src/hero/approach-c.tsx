import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { getTextPixels, birthdayLines } from "./font";
import { setupMultiGrab } from "./multi-grab";
import { LIGHT, SHINY } from "./colors";
import { useTheme } from "../store/theme";

export default function ApproachC({ name, age }: { name: string; age: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const constraintsRef = useRef<Matter.Constraint[]>([]);
  const anchorsRef = useRef<Matter.Constraint[]>([]);
  const colorIndicesRef = useRef<number[]>([]);
  const shinyRef = useRef<boolean>(false);
  const bgColorRef = useRef<string>("#fffbeb");
  const [chaos, setChaos] = useState(false);
  const shiny = useTheme(s => s.shiny);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 }, enableSleeping: true });
    engineRef.current = engine;

    const t = 50;
    Matter.Composite.add(engine.world, [
      Matter.Bodies.rectangle(w / 2, -t / 2, w, t, { isStatic: true }),
      Matter.Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, { isStatic: true }),
      Matter.Bodies.rectangle(-t / 2, h / 2, t, h, { isStatic: true }),
      Matter.Bodies.rectangle(w + t / 2, h / 2, t, h, { isStatic: true }),
    ]);

    const pixels = getTextPixels(birthdayLines(name, age), w, h);

    // Create dynamic circles (no gravity, held by constraints)
    const bodies: Matter.Body[] = [];
    const bodyMap = new Map<string, { body: Matter.Body; pixel: typeof pixels[0] }>();
    const colorIndices: number[] = [];

    for (const p of pixels) {
      const colorIdx = Math.floor(Math.random() * LIGHT.css.length);
      const color = LIGHT.css[colorIdx];
      const r = p.radius * (0.7 + Math.random() * 0.6);
      const body = Matter.Bodies.circle(p.x, p.y, r, {
        frictionAir: 0.01,
        restitution: 0.3,
        friction: 0.5,
        render: { fillStyle: color },
      });
      bodies.push(body);
      colorIndices.push(colorIdx);
      bodyMap.set(`${p.letter}-${p.gridRow}-${p.gridCol}`, { body, pixel: p });
    }
    bodiesRef.current = bodies;
    colorIndicesRef.current = colorIndices;
    Matter.Composite.add(engine.world, bodies);

    const anchors: Matter.Constraint[] = [];
    for (const body of bodies) {
      anchors.push(Matter.Constraint.create({
        bodyA: body,
        pointB: { x: body.position.x, y: body.position.y },
        stiffness: 0.05,
        damping: 0.1,
        length: 0,
        render: { visible: false },
      }));
    }
    anchorsRef.current = anchors;
    Matter.Composite.add(engine.world, anchors);

    // Constraints between adjacent pixels within each letter
    const constraints: Matter.Constraint[] = [];
    for (const [, { body: bodyA, pixel: pA }] of bodyMap) {
      for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]] as [number, number][]) {
        const neighbor = bodyMap.get(`${pA.letter}-${pA.gridRow + dr}-${pA.gridCol + dc}`);
        if (!neighbor) continue;
        const dx = pA.x - neighbor.pixel.x;
        const dy = pA.y - neighbor.pixel.y;
        constraints.push(Matter.Constraint.create({
          bodyA,
          bodyB: neighbor.body,
          length: Math.sqrt(dx * dx + dy * dy),
          stiffness: 0.6,
          damping: 0.1,
          render: { visible: false },
        }));
      }
    }
    constraintsRef.current = constraints;
    Matter.Composite.add(engine.world, constraints);

    setupMultiGrab(canvas, engine, () => bodies);

    const ctx = canvas.getContext("2d")!;
    let frame: number;
    const startTime = performance.now();

    function draw() {
      const elapsed = (performance.now() - startTime) / 1000;
      Matter.Engine.update(engine, 1000 / 60);
      ctx.fillStyle = bgColorRef.current;
      ctx.fillRect(0, 0, w, h);

      if (shinyRef.current) {
        // heavy glow pass
        ctx.globalAlpha = 1;
        for (const body of bodies) {
          const fillColor = (body.render as any).fillStyle;
          const r = body.circleRadius!;
          ctx.shadowBlur = 24;
          ctx.shadowColor = fillColor;
          ctx.fillStyle = fillColor;
          ctx.beginPath();
          ctx.arc(body.position.x, body.position.y, r, 0, Math.PI * 2);
          ctx.fill();
          // second glow pass
          ctx.beginPath();
          ctx.arc(body.position.x, body.position.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      } else {
        // light mode — radial gradient fills with drop shadow
        ctx.shadowColor = "rgba(0,0,0,0.12)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        for (const body of bodies) {
          const fillColor = (body.render as any).fillStyle;
          const r = body.circleRadius!;
          const x = body.position.x;
          const y = body.position.y;
          const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.4, fillColor);
          grad.addColorStop(1, fillColor);
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
          // subtle outline
          ctx.globalAlpha = 0.25;
          ctx.strokeStyle = fillColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
      }

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(frame); Matter.Engine.clear(engine); };
  }, []);

  useEffect(() => {
    const palette = shiny ? SHINY : LIGHT;
    shinyRef.current = shiny;
    bgColorRef.current = shiny ? "#0a0a0f" : "#fffbeb";

    const bodies = bodiesRef.current;
    const indices = colorIndicesRef.current;
    for (let i = 0; i < bodies.length; i++) {
      (bodies[i].render as any).fillStyle = palette.css[indices[i]];
    }
  }, [shiny]);

  function unleashChaos() {
    const engine = engineRef.current;
    if (!engine) return;
    setChaos(true);
    engine.gravity.y = 2;
    for (const body of bodiesRef.current) Matter.Sleeping.set(body, false);
    for (const c of [...constraintsRef.current, ...anchorsRef.current]) {
      Matter.Composite.remove(engine.world, c);
    }
    for (const body of bodiesRef.current) {
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 5,
      });
    }
  }

  return (
    <section ref={containerRef} className="h-dvh relative overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
      <nav className="relative z-10 flex items-center px-6 py-4">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>clockwork.cards/{name.toLowerCase()}</span>
        <div className="ml-auto flex gap-2">
          {["d", "c"].map(v => (
            <a key={v} href={`?hero=${v}`} className={`text-xs px-2 py-1 rounded ${v === "c" ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-600"}`}>{v.toUpperCase()}</a>
          ))}
        </div>
      </nav>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {!chaos && (
        <button onClick={unleashChaos} className="absolute bottom-6 right-6 z-10 bg-red-400 hover:bg-red-500 text-white text-xs px-4 py-2 rounded-full shadow-lg transition-colors cursor-pointer">
          do not press this button
        </button>
      )}
    </section>
  );
}
