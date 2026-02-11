import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8C471", "#82E0AA", "#F1948A", "#AED6F1", "#D7BDE2",
];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function Hero({ name, dob }: { name: string; dob: string }) {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const [chaos, setChaos] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;

    const walls = [
      Matter.Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
      Matter.Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }),
    ];
    Matter.Composite.add(engine.world, walls);

    const bodies: Matter.Body[] = [];
    for (let i = 0; i < 45; i++) {
      const x = 60 + Math.random() * (width - 120);
      const y = 60 + Math.random() * (height - 120);
      const color = randomColor();

      const body = Math.random() > 0.4
        ? Matter.Bodies.circle(x, y, 12 + Math.random() * 22, {
            isStatic: true,
            render: { fillStyle: color },
            restitution: 0.6,
            friction: 0.1,
          })
        : Matter.Bodies.rectangle(x, y, 18 + Math.random() * 28, 18 + Math.random() * 28, {
            isStatic: true,
            angle: Math.random() * Math.PI * 2,
            render: { fillStyle: color },
            restitution: 0.6,
            friction: 0.1,
          });
      bodies.push(body);
    }
    bodiesRef.current = bodies;
    Matter.Composite.add(engine.world, bodies);

    const ctx = canvas.getContext("2d")!;
    let frame: number;

    function draw() {
      Matter.Engine.update(engine, 1000 / 60);
      ctx.clearRect(0, 0, width, height);

      for (const body of bodies) {
        ctx.save();
        ctx.fillStyle = (body.render as any).fillStyle || "#ccc";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();

        if (body.circleRadius) {
          ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
        } else {
          const v = body.vertices;
          ctx.moveTo(v[0].x, v[0].y);
          for (let j = 1; j < v.length; j++) ctx.lineTo(v[j].x, v[j].y);
          ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(frame);
      Matter.Engine.clear(engine);
    };
  }, []);

  function unleashChaos() {
    const engine = engineRef.current;
    if (!engine) return;
    setChaos(true);
    engine.gravity.y = 1;
    for (const body of bodiesRef.current) {
      Matter.Body.setStatic(body, false);
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 4,
      });
    }
  }

  return (
    <section ref={containerRef} className="h-dvh flex flex-col relative overflow-hidden bg-amber-50">
      <nav className="relative z-10 flex items-center px-6 py-4">
        <span className="text-sm font-medium text-zinc-400">clockwork.cards/{name.toLowerCase()}</span>
      </nav>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="flex-1 flex items-center justify-center relative z-10 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 text-center px-6 drop-shadow-sm">
          Happy {age}th Birthday {name}
        </h1>
      </div>

      {!chaos && (
        <button
          onClick={unleashChaos}
          className="absolute bottom-6 right-6 z-10 bg-red-400 hover:bg-red-500 text-white text-xs px-4 py-2 rounded-full shadow-lg transition-colors cursor-pointer"
        >
          do not press this button
        </button>
      )}
    </section>
  );
}
