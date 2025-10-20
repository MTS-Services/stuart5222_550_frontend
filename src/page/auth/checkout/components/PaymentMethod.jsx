import { useState } from 'react';
import { Link } from 'react-router-dom';

export const PaymentMethod = () => {
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const plans = [
    {
      id: 'monthly',
      title: 'Monthly',
      price: '$13 per month',
    },
    {
      id: 'annual',
      title: 'Annual',
      price: '$120 per year',
    },
  ];

  return (
    <div className='md:mt-8 mt-5'>
      <h2 className='font-bold text-[28px] text-center'>Plus</h2>
      <div className='flex items-center justify-center mt-4 mb-7 rounded-xl'>
        <div className='flex md:flex-row gap-5 max-w-3xl w-full'>
          {plans.map((plan) => (
            <div
              key={plan.id}
              role='radio'
              aria-checked={selectedPlan === plan.id}
              tabIndex={0}
              onClick={() => setSelectedPlan(plan.id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedPlan(plan.id)}
              className={`flex-1 rounded-xl md:p-5 p-[14px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(212,163,115,0.3)] ${
                selectedPlan === plan.id
                  ? 'border-2 border-[#ff8c42]'
                  : 'border-2 border-[#d4a373]'
              }`}
            >
              <div className='flex sm:flex-row items-start sm:items-center gap-4'>
                {/* Custom Radio */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                    selectedPlan === plan.id
                      ? 'border-[#ff8c42]'
                      : 'border-[#d4a373]'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-[#ff8c42] transition-transform duration-200 ${
                      selectedPlan === plan.id ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </div>

                {/* Plan Info */}
                <div className='flex-1 font-raleway'>
                  <div className='text-white text-base font-bold mb-1'>
                    {plan.title}
                  </div>
                  <div className='text-white text-sm font-normal'>
                    {plan.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      {/* <Link to='/checkout/setup-profile'>
        <button
          type='submit'
          className='w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition'
        >
          Payment method
        </button>
      </Link> */}
    </div>
  );
};
