import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { FaDownload } from "react-icons/fa";

const QRCard = ({ qrCode, scanCount, maxScans }) => {
  const cardRef = useRef(null);
  const scanUrl = `https://stuart05frontend.mtscorporate.com/welcome/${qrCode}`;
  const isExpired = scanCount >= maxScans;

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement("a");
      link.download = `QR-${qrCode.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <div className="">
      {/* QR card container */}
      {/* <p className="mb-2 font-semibold text-gray-700">
        QR Code: {qrCode.slice(0, 8)}...
      </p> */}
      <div ref={cardRef}>
        {/* QR or expired message */}
        {isExpired ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-400 bg-gray-100 p-6">
            <p className="text-sm font-semibold text-red-600">
              ⚠️ Card Expired
            </p>
            <p className="mt-1 text-xs text-gray-500">Scan limit reached</p>
          </div>
        ) : (
          <QRCodeCanvas
            value={scanUrl}
            bgColor="#ffffff"
            fgColor="#000000"
            includeMargin={true}
          />
        )}
      </div>
      {/* Remaining scans */}
      {/* <p
        className={`mt-3 text-xs ${
          isExpired ? "font-semibold text-red-500" : "text-gray-500"
        }`}
      >
        {isExpired
          ? "No scans remaining"
          : `Scans remaining: ${maxScans - scanCount}`}
      </p> */}

      {/* {!isExpired && (
        <button
          onClick={handleDownload}
          className="mt-3 flex items-center gap-2 rounded-md bg-orange-600 px-4 py-1.5 text-sm text-white hover:bg-orange-700"
        >
          <FaDownload /> Download QR
        </button>
      )} */}
    </div>
  );
};

export default QRCard;
