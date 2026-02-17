import { useEffect, useRef, useState } from 'react';
import { HeroScene, SceneMode } from './scene';

interface HeroCyberpunkProps {
  name: string;
  dob: Date;
  shiny: boolean;
}

// Component (name, dob, shiny props). Owns chaos state.
export function HeroCyberpunk({ name, dob, shiny }: HeroCyberpunkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const [chaos, setChaos] = useState(false);
  const [mode, setMode] = useState<SceneMode>('off');

  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new HeroScene({
      canvas: canvasRef.current,
      name,
      dob,
      onModeChange: setMode,
    });

    scene.init();
    sceneRef.current = scene;

    // Handle resize
    const handleResize = () => {
      scene.handleResize();
    };

    window.addEventListener('resize', handleResize);

    // Intersection observer to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Resume animation
          } else {
            // Pause animation (could be implemented in scene)
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(canvasRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      scene.destroy();
    };
  }, [name, dob]);

  // Update mode based on shiny and chaos
  useEffect(() => {
    if (!sceneRef.current) return;

    let newMode: SceneMode;

    if (shiny && chaos) {
      newMode = 'broken';
    } else if (shiny && !chaos) {
      newMode = 'on';
    } else if (!shiny && chaos) {
      newMode = 'broken-off';
    } else {
      newMode = 'off';
    }

    sceneRef.current.setMode(newMode);
  }, [shiny, chaos]);

  const handleChaosToggle = () => {
    if (!chaos) {
      setChaos(true);
      // Once chaos is triggered, it's permanent (toggle goes dead)
    }
  };

  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center"
      style={{ backgroundColor: 'var(--section-bg)' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-[100dvh]"
        style={{ display: 'block' }}
      />

      {/* "Do not touch" button - only visible when shiny is on */}
      {shiny && !chaos && (
        <button
          onClick={handleChaosToggle}
          className="absolute bottom-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all"
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            border: '2px solid #b91c1c',
          }}
        >
          <span>🚫</span>
          <span>Do not touch</span>
        </button>
      )}

      {/* Dead toggle after chaos is triggered */}
      {chaos && (
        <div
          className="absolute bottom-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full font-medium opacity-30"
          style={{
            backgroundColor: '#6b7280',
            color: '#9ca3af',
            border: '2px solid #4b5563',
          }}
        >
          <span>🚫</span>
          <span>Do not touch</span>
        </div>
      )}
    </section>
  );
}
