import { useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Keep your plans array as-is
const plans = [
  {
    priceId: "price_1SGXb5CZ2kLTrYVYtOKGZ7yU",
    id: "monthly",
    title: "Monthly",
    price: "$13 per month",
  },
  {
    priceId: "price_1SGXbRCZ2kLTrYVYlcpNAWsk",
    id: "annual",
    title: "Annual",
    price: "$120 per year",
  },
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#fff",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutView = () => {
  const [loading, setLoading] = useState(false);
  // Preferred way
  const [successMsg, setSuccessMsg] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(plans[0].priceId);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState("");
  const { user_email } = useParams();

  const stripe = useStripe();
  const elements = useElements();

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : "");
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    if (!cardComplete) {
      setErrorMsg("Please complete your card details");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // 🪄 Step 1: Create Payment Method from card input
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: { email: user_email },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      const payment = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payment/create-one-time-payment`,
        {
          email: user_email,
          amount: "69",
          paymentMethodId: paymentMethod.id,
        },
      );

      console.log("payment:", payment);

      // 🪄 Step 2: Send the paymentMethod.id to your backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payment/create-subscription`,
        {
          email: user_email,
          priceId: selectedPlan,
          paymentMethodId: paymentMethod.id,
        },
      );

      if (res.data?.success) {
        // 🪄 Step 3: Confirm client-side if 3D Secure is required
        if (res.data.clientSecret) {
          const { paymentIntent, error: confirmError } =
            await stripe.confirmCardPayment(res.data.clientSecret);
          if (confirmError) throw confirmError;
          if (paymentIntent.status === "succeeded") {
            setSuccessMsg(`Successfully completed!`);
          }
        } else {
          console.log("Subscriptions:", res.data);
          setSuccessMsg(res?.data);
        }
      } else {
        setErrorMsg("❌ Payment failed.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Check if form can be submitted
  const canSubmit = stripe && cardComplete && !loading && !cardError;

  if (successMsg) {
    return (
      <section className="mx-auto flex h-screen max-w-[600px] items-center justify-center px-[10px] py-4 font-raleway text-white">
        <div className="space-y-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-green-100 md:text-[32px]">
            Subscription Successfully Done🎉
          </h2>
          <div className="rounded-xl border border-green-500 p-4 text-left shadow-md shadow-green-700">
            <p className="text-green-400">
              Customer-ID: {successMsg?.customerId}
            </p>
            <p>Plan : {successMsg?.plan.toLowerCase()}</p>
            <p>Status : {successMsg?.stripeStatus}</p>
            <p>Amount : ${successMsg?.amount}</p>
          </div>
          <p className="py-5">Follow Next Step:</p>
          <Link
            to={`/checkout/setup-profile/${user_email}`}
            className="rounded-md border bg-green-500 px-4 py-2 text-white hover:bg-green-700"
          >
            Go to profile setup
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[600px] px-[10px] font-raleway text-white">
      <div className="flex justify-center py-[40px]">
        <img
          src="/img/assets/logo.png"
          alt="preview"
          className="h-24 w-36 object-cover"
        />
      </div>

      <div className="mb-[40px] text-center">
        <h2 className="font-raleway text-xl font-bold text-white md:text-[32px]">
          Pick your Plan and Setup Profile
        </h2>
      </div>

      <div className="mb-8 rounded-xl border-t-2 border-orange-500 bg-[#434343] p-4 md:mt-6">
        <div className="rounded-xl bg-[#FFFFFF33] p-6">
          <h2 className="font-raleway text-[32px] font-semibold">
            $69<span className="text-[24px]">/</span>
            <span className="font-raleway text-base font-normal">
              Initial setup fee
            </span>
          </h2>
          <hr className="my-6 text-gray-400" />
          {[
            "Custom profile setup",
            "High-resolution photos",
            "Profile personalization",
            "Priority support",
          ].map((item, i) => (
            <p
              key={i}
              className="my-3 flex items-center gap-3 font-raleway text-base font-medium"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 p-2 font-raleway">
                <GiCheckMark className="h-6 w-6" />
              </span>
              {item}
            </p>
          ))}
        </div>

        <div className="mt-5 md:mt-8">
          <h2 className="text-center font-raleway text-[28px] font-bold">
            Plus
          </h2>
          <div className="mb-7 mt-4 flex items-center justify-center rounded-xl">
            <div className="flex w-full max-w-3xl gap-5 md:flex-row">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  role="radio"
                  aria-checked={selectedPlan === plan.priceId}
                  tabIndex={0}
                  onClick={() => setSelectedPlan(plan.priceId)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSelectedPlan(plan.priceId)
                  }
                  className={`flex-1 cursor-pointer rounded-xl px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(212,163,115,0.3)] md:p-5 ${
                    selectedPlan === plan.priceId
                      ? "border-2 border-[#ff8c42]"
                      : "border-2 border-[#d4a373]"
                  }`}
                >
                  <div className="flex items-center gap-4 sm:flex-row sm:items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                        selectedPlan === plan.priceId
                          ? "border-[#ff8c42]"
                          : "border-[#d4a373]"
                      }`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full bg-[#ff8c42] transition-transform duration-200 ${
                          selectedPlan === plan.priceId
                            ? "scale-100"
                            : "scale-0"
                        }`}
                      />
                    </div>
                    <div className="">
                      <p className="font-raleway text-base font-bold text-white">
                        {plan.title}
                      </p>
                      <p className="font-raleway text-sm font-normal text-white">
                        {plan.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stripe Card Element */}
        <div className="mt-6">
          <label className="mb-2 block font-raleway text-white">
            Card Details
          </label>
          <div
            className={`rounded-lg bg-[#555] p-3 ${
              cardError ? "border border-red-400" : ""
            }`}
          >
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <p className="mt-2 text-sm text-red-400">{cardError}</p>
          )}
          {cardComplete && !cardError && (
            <p className="mt-2 text-sm text-green-400">
              ✓ Card details are valid
            </p>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={!canSubmit}
          className={`mt-6 w-full rounded-xl py-3 font-semibold text-white transition-all ${
            canSubmit
              ? "cursor-pointer bg-orange-500 hover:bg-orange-600"
              : "cursor-not-allowed bg-gray-500"
          }`}
        >
          {loading ? "Processing..." : "Complete Payment"}
        </button>

        {errorMsg && <p className="mt-4 text-red-400">{errorMsg}</p>}
      </div>
    </section>
  );
};

export default CheckoutView;
