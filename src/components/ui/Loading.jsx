export const Loading = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-16 h-16 border-6 border-orange-400 border-dashed rounded-full animate-spin"></div>
      <span className="ml-3 text-orange-500 font-medium">Loading...</span>
    </div>
  );
};
