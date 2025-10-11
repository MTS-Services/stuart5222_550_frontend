import { useState } from "react";
// Added AlertTriangle for the error message icon
import { CreditCard, CheckCircle, X, AlertTriangle } from "lucide-react";

// --- Main Application Component ---
export default function PaymentApp() {
  const [showModal, setShowModal] = useState(false);
  // Renamed for clarity: showToast -> showSuccessToast
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  // New state for error handling (replaces alert())
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // ✅ LIFTED STATE: State to track selected plan, now in parent component
  const [selectedPlan, setSelectedPlan] = useState("annual"); 

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    country: "Bangladesh",
  });

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Argentina",
    "Bangladesh",
    "Belgium",
    "Brazil",
    "Canada",
    "China",
    "Denmark",
    "Egypt",
    "France",
    "Germany",
    "Greece",
    "India",
    "Indonesia",
    "Ireland",
    "Italy",
    "Japan",
    "Kenya",
    "Malaysia",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "Norway",
    "Pakistan",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "UAE",
    "UK",
    "USA",
  ];

  const handlePayment = () => {
    // Clear any previous error toast
    setShowErrorToast(false);
    setErrorMessage("");

    if (!formData.cardNumber || !formData.expiryDate || !formData.cvc) {
      // ❌ Replaced alert() with a custom error toast (Functional fix retained)
      setErrorMessage("Please fill all card fields (Number, Expiry, and CVC) to proceed.");
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 4000);
      return;
    }
    
    // --- Logging submitted data to the console (Now includes selectedPlan) ---
    console.log("Submitting Payment Data:", {
      ...formData,
      selectedPlan: selectedPlan, // Log the selected plan
    });

    // ✅ SOLUTION: Reset input fields (formData) on successful submission
    setFormData({
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      country: "Bangladesh",
    });

    // Success logic: close modal and show success toast
    setShowModal(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center p-4 relative font-inter">
      {/* 🟢 Success Toast Notification (Original UI retained) */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 flex items-start gap-3 min-w-[320px]">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Payment Successful!
              </h3>
              <p className="text-sm text-gray-600">
                Your payment has been processed successfully.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 🔴 Error Toast Notification (NEW - Replaces alert()) */}
      {showErrorToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-white rounded-lg shadow-lg border border-red-200 p-4 flex items-start gap-3 min-w-[320px]">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Validation Error
              </h3>
              <p className="text-sm text-gray-600">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setShowErrorToast(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Payment Method Component (Now passes selectedPlan and setter) */}
      <div className="w-full max-w-3xl">
        <PaymentMethod 
          onOpenModal={() => setShowModal(true)} 
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
        />
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-40 transition-opacity duration-300"
          // ❌ Backdrop click removed, modal only closes on X or success (Functional fix retained)
        >
          <div
            // Reverted rounding and shadow to original
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-md relative animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header (Reverted to original) */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-500 p-2 rounded">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Card</h2>
            </div>

            {/* Card Number (Styling reverted where possible) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 1234 1234 1234"
                  // Reverted focus style on input
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="19"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                    alt="Visa"
                    className="h-5"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/32x20/F5F5F5/333?text=V" }}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="h-5"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/32x20/F5F5F5/333?text=M" }}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                    alt="Amex"
                    className="h-5"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/32x20/F5F5F5/333?text=A" }}
                  />
                </div>
              </div>
            </div>

            {/* Expiration and CVC (Styling reverted where possible) */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM / YY"
                  // Reverted focus style on input
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security code
                </label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  placeholder="CVC"
                  // Reverted focus style on input
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="4"
                />
              </div>
            </div>

            {/* Country (Styling reverted where possible) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                // Reverted focus style on select
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {countries.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pay Button (Reverted to original) */}
            <button
              onClick={handlePayment}
              className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes zoom-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoom-in {
          animation: zoom-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

// --- Payment Method Selector Component (Now receives props for state management) ---
export const PaymentMethod = ({ onOpenModal, selectedPlan, onSelectPlan }) => {
  // ❌ Removed local state: const [selectedPlan, setSelectedPlan] = useState("annual"); 

  const plans = [
    { id: "monthly", title: "Monthly Plan", price: "$13 per month" },
    { id: "annual", title: "Annual Plan", price: "$120 per year" },
  ];

  return (
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
              // ✅ Updated to use onSelectPlan prop
              onClick={() => onSelectPlan(plan.id)}
              onKeyDown={(e) => e.key === "Enter" && onSelectPlan(plan.id)}
              className={`flex-1 rounded-xl md:p-5 p-[14px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(212,163,115,0.3)] ${
                selectedPlan === plan.id
                  ? "border-2 border-[#ff8c42]"
                  : "border-2 border-[#d4a373]"
              }`}
            >
              <div className="flex sm:flex-row items-start sm:items-center gap-4">
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

      {/* ✅ Button triggers modal in parent (Original UI retained) */}
      <button
        type="button"
        onClick={onOpenModal}
        className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
      >
        Payment method
      </button>
    </div>
  );
};
