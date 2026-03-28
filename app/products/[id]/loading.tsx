export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">

        <div className="w-full aspect-square bg-gray-200 rounded-2xl" />

        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
        </div>

      </div>
    </main>
  );
}