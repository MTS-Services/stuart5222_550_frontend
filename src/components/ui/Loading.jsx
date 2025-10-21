const Loading = () => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50'>
      {/* Spinner */}
      <div className='w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin'></div>

      {/* Text */}
      <span className='mt-4 text-orange-500 text-lg font-semibold tracking-wide'>
        Loading...
      </span>
    </div>
  );
};

export default Loading;
