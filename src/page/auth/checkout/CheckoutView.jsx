import { PaymentMethod } from './components/PaymentMethod';
import { GiCheckMark } from 'react-icons/gi';

const CheckoutView = () => {
  return (
    <section className='max-w-[600px] mx-auto px-[10px] py-4  text-white'>
      <div className='flex justify-center mb-6'>
        <img
          src='/img/page/home/remove_preview.png'
          alt='preview'
          className='w-[146px] h-[104px] bg-cover object-cover'
        />
      </div>
      <div className='text-center mb-6'>
        <h2 className='font-bold md:text-[32px] text-xl text-white'>
          Setup Profile and Pick your Plan
        </h2>
      </div>
      <div className='border-t-2 border-orange-500 rounded-xl bg-[#434343] p-4 md:mt-6 '>
        <div className='bg-[#FFFFFF33] p-6 rounded-xl'>
          <h2 className='text-[32px] font-semibold'>
            $69/
            <span className='text-base font-semibold'>Initial setup fee</span>
          </h2>
          <hr className='my-6 text-gray-400' />
          {[
            '50 unique QR code cards',
            'Delivery of cards',
            'Profile page setup & review',
            'Secure contact sharing',
          ].map((item, index) => (
            <h3
              key={index}
              className='flex items-center gap-3 font-medium text-base my-3 first:mt-0'
            >
              <span className='rounded-lg p-2 bg-orange-500 w-7 h-7 text-white flex items-center justify-center'>
                <GiCheckMark className='w-6 h-6 font-semibold' />
              </span>
              {item}
            </h3>
          ))}
        </div>
        <PaymentMethod />
      </div>
    </section>
  );
};

export default CheckoutView;
