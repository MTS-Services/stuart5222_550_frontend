import { useEffect } from "react";
import { BsCheck } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { qrCodeRequest } from "../../../features/public/QR-code/qrCodeFetch";

const WelcomeScanView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Get QR code state from Redux
  const { data, loading, error, success } = useSelector(
    (state) => state.qrcode,
  );
  console.log("data:", data?.profile?.contactEmail);

  const mail = data?.profile?.contactEmail;

  useEffect(() => {
    if (id) {
      dispatch(qrCodeRequest({ qr_code: id }));
    } else {
      console.error("❌ No QR code provided in URL");
    }
  }, [dispatch, id]);

  return (
    <div className="min-h-screen bg-[#3B3B3D] px-[10px] py-2 font-raleway text-white sm:py-4 md:py-6 lg:py-8">
      <div className="flex items-center justify-center text-center">
        <div className="text-center">
          {/* Image */}
          <div className="flex justify-center py-[40px]">
            <img
              src="/img/assets/logo.png"
              alt="preview"
              className="h-24 w-36 object-cover"
            />
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-center font-raleway text-[20px] font-bold sm:text-[30px] md:text-[40px]">
            Welcome to Scan Me Maybe <br />
            So…. you got the card.
          </h1>
        </div>
      </div>

      <div className="mx-auto flex max-w-[600px] items-center justify-center">
        <div className="w-full">
          {/* Paragraph */}
          <p className="mx-auto py-2.5 text-center font-raleway text-xs font-normal leading-4 md:py-5 md:text-base">
            If you’re reading this, it means I – or one of my wonderful friends
            – saw something in you. Maybe it was your smile, your energy, or the
            way you carried yourself. You weren’t obviously partnered, and if
            you are in a relationship – congratulations, and feel free to
            disregard all of this with a smile.
          </p>

          <div className="my-8 flex w-full items-center gap-4 rounded-lg bg-[#3d4743] px-4 py-3">
            {/* Checkbox */}

            {/* Text */}
            <div className="flex flex-col text-start text-sm">
              {/* QR Code Status Indicator */}
              {loading && (
                <div className="font-raleway text-sm font-medium text-orange-500">
                  🔍 Scanning QR Code...
                </div>
              )}

              {error && (
                <div className="font-raleway text-sm font-medium text-red-500">
                  <p>❌ QR Scan Failed: {error}</p>
                </div>
              )}

              {success && data && (
                <div className="flex gap-4">
                  <div>
                    <p className="font-raleway text-sm font-medium text-green-500">
                      ✅ QR Code Scanned Successfully
                    </p>
                    <p className="font-raleway text-xs font-medium text-red-500">
                      {data.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {data && data.scansRemaining > 0 && (
            <div>
              <div className="my-8 flex w-full gap-4 rounded-lg bg-[#505050] px-4 py-3">
                {/* Checkbox */}
                <div className="inline-flex items-center">
                  <label className="relative flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-orange-500 transition-all checked:border-orange-500 checked:bg-orange-500"
                    />
                    {/* Checkmark */}
                    <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
                      <BsCheck className="h-3.5 w-3.5 text-white" />
                    </span>
                  </label>
                </div>

                {/* Text */}
                <div className="flex flex-col text-start text-sm">
                  <p className="font-raleway font-semibold text-white">
                    Read terms and conditions
                  </p>
                  <p className="font-raleway text-sm text-orange-500">
                    Yes, I have accepted the terms and conditions.
                  </p>
                </div>
              </div>

              <div className="mb-10 md:mb-0">
                <h2 className="my-4 text-center font-raleway text-base font-bold md:my-6 md:text-[26px]">
                  It’s not a scam, it’s a Scan
                </h2>
                <div className="mx-auto mt-[20px] flex w-[70%] items-center gap-4 font-raleway font-semibold md:w-full">
                  <div className="w-full">
                    <Link to={`/user-profile/${mail}`}>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-orange-500 p-2.5 text-base text-white transition hover:bg-orange-600"
                      >
                        Let’s go
                      </button>
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full rounded-lg bg-orange-500 p-2.5 text-base text-white transition hover:bg-orange-600"
                  >
                    No Thanks
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScanView;
