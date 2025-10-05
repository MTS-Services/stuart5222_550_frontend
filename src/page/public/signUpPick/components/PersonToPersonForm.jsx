
export const PersonToPersonForm = () => {
  return (
   <div className="bg-[#434343] px-4 py-8 rounded-lg my-12">
          <div className="max-w-[330px]  mx-auto">
            <h2 className="font-semibold text-xl mb-4">
              Person to person dating, but with a safer approach.
            </h2>
            <p className="font-normal text-base">
              This is your “safe share” zone – just the details you choose to
              pass along.
            </p>
          </div>
          <div className="mt-6 max-w-[340px] mx-auto">
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-white text-base font-semibold">Name</label>
              <input
                type="text"
                placeholder="Enter your display name"
                className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="self-stretch flex flex-col gap-2 mt-6">
              <label className="text-white text-base font-semibold">
                E-mail
              </label>
              <input
                type="text"
                placeholder="Enter your unique email"
                className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="md:my-8 my-4">
              <h2 className="text-base font-semibold text-center">and/or</h2>
            </div>
            <div className="self-stretch flex flex-col gap-2">
              <label className="text-white text-base font-semibold">
                Phone number
              </label>
              <input
                type="text"
                placeholder="Enter your dedicated phone number"
                className="h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
            >
              Submit for Review
            </button>
          </div>
        </div>
  )
}
