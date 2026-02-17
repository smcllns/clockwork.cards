// © line
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-center py-8 text-sm"
      style={{
        color: 'var(--text-muted)',
        backgroundColor: 'var(--section-bg)',
      }}
    >
      © {year} Clockwork Cards
    </footer>
  );
}
