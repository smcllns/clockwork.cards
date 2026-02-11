export default function Main({ name, dob }: { name: string; dob: string }) {
  return (
    <section className="flex-1 bg-sky-100 flex items-center justify-center p-6">
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-200 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
          <span className="text-lg font-semibold text-zinc-700">Widget 1</span>
        </div>
        <div className="bg-emerald-200 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
          <span className="text-lg font-semibold text-zinc-700">Widget 2</span>
        </div>
        <div className="bg-emerald-200 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
          <span className="text-lg font-semibold text-zinc-700">Widget 3</span>
        </div>
      </div>
    </section>
  );
}
