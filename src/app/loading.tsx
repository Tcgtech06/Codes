export default function Loading() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] animate-pulse bg-gray-50 p-4 md:p-8 flex flex-col gap-8">
      {/* Hero Skeleton */}
      <div className="w-full md:max-w-7xl mx-auto rounded-xl bg-gray-200 aspect-video md:aspect-[21/9]"></div>
      
      {/* Content Skeleton */}
      <div className="w-full md:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
      
      {/* List Skeleton */}
      <div className="w-full md:max-w-7xl mx-auto space-y-4 mt-4">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-5/6"></div>
      </div>
    </div>
  );
}
