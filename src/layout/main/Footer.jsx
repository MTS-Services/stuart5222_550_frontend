import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
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
          <p className="text-xs text-stone-300 underline">Terms & Conditions</p>
          <p className="text-xs text-stone-300 underline">Privacy Policy</p>
          <p className="cursor-pointer text-xs text-stone-300 underline">
            <Link to="/auth/login">Access Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
