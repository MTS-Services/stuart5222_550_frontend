import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../../components/common/CustomModal";

const Footer = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

  return (
    <div className="flex items-center justify-center bg-[#505050] px-4 py-6 font-raleway md:py-10 lg:py-16">
      <div className="">
        {/* Feature header */}
        <div className="flex flex-col items-start justify-start gap-4 self-stretch">
          <img
            className="h-14 w-20 object-cover"
            src="/img/assets/logo.png"
            alt="Feature illustration"
          />

          <p className="font-raleway text-xl font-semibold text-white">
            Person to person dating, but with a safer approach.
          </p>
        </div>

        <hr className="mt-2 border-t border-gray-500" />

        {/* Copyright & Legal */}
        <div className="space-y-4">
          <p className="mt-4 font-raleway font-normal leading-6 text-neutral-200">
            © 2025{" "}
            <span className="font-raleway text-orange-400">
              SCAN ME MAYBE -
            </span>
          </p>

          <p className="font-raleway text-xs font-normal leading-3 text-neutral-200">
            Scan Me Maybe™ is a trademark of Scan Me Maybe, LLC. All Rights
            Reserved.
          </p>

          {/* Links */}
          <p 
            className="cursor-pointer text-xs text-stone-300 underline hover:text-orange-400 transition-colors"
            onClick={openTermsModal}
          >
            Terms & Conditions
          </p>
          {/* <p className="text-xs text-stone-300 underline">Privacy Policy</p> */}
          {/* <p className="cursor-pointer text-xs text-stone-300 underline">
            <Link to="/auth/login">Access Admin</Link>
          </p> */}
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <CustomModal
        isOpen={isTermsModalOpen}
        onClose={closeTermsModal}
        title="Terms & Conditions"
        size="2xl"
      >
        <div className="max-h-96 overflow-y-auto space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-2 text-orange-600">Yep, this is all the legal gobbledygook.</h3>
            
            <div className="space-y-3">
              <p className="leading-relaxed">
                Welcome to Scan Me Maybe! By using our service, you agree to these terms and conditions. 
                Please read them carefully before proceeding. By accessing and using Scan Me Maybe, you 
                accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <p className="leading-relaxed">
                Permission is granted to temporarily use Scan Me Maybe for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title. 
                Your privacy and safety are our top priorities. We implement various security measures 
                to protect your personal information and ensure safe person-to-person connections.
              </p>

              {/* Easter Egg Story */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-bold text-orange-600 mb-3">🛒 A Little Story...</h4>
                <p className="italic text-orange-800 leading-relaxed">
                  Your eyes met across the produce section of the grocery store. "Mmmm. I like what I see." 
                  Is there a wedding ring? Are they here with someone? It doesn't look like it. Get brave 
                  and whip out the card. What have you got to lose? They could be the one, or they can 
                  chuck it in the trash on the way out. At least you took your shot. So brave.
                </p>
              </div>
              
              <p className="leading-relaxed">
                Users must conduct themselves respectfully and lawfully. Any harassment, inappropriate 
                behavior, or misuse of the platform is strictly prohibited. The materials on Scan Me Maybe 
                are provided on an 'as is' basis. Scan Me Maybe makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties.
              </p>

              {/* Call to Action */}
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <h4 className="font-bold text-orange-600 mb-3">Your Move</h4>
                <p className="text-gray-700 leading-relaxed">
                  If you've read this far and you're intrigued, don't overthink it. Let's see what a 
                  good conversation might bring. Worst case? We have an interesting chat. Best case? 
                  Who knows……
                </p>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Last updated: November 8, 2025<br />
                © 2025 Scan Me Maybe, LLC. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default Footer;
