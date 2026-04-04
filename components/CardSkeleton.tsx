const CardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      
      <div className="aspect-square bg-gray-200 rounded-xl" />

      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />

        <div className="flex justify-between mt-3">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;