import { FaRegCalendar } from "react-icons/fa";
import { Bio } from "./Bio";
import { GrLocation } from "react-icons/gr";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { postData } from "../../../../../../utils/axiosInstance";
import { useState } from "react";

export const EditResponse = () => {
  const [loading, setLoading] = useState(false);
  const [textArea, setTextArea] = useState("");
  const data = useLoaderData();

  const {
    name,
    email,
    number,
    age,
    height,
    bodyType,
    dealBreaks,
    bio,
    images,
    endDate,
    location,
  } = data;

  const handleFeedback = async (e) => {
    e.preventDefault();

    if (!textArea.trim()) {
      toast.warn("Please enter feedback before sending.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId: data?._id,
        feedback: textArea,
      };

      console.log("Sending feedback payload:", payload);

      const response = await postData("feedback", payload); // make sure endpoint matches backend
      console.log("Server response:", response);

      toast.success("Feedback sent successfully!");
      setTextArea("");
    } catch (err) {
      console.error("Failed to send feedback:", err);
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black p-8 font-raleway">
      {/* Before Bio */}
      <div>
        <Bio
          type={"Before"}
          image={"/img/page/admin/Image-80.png"}
          title={name}
          email={email}
          number={number}
          age={age}
          height={height}
          bodyType={bodyType}
          deal={dealBreaks}
          paragraph1={bio}
        />
      </div>

      {/* After Bio */}
      <div className="my-8">
        <Bio
          type={"After"}
          image={"/img/page/admin/Image-80.png"}
          title={"Albert Flores"}
          email={"albertflores@gmail.com"}
          number={"(319) 555-0115"}
          age={"56"}
          height={"5’7"}
          bodyType={"Curvy"}
          deal={"Smokers"}
          paragraph1={
            "Hi, I’m Cheryl Ann — 56 years young, standing tall at 5’7” with a naturally curvy figure. I’m a warm, down-to-earth woman who values kindness, honesty, and meaningful connections over superficial small talk. I love spending my time with people who can make me laugh, share their passions, and hold deep, genuine conversations that go beyond the surface."
          }
          paragraph2={
            "I enjoy cozy coffee dates, spontaneous weekend getaways, and evenings filled with good food and even better company. I’m looking to meet someone authentic and emotionally mature — someone who’s ready to build something real, not just swipe endlessly."
          }
          paragraph3={
            "Smoking is a no-go for me. If you’re open-minded, kind-hearted, and know what you want, we might just get along beautifully."
          }
        />
      </div>

      {/* Travel Info */}
      <div className="relative my-6 rounded-2xl p-8 shadow-lg bg-gradient-to-b from-orange-200 via-amber-100 to-yellow-50 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none border-t-4 border-l-4 border-r-4 border-transparent"
          style={{
            borderImage:
              "linear-gradient(to bottom, #FED7AA, #FEF3C7, #FEF9C3) 1",
          }}
        ></div>

        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          I am traveling and will be in:
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-orange-600 text-xl mt-0.5">
              <GrLocation />
            </span>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-900">Location:</span>
              <span className="text-gray-900">{location}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-orange-600 text-xl mt-0.5">
              <FaRegCalendar />
            </span>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-900">End-Date:</span>
              <span className="text-gray-900">{endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image and Feedback Section */}
      <div>
        <h3 className="text-2xl text-[#252525] font-semibold mb-5">Images</h3>
        <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-6">
          {Array.isArray(images) &&
            images.map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg">
                <img
                  src={img?.data || "/img/default.png"}
                  alt={`Image ${img?.name || idx}`}
                  className="w-full h-full object-cover bg-yellow-200"
                />
              </div>
            ))}
        </div>

        {/* Feedback form */}
        <div className="p-4 border border-gray-100 bg-white rounded-lg my-6">
          <h3 className="text-xl text-[#252525] font-medium mb-4">
            Cancel With Feedback.
          </h3>
          <form onSubmit={handleFeedback}>
            <textarea
              type="text"
              name="textArea"
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
              className="w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300"
              placeholder="Write a review message here..."
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#FF8C00] text-black w-full py-2 rounded-[4px] mb-6 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>

          <div className="md:flex items-center gap-4 space-y-6 sm:space-y-0 md:w-[50%]">
            <button className="bg-[#1BA400] text-white w-full py-2 rounded-[4px]">
              Approved
            </button>
            <button className="bg-[#FF8C00] text-black w-full py-2 rounded-[4px]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
