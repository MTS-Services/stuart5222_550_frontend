// NoUserFound.jsx
import React from "react";

const NoFound = ({
  message = "No user found",
  icon = "👤",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      <div className="mb-4 text-5xl">{icon}</div>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default NoFound;
