import { useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Keep your plans array as-is
const plans = [
  {
    priceId: 'price_1SFuAiH5rkzWQxv8YhSgh1SD',
    id: 'setup-fee',
    title: 'Initial Setup Fee',
    price: '$69 one-time',
    features: [
      'Custom profile setup',
      'High-resolution photos',
      'Profile personalization',
      'Priority support',
    ],
  },
  {
    priceId: 'price_1SFuB8H5rkzWQxv8d141Sf06',
    id: 'monthly',
    title: 'Monthly',
    price: '$13 per month',
  },
  {
    priceId: 'price_1SFuAiH5rkzWQxv8YhSgh1SD',
    id: 'annual',
    title: 'Annual',
    price: '$120 per year',
  },
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#fff',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutView = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(plans[0].priceId);
  console.log('Selected Plan:', selectedPlan);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState('');

  const { user_email } = useParams();
  console.log('User Email:', user_email);
  const stripe = useStripe();
  const elements = useElements();

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : '');
  };

  const handlePayment = async () => {
    if (!cardComplete) {
      setErrorMsg('Please complete your card details');
      return;
    }

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // ✅ Use your existing endpoint AS-IS
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payment/simple-payment`,
        {
          email: user_email,
          priceId: selectedPlan,
          paymentMethodId: 'pm_card_visa',
        }
      );

      if (res.data.success) {
        setSuccessMsg(
          `✅ Payment completed: $${
            res.data.amount
          } ${res.data.currency.toUpperCase()}`
        );
      } else {
        setErrorMsg('❌ Payment failed.');
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // Check if form can be submitted
  const canSubmit = stripe && cardComplete && !loading && !cardError;

  if (successMsg) {
    return (
      <section className='max-w-[600px] mx-auto px-[10px] py-4 text-white border h-screen flex justify-center border-green-400 items-center'>
        <div className='text-center'>
          <h2 className='font-bold md:text-[32px] text-xl text-white mb-4'>
            Payment Successful!
          </h2>
          <p className='text-green-400 text-lg'>{successMsg}</p>
          <button
            onClick={() => window.location.replace('/checkout/setup-profile')}
            className='mt-4 px-4 py-2 bg-green-500 text-white rounded-md'
          >
            Setup Your Profile
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className='max-w-[600px] mx-auto px-[10px] py-4 text-white'>
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

      <div className='border-t-2 border-orange-500 rounded-xl bg-[#434343] p-4 md:mt-6'>
        <div className='bg-[#FFFFFF33] p-6 rounded-xl'>
          <h2 className='text-[32px] font-semibold'>
            $69/
            <span className='text-base font-semibold'>Initial setup fee</span>
          </h2>
          <hr className='my-6 text-gray-400' />
          {plans[0].features.map((item, i) => (
            <h3
              key={i}
              className='flex items-center gap-3 font-medium text-base my-3'
            >
              <span className='rounded-lg p-2 bg-orange-500 w-7 h-7 flex items-center justify-center'>
                <GiCheckMark className='w-6 h-6' />
              </span>
              {item}
            </h3>
          ))}
        </div>

        <div className='md:mt-8 mt-5'>
          <h2 className='font-bold text-[28px] text-center'>Plus</h2>
          <div className='flex items-center justify-center mt-4 mb-7 rounded-xl'>
            <div className='flex md:flex-row gap-5 max-w-3xl w-full'>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  role='radio'
                  aria-checked={selectedPlan === plan.priceId}
                  tabIndex={0}
                  onClick={() => setSelectedPlan(plan.priceId)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && setSelectedPlan(plan.priceId)
                  }
                  className={`flex-1 rounded-xl md:p-5 p-[14px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(212,163,115,0.3)] ${
                    selectedPlan === plan.priceId
                      ? 'border-2 border-[#ff8c42]'
                      : 'border-2 border-[#d4a373]'
                  }`}
                >
                  <div className='flex sm:flex-row items-start sm:items-center gap-4'>
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                        selectedPlan === plan.priceId
                          ? 'border-[#ff8c42]'
                          : 'border-[#d4a373]'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-[#ff8c42] transition-transform duration-200 ${
                          selectedPlan === plan.priceId
                            ? 'scale-100'
                            : 'scale-0'
                        }`}
                      />
                    </div>
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
        </div>

        {/* Stripe Card Element */}
        <div className='mt-6'>
          <label className='block text-white mb-2'>Card Details</label>
          <div
            className={`bg-[#555] p-3 rounded-lg ${
              cardError ? 'border border-red-400' : ''
            }`}
          >
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <p className='mt-2 text-red-400 text-sm'>{cardError}</p>
          )}
          {cardComplete && !cardError && (
            <p className='mt-2 text-green-400 text-sm'>
              ✓ Card details are valid
            </p>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={!canSubmit}
          className={`mt-6 w-full text-white py-3 rounded-xl font-semibold transition-all ${
            canSubmit
              ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer'
              : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Complete Payment'}
        </button>

        {errorMsg && <p className='mt-4 text-red-400'>{errorMsg}</p>}
      </div>
    </section>
  );
};

export default CheckoutView;
