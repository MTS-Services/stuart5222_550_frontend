import React from "react";

const HowSection = () => {
  const steps = [
    {
      number: 1,
      title: "User Registration & Setup",
      color: "blue",
      icon: "📝",
      items: [
        "Sign up via email and provide basic info",
        "Pay one-time setup fee ($69) via Stripe",
        "Complete your profile (photos, bio, preferences)",
        "Submit for admin review",
      ],
    },
    {
      number: 2,
      title: "Admin Review Process",
      color: "purple",
      icon: "👑",
      items: [
        "Admins review your profile for quality and safety",
        "If approved: QR cards generated + welcome email sent",
        "If rejected: you'll receive clear feedback to improve",
      ],
    },
    {
      number: 3,
      title: "QR Code Connection",
      color: "orange",
      icon: "📱",
      items: [
        "Receive 50 beautifully printed QR cards",
        "Hand them out in real life (events, cafes, etc.)",
        "Others scan to view your profile and express interest",
        "Mutual interest? Contact details are safely shared!",
      ],
    },
    {
      number: 4,
      title: "Ongoing Access & Growth",
      color: "green",
      icon: "📊",
      items: [
        "Subscribe monthly ($13) or yearly ($120)",
        "Track scan analytics & profile views",
        "Manage incoming interest and messages",
        "Order new QR cards anytime",
      ],
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-orange-500",
      border: "border-orange-200",
      number: "bg-orange-500 text-white",
      dot: "text-orange-500",
      gradient: "from-orange-400 to-orange-600",
    },
    purple: {
      bg: "bg-orange-500",
      border: "border-purple-200",
      number: "bg-purple-500 text-white",
      dot: "text-purple-500",
      gradient: "from-orange-400 to-orange-600",
    },
    orange: {
      bg: "bg-orange-500",
      border: "border-orange-200",
      number: "bg-orange-500 text-white",
      dot: "text-orange-500",
      gradient: "from-orange-400 to-orange-600",
    },
    green: {
      bg: "bg-orange-500",
      border: "border-green-200",
      number: "bg-green-500 text-white",
      dot: "text-green-500",
      gradient: "from-orange-400 to-orange-600",
    },
  };

  return (
    <section className="relative mx-auto max-w-[600px] py-4 md:py-6">
      {/* Background decorative elements */}

      <div className="relative px-0 md:px-4">
        {/* Header */}
        <div className="mb-8 text-center md:mb-10">
          <h2 className="mb-4 font-raleway text-4xl font-bold text-orange-500 md:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-300">
            Your journey to meaningful connections starts here. Simple, secure,
            and designed for real life.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}

          <div className="space-y-0 md:space-y-12">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col items-start md:flex-row ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Card */}
                  <div className={`mb-8 flex-1 md:mb-0`}>
                    <div
                      className={`rounded-2xl border border-orange-500 p-6 shadow-sm transition-all duration-300 hover:shadow-md md:p-8`}
                    >
                      {/* Step Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-gray-200 md:text-2xl">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-white">Step: {step.number}</p>
                      </div>

                      {/* Step Items */}
                      <ul className="space-y-3">
                        {step.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="group flex items-start"
                          >
                            <span
                              className={`mr-3 mt-0.5 text-lg font-bold text-white transition-transform group-hover:scale-110`}
                            >
                              •
                            </span>
                            <span className="font-raleway text-gray-100 transition-colors">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Timeline Node - Desktop */}
                  <div className="absolute left-1/2 hidden -translate-x-1/2 -translate-y-5 transform md:flex">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-orange-600 bg-gradient-to-r shadow-lg`}
                    >
                      <span className="text-xs font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Timeline Node - Mobile */}
                  <div className="absolute left-1/2 top-0 -translate-y-4 transform md:hidden">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-600 shadow-lg`}
                    >
                      <span className="text-sm font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
