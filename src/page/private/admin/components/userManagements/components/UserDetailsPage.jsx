import { useEffect, useState } from "react";
import { Loading } from "../../../../../../components/ui/loading";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
import { postData } from "../../../../../../utils/axiosInstance";
import { FaRegCalendar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

export const UserDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [textArea, setTextArea] = useState("");
  const data = useLoaderData();
  console.log(data);

  // when loader data available, stop loading
  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  // ======= HANDLE FEEDBACK SUBMIT =======
  const handleSend = async (e) => {
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

      const response = await postData(`feedback`, payload);
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

  const {
    avatar,
    name,
    email,
    number,
    age,
    height,
    bodyType,
    dealBreaks,
    bio,
    images,
    startDate,
    endDate,
    location,
  } = data;

  // ======= RENDER UI =======
  return (
    <div className="md:p-8 p-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* ========= USER INFO ========= */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[80px] h-[80px]">
                <img
                  className="rounded-full bg-cover object-cover"
                  src={avatar || "/img/page/admin/Image-80.png"}
                  alt=""
                />
              </div>
              <div>
                <h3 className="text-base text-[#252525] font-medium">
                  {name || "Unknown User"}
                </h3>
                <p className="text-[#242424] font-normal text-sm my-1.5">
                  {email || "No email provided"}
                </p>
                <p className="text-[#464646] text-xs font-normal">
                  {number || "(No phone)"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#404040] font-medium text-xs">
                Age: {age || "N/A"}
              </p>
              <p className="text-[#404040] font-medium text-xs my-1.5">
                Height: {height || "N/A"}
              </p>
              <p className="text-[#404040] font-medium text-xs">
                Body type: {bodyType || "N/A"}
              </p>
              <p className="text-[#404040] font-medium text-xs my-1.5">
                Dealbreakers: {dealBreaks || "N/A"}
              </p>
            </div>
          </div>

          {/* ========= REST OF YOUR UI (UNCHANGED) ========= */}
          {/* === Bio, Travel, Images, Feedback Form — same as your original === */}

          <div className="font-raleway">
            <h2 className="text-black text-2xl font-semibold my-4">Bio</h2>
            <p className="text-base text-black font-normal">
              {bio ||
                "Hi, I’m Cheryl Ann — 56 years young, standing tall at 5’7” with a naturally curvy figure..."}
            </p>
          </div>

          {/* traveling card */}
          <div className="flex justify-center items-center text-center w-full">
            <div className="relative w-full my-6 rounded-2xl p-8 shadow-lg bg-gradient-to-b from-orange-200 via-amber-50 to-yellow-50 overflow-hidden">
              {/* Gradient border overlay */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none border-t-4 border-l-4 border-r-4 border-transparent"
                style={{
                  borderImage:
                    "linear-gradient(to bottom, #FED7AA, #FEF3C7, #FEF9C3) 1",
                }}
              ></div>

              {/* Content */}
              <h2 className="md:text-xl text-lg font-bold text-start text-gray-900 mb-[21px]">
                I am traveling and will be in:
              </h2>

              <div className="space-y-4">
                <div className="">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-600 mt-0.5">
                      <FaRegCalendar />
                    </span>
                    <div className="flex gap-2 font-medium md:text-xl text-lg text-black">
                      Start-Date: {startDate}
                    </div>
                  </div>
                  <div className="flex gap-2 font-medium md:text-xl text-lg text-black ml-8">
                    End-Date: {endDate}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-xl mt-0.5">
                    <GrLocation />
                  </span>
                  <div className="flex gap-2 font-medium md:text-xl text-lg text-black">
                    Location: {location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========= IMAGE GALLERY ========= */}
          <div>
            <h3 className="text-2xl text-[#252525] font-raleway font-semibold mb-5">
              Images
            </h3>
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-6">
              {images.map((img) => (
                <div key={img.name} className="overflow-hidden rounded-lg">
                  <img
                    src={img.data} // ✅ Use 'img.data' which contains the full Data URL
                    alt={`Image ${img.name}`}
                    className="w-full h-full object-cover bg-yellow-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ========= FEEDBACK FORM ========= */}
          <div className="p-4 border border-gray-100 bg-white rounded-lg my-6 font-raleway">
            <h3 className="text-xl text-[#252525] font-medium mb-4">
              Cancel With Feedback.
            </h3>
            <form onSubmit={handleSend}>
              <textarea
                name="textArea"
                value={textArea}
                onChange={(e) => setTextArea(e.target.value)}
                className="w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300"
                placeholder="Write a review message here..."
              />
              <button
                type="submit"
                className="bg-[#FF8C00] text-black w-full py-2 rounded-[4px] mb-6"
              >
                Send
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
        </>
      )}
    </div>
  );
};
