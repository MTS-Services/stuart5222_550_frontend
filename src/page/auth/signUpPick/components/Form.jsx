import { BiErrorCircle } from "react-icons/bi";

export const Form = () => {
  return (
    <div className="md:my-20 my-10">
      <div className="self-stretch flex flex-col gap-2">
        <label className="text-white text-xl font-medium">Name</label>
        <input
          type="text"
          placeholder="Enter Display Name"
          className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
        />
      </div>
      <div className="self-stretch flex flex-col gap-2 my-5">
        <label className="text-white text-xl font-medium">Age</label>
        <input
          type="text"
          placeholder="Enter your date of birth"
          className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
        />
        <p className="text-xs font-normal text-[#BEBEBE] font-raleway w-[350px] my-2">
          (We only store your month and year of birth which will calculate your
          age as of the 28th of your birth month.)
        </p>
        <p className="text-xs font-normal text-[#BEBEBE] font-raleway w-[350px] md:mb-2 mb-1 flex items-center gap-2">
          <BiErrorCircle className="text-[#FF5E00] w-5 h-5" />
          Must be 18 or older
        </p>
      </div>

      <div className="flex items-center gap-4 w-full my-5">
        <div className="self-stretch flex flex-col gap-2 w-full">
          <label className="text-white text-xl font-medium ">Height</label>
          <input
            type="text"
            placeholder="Enter your Height"
            className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
          />
        </div>
        <div className="self-stretch flex flex-col gap-2 w-full">
          <label className="text-white text-xl font-medium">Body Type</label>
          <input
            type="text"
            placeholder="Describe your body type"
            className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
          />
        </div>
      </div>
      <div className="self-stretch flex flex-col gap-2 w-full">
        <label className="text-white text-xl font-medium">Area</label>
        <input
          type="text"
          placeholder="Enter your country and state "
          className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
        />
      </div>
      <div className="self-stretch flex flex-col gap-2 w-full my-5">
        <label className="text-white text-xl font-medium">Dealbreakers</label>
        <input
          type="text"
          placeholder="Enter your no go’s "
          className="h-11 px-3 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
        />
      </div>
      <div className="self-stretch flex flex-col gap-2 w-full my-5">
        <label className="text-white text-xl font-medium mb-1">
          Tell ‘em About You
        </label>
        <textarea
          id="message"
          rows="5"
          placeholder="Write your message here..."
          className="w-full max-h-[265px] min-h-[265px] px-3 pt-1 bg-transparent text-white placeholder:text-[#BEBEBE] border border-[#ACACAC] text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
        />
      </div>
    </div>
  );
};
