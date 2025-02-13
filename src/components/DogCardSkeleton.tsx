const DogCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-md rounded-lg overflow-hidden h-[380px] animate-pulse">
      <div className="skeleton h-48 w-full"></div>

      <div className="p-4">
        <div className="skeleton h-6 w-3/4 mb-2"></div>
        <div className="skeleton h-4 w-1/2 mb-3"></div>

        <div className="space-y-2">
          <div className="skeleton h-4 w-1/3"></div>
          <div className="skeleton h-4 w-1/2"></div>
        </div>

        <div className="skeleton h-10 w-full mt-4"></div>
      </div>
    </div>
  );
};

export default DogCardSkeleton;
