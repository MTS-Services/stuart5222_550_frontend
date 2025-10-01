export const ScanSection = () => {
  return (
    <div className="w-96 h-[505px] px-4 py-8 bg-neutral-700 rounded-lg inline-flex flex-col justify-center items-center gap-10">
      {/* Header */}
      <div className="self-stretch flex flex-col justify-start items-center gap-4">
        <h1 className="self-stretch text-center text-white text-3xl font-bold capitalize">
          Scan Me Maybe?
        </h1>
        <p className="self-stretch text-center text-white text-base font-medium capitalize">
          Real connections through real cards. Get your personalized QR dating
          cards and let serendipity do the rest.
        </p>
      </div>

      {/* Form */}
      <form className="w-80 flex flex-col justify-start items-start gap-6">
        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          className="w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="E-mail"
          className="w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
        >
          Join the waitlist
        </button>
      </form>
    </div>
  );
};
