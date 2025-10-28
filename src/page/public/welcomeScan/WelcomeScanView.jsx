import { useEffect } from 'react';
import { BsCheck } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { qrCodeRequest } from '../../../features/public/QR-code/qrCodeFetch';

const WelcomeScanView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Get QR code state from Redux
  const { data, loading, error, success } = useSelector(
    (state) => state.qrcode
  );

  console.log(data?.profile?.contactEmail);

  useEffect(() => {
    if (id) {
      dispatch(qrCodeRequest({ qr_code: id }));
    } else {
      console.error('❌ No QR code provided in URL');
    }
  }, [dispatch, id]);

  // Debug: Log state changes

  return (
    <div className='px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 font-raleway bg-[#3B3B3D] min-h-screen text-white'>
      <div className='flex items-center justify-center text-center '>
        <div className='text-center'>
          {/* Image */}
          <div className='flex items-center justify-center py-6'>
            {/* Image */}
            <img
              src='/img/page/home/remove_preview.png'
              alt='preview'
              className='w-24 bg-cover object-cover'
            />
          </div>

          {/* Heading */}
          <h1 className='font-raleway font-bold text-[20px] sm:text-[30px] md:text-[40px] text-center mb-4'>
            Welcome to Scan Me Maybe <br />
            <span className='font-medium inline-block'>
              So…. you got the card.
            </span>
          </h1>
        </div>
      </div>

      <div className='flex items-center justify-center max-w-[600px] mx-auto'>
        <div className='w-full'>
          {/* Paragraph */}
          <p className='md:text-base text-xs font-normal text-center mx-auto font-raleway md:py-5 py-2.5'>
            If you’re reading this, it means I – or one of my wonderful friends
            – saw something in you. Maybe it was your smile, your energy, or the
            way you carried yourself. You weren’t obviously partnered, and if
            you are in a relationship – congratulations, and feel free to
            disregard all of this with a smile.
          </p>

          <div className='bg-[#3d4743] flex items-center gap-4 px-4 py-3 rounded-lg w-full my-8'>
            {/* Checkbox */}

            {/* Text */}
            <div className='flex flex-col text-start text-sm'>
              {/* QR Code Status Indicator */}
              {loading && (
                <div className='text-orange-500 text-sm font-medium mb-2'>
                  🔍 Scanning QR Code...
                </div>
              )}
              {error && (
                <div className='text-red-500 text-sm font-medium mb-2'>
                  ❌ QR Scan Failed: {error}
                </div>
              )}
              {success && data && (
                <div className='mb-2 flex gap-4'>
                  <div className='inline-flex items-center'>✅</div>
                  <div>
                    <p className='text-green-500 text-sm font-medium '>
                      QR Code Scanned Successfully
                    </p>
                    {/* <p>{data.message}</p> */}
                    <p className='text-orange-200 text-sm font-medium '>
                      Your remaining scans: {data.scansRemaining || '[empty]'}
                    </p>
                    <p className='text-red-500 text-xs font-medium '>
                      {data.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {data && data.scansRemaining > 0 && (
            <div>
              <div className='bg-[#505050] flex gap-4 px-4 py-3 rounded-lg w-full my-8'>
                {/* Checkbox */}
                <div className='inline-flex items-center'>
                  <label className='flex items-center cursor-pointer relative'>
                    <input
                      type='checkbox'
                      className='peer h-5 w-5 cursor-pointer transition-all appearance-none rounded border border-orange-500 checked:bg-orange-500 checked:border-orange-500'
                    />
                    {/* Checkmark */}
                    <span className='absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
                      <BsCheck className='text-white w-3.5 h-3.5' />
                    </span>
                  </label>
                </div>

                {/* Text */}
                <div className='flex flex-col text-start text-sm'>
                  <p className='font-semibold text-white'>
                    Read terms and conditions
                  </p>
                  <p className='text-sm text-orange-500'>
                    Yes, I have accepted the terms and conditions.
                  </p>
                </div>
              </div>

              <div className='md:mb-0 mb-10'>
                <h2 className='font-raleway md:text-[26px] text-base font-bold md:my-6 my-4 text-center'>
                  It’s not a scam, it’s a Scan
                </h2>
                <div className='md:w-full w-[70%] flex mx-auto items-center gap-4 mt-[20px] font-semibold font-raleway'>
                  <div className='w-full'>
                    <Link to={`/user-profile`}>
                      <button
                        type='submit'
                        className='w-full p-2.5 bg-orange-500 rounded-lg text-white text-base hover:bg-orange-600 transition'
                      >
                        Let’s go
                      </button>
                    </Link>
                  </div>
                  <button
                    type='button'
                    onClick={() => navigate(-1)}
                    className='w-full p-2.5 bg-orange-500 rounded-lg text-white text-base hover:bg-orange-600 transition'
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
