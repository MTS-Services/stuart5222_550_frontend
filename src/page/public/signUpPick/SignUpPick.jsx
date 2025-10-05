import { useEffect, useRef, useState } from "react";
import { StuartImage } from "../../../components/allStuartImage/StuartImage";
import { GiCheckMark } from "react-icons/gi";
import { BiErrorCircle } from "react-icons/bi";
import { PersonToPersonForm } from "./components/PersonToPersonForm";
import { Yoursafety } from "./components/Yoursafety";
import { UploadFile } from "./components/UploadFile";
import { TravelMode } from "./components/TravelMode";
import { postData } from "../../../utils/axiosInstance";
import { Form } from './components/Form';

export const SignUpPick = () => {
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [signUp, setSignUp] = useState([]);
  const [loading, setLoading] = useState(true);

  const plans = [
    {
      id: "monthly",
      title: "Monthly Plan",
      price: "$13 per month",
    },
    {
      id: "annual",
      title: "Annual Plan",
      price: "$120 per year",
    },
  ];

  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await postData(`requestuser.json`);
      setSignUp(data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-[#3B3B3D] min-h-screen text-white font-raleway">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <div className="text-center">
          <StuartImage />
          <h2 className="font-raleway font-bold md:text-[32px] text-xl">
            Sign Up and Pick your Plan
          </h2>
        </div>

        {/* Price Section */}
        <div className="border-t-2 border-[#F07400] rounded-lg bg-[#434343] p-6 md:mt-6 mt-4">
          <div className="bg-[#FFFFFF33] p-4 rounded-lg">
            <h2 className="text-[32px] font-semibold">
              $69/{" "}
              <span className="text-base font-semibold">Initial setup fee</span>
            </h2>
            <hr className="my-6 text-[#BFBFBF]" />

            {[
              "Delivery of cards",
              "Profile page setup & review",
              "Secure contact sharing",
              "50 unique QR code cards",
            ].map((item, index) => (
              <h3
                key={index}
                className="flex items-center gap-3 font-medium text-base my-3 first:mt-0"
              >
                <span className="rounded-lg p-2 bg-[#F07400] w-7 h-7 text-white flex items-center justify-center">
                  <GiCheckMark className="w-6 h-6 font-semibold" />
                </span>
                {item}
              </h3>
            ))}
          </div>
        </div>

        {/* Plus Section */}
        <div className="md:mt-8 mt-5">
          <h2 className="font-bold text-[28px] text-center">Plus</h2>
          <div className="flex items-center justify-center mt-4 mb-7 rounded-xl">
            <div className="flex md:flex-row gap-5 max-w-3xl w-full">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  role="radio"
                  aria-checked={selectedPlan === plan.id}
                  tabIndex={0}
                  onClick={() => setSelectedPlan(plan.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSelectedPlan(plan.id)
                  }
                  className={`flex-1 rounded-xl md:p-5 p-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(212,163,115,0.3)] ${
                    selectedPlan === plan.id
                      ? "border-2 border-[#ff8c42]"
                      : "border-2 border-[#d4a373]"
                  }`}
                >
                  <div className="flex sm:flex-row items-start sm:items-center gap-4">
                    {/* Custom Radio */}
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                        selectedPlan === plan.id
                          ? "border-[#ff8c42]"
                          : "border-[#d4a373]"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-[#ff8c42] transition-transform duration-200 ${
                          selectedPlan === plan.id ? "scale-100" : "scale-0"
                        }`}
                      />
                    </div>

                    {/* Plan Info */}
                    <div className="flex-1 font-raleway">
                      <div className="text-white text-base font-bold mb-1">
                        {plan.title}
                      </div>
                      <div className="text-white text-sm font-normal">
                        {plan.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
          >
            Payment method
          </button>
        </div>

        {/* Form */}
        <Form />

        {/* Travel Mode */}
        <TravelMode />

        {/* Add Images */}
        <div className="my-10 font-raleway">
          <h2 className="font-medium text-xl">Add Images</h2>
          <div className="px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-6">
            <BiErrorCircle className="w-10 h-10 text-[#FF5E00]" />
            <p className="font-normal text-base">
              One showing eyes, one showing a toothy grin and one showing full
              body. Be classy, not trashy. No nudes. G or PG rated photos only.
            </p>
          </div>
        </div>

        {/* Upload File or Image */}
        <UploadFile
          handleClick={handleClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          files={files}
        />

        {/* Your safety */}
        <Yoursafety />

        {/* Person To PersonForm */}
        <PersonToPersonForm />
      </div>
    </div>
  );
};
