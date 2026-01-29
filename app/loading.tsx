export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-stone-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-stone-500 mt-4">Calculating numbers...</p>
      </div>
    </div>
  )
}
