interface NavProps {
  shiny: boolean;
  onToggleShiny: () => void;
}

// Fixed top bar with cyberpunk toggle
export function Nav({ shiny, onToggleShiny }: NavProps) {
  return (
    <nav
      className="fixed top-0 right-0 z-50 p-4"
      style={{
        color: 'var(--text)',
      }}
    >
      <button
        onClick={onToggleShiny}
        className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all"
        style={{
          backgroundColor: shiny ? 'var(--accent)' : `color-mix(in srgb, var(--accent) 15%, transparent)`,
          color: shiny ? '#0a0a0f' : 'var(--accent)',
          border: `2px solid ${shiny ? 'transparent' : 'var(--accent)'}`,
        }}
      >
        <span>✨</span>
        <span>Cyberpunk</span>
      </button>
    </nav>
  );
}
