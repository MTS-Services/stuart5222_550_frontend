export const Bio = ({
  type,
  image,
  title,
  email,
  number,
  age,
  height,
  bodyType,
  deal,
  paragraph1,
  paragraph2,
  paragraph3,
}) => {
  return (
    <div className="bg-white rounded-sm p-4">
      <h2 className="text-2xl text-[#002244] font-semibold font-poppins">
        {type}
      </h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[80px] h-[80px]">
            <img
              className="rounded-full bg-cover object-cover"
              src={image}
              alt=""
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="">
              <h3 className="text-base text-[#252525] font-poppins font-medium">
                {title}
              </h3>
              <p className="text-[#242424] font-lato font-normal text-sm my-1.5">
                {email}
              </p>
              <p className="text-[#464646] text-xs font-lato font-normal">
                {number}
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <p className="text-[#404040] font-lato font-medium text-xs">
            Age: {age}
          </p>
          <p className="text-[#404040] font-lato font-medium text-xs my-1.5">
            Height: {height}
          </p>
          <p className="text-[#404040] font-lato font-medium text-xs">
            Body type: {bodyType}
          </p>
          <p className="text-[#404040] font-lato font-medium text-xs my-1.5">
            Dealbreakers: {deal}
          </p>
        </div>
      </div>
      <div className="">
        <h2 className="text-black font-raleway text-2xl font-semibold my-4">
          Bio
        </h2>
        <p className="text-base font-raleway text-black font-normal">
          {paragraph1}
        </p>
        <p className="text-base font-raleway text-black font-normal">
          {paragraph2}
        </p>
        <p className="text-base font-raleway text-black font-normal">
          {paragraph3}
        </p>
      </div>
    </div>
  );
};
