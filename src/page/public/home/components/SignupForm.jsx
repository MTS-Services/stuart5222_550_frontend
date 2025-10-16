export default function SignupForm() {
  return (
    <div className='w-96 h-[471px] px-4 py-8 bg-neutral-700 rounded-lg inline-flex flex-col justify-center items-center gap-6'>
      {/* Header */}
      <div className='self-stretch flex flex-col justify-start items-center gap-4'>
        <h2 className='self-stretch text-center text-white text-xl font-bold'>
          <span className='capitalize'>P</span>
          <span className='lowercase'>
            erson to person dating, but with a safer approach.
          </span>
        </h2>
      </div>

      {/* Form */}
      <form className='w-80 flex flex-col justify-start items-start gap-6'>
        {/* Name */}
        <div className='self-stretch flex flex-col gap-2'>
          <label className='text-white text-base font-semibold'>Name</label>
          <input
            type='text'
            placeholder='Enter your name'
            className='h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
          />
        </div>

        {/* Email */}
        <div className='self-stretch flex flex-col gap-2'>
          <label className='text-white text-base font-semibold'>E-mail</label>
          <input
            type='email'
            placeholder='Enter your e-mail'
            className='h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
          />
        </div>

        {/* Phone Number */}
        <div className='self-stretch flex flex-col gap-2'>
          <label className='text-white text-base font-semibold'>
            Phone number
          </label>
          <input
            type='tel'
            placeholder='Enter your phone number'
            className='h-11 px-3 bg-white text-neutral-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition'
        >
          Submit
        </button>
      </form>
    </div>
  );
}
