import { IoMdArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export const Oops = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen font-raleway flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/page/image.jpg')" }}
      ></div>

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative text-white flex flex-col items-center w-full max-w-[600px] px-4">
        {/* Back button aligned to left */}
        <h3
          className="flex items-center gap-2 mb-3 cursor-pointer self-start"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowBack /> Back
        </h3>

        <div className="text-center mt-10 w-full">
          <h2 className="font-medium text-[100px]">Oops!</h2>
          <p className="text-lg font-normal text-[#E4EEF0] my-4">
            You can only scan this card 5 times. Sorry, you missed your shot.
          </p>
          <Link to={`/`}>
            <button
              type="submit"
              className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
            >
              Back to website
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
