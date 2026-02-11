export default function Hero({ name, dob }: { name: string; dob: string }) {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <section className="h-dvh flex flex-col bg-amber-100">
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-medium text-zinc-500">clockwork.cards/{name.toLowerCase()}</span>
      </nav>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 text-center px-6">
          Happy {age}th Birthday {name}
        </h1>
      </div>
    </section>
  );
}
