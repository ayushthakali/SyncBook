export function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
      <div className="h-6 bg-white/10 rounded w-1/4" />
    </div>
  );
}
