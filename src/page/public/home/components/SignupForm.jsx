export default function SignupForm() {
  return (
    <div className="inline-flex h-[471px] w-96 flex-col items-center justify-center gap-6 rounded-lg bg-neutral-700 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-start gap-4 self-stretch">
        <h2 className="self-stretch text-center text-xl font-bold text-white">
          <span className="capitalize">P</span>
          <span className="lowercase">
            erson to person dating, but with a safer approach.
          </span>
        </h2>
      </div>

      {/* Form */}
      <form className="flex w-80 flex-col items-start justify-start gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2 self-stretch">
          <label className="text-base font-semibold text-white">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-neutral-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 self-stretch">
          <label className="text-base font-semibold text-white">E-mail</label>
          <input
            type="email"
            placeholder="Enter your e-mail"
            className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-neutral-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2 self-stretch">
          <label className="text-base font-semibold text-white">
            Phone number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-neutral-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-orange-500 p-2.5 text-base font-semibold text-white transition hover:bg-orange-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
