import { useEffect, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { qrCodeRequest } from "../../../features/public/QR-code/qrCodeFetch";
import CustomModal from "../../../components/common/CustomModal";

const WelcomeScanView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

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
                  <p
                    className="cursor-pointer font-raleway font-semibold text-white underline transition-colors hover:text-orange-400"
                    onClick={openTermsModal}
                  >
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

      {/* Terms & Conditions Modal */}
      <CustomModal
        isOpen={isTermsModalOpen}
        onClose={closeTermsModal}
        title="Terms & Conditions"
        size="2xl"
      >
        <div className="max-h-96 space-y-4 overflow-y-auto bg-[#3B3B3D] text-sm text-white">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-orange-400">
              Yep, this is all the legal gobbledygook.
            </h3>

            <div className="space-y-3">
              <p className="leading-relaxed text-white">
                Welcome to Scan Me Maybe! By using our service, you agree to
                these terms and conditions. Please read them carefully before
                proceeding. By accessing and using Scan Me Maybe, you accept and
                agree to be bound by the terms and provision of this agreement.
              </p>

              <p className="leading-relaxed text-white">
                Permission is granted to temporarily use Scan Me Maybe for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title. Your privacy and
                safety are our top priorities. We implement various security
                measures to protect your personal information and ensure safe
                person-to-person connections.
              </p>

              {/* Easter Egg Story */}
              <div className="rounded-lg border-l-4 border-orange-400 bg-[#505050] p-4">
                <h4 className="mb-3 font-bold text-orange-400">
                  🛒 A Little Story...
                </h4>
                <p className="italic leading-relaxed text-orange-200">
                  Your eyes met across the produce section of the grocery store.
                  "Mmmm. I like what I see." Is there a wedding ring? Are they
                  here with someone? It doesn't look like it. Get brave and whip
                  out the card. What have you got to lose? They could be the
                  one, or they can chuck it in the trash on the way out. At
                  least you took your shot. So brave.
                </p>
              </div>

              <p className="leading-relaxed text-white">
                Users must conduct themselves respectfully and lawfully. Any
                harassment, inappropriate behavior, or misuse of the platform is
                strictly prohibited. The materials on Scan Me Maybe are provided
                on an 'as is' basis. Scan Me Maybe makes no warranties,
                expressed or implied, and hereby disclaims and negates all other
                warranties.
              </p>

              {/* Call to Action */}
              <div className="mt-6 rounded-lg bg-[#505050] p-4">
                <h4 className="mb-3 font-bold text-orange-400">Your Move</h4>
                <p className="leading-relaxed text-white">
                  If you've read this far and you're intrigued, don't overthink
                  it. Let's see what a good conversation might bring. Worst
                  case? We have an interesting chat. Best case? Who knows……
                </p>
              </div>

              <p className="mt-4 text-xs text-gray-300">
                Last updated: November 8, 2025
                <br />© 2025 Scan Me Maybe, LLC. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default WelcomeScanView;
