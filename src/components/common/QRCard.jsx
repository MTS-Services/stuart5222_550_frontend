import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { FaDownload } from 'react-icons/fa';

const QRCard = ({ qrCode, scanCount, maxScans }) => {
  const cardRef = useRef(null);
  const scanUrl = `https://stuart05frontend.mtscorporate.com/welcome/${qrCode}`;
  const isExpired = scanCount >= maxScans;

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement('a');
      link.download = `QR-${qrCode.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <div className='flex flex-col items-center border p-4 rounded-md shadow'>
      {/* QR card container */}
      {/* QR code id */}
      <p className='font-semibold text-gray-700 mb-2'>
        QR Code: {qrCode.slice(0, 8)}...
      </p>
      <div
        ref={cardRef}
        className={`flex flex-col items-center justify-center p-4 rounded-xl transition `}
      >
        {/* QR or expired message */}
        {isExpired ? (
          <div className='flex flex-col items-center justify-center p-6 border border-gray-400 rounded-lg bg-gray-100'>
            <p className='text-sm font-semibold text-red-600'>
              ⚠️ Card Expired
            </p>
            <p className='text-xs text-gray-500 mt-1'>Scan limit reached</p>
          </div>
        ) : (
          <QRCodeCanvas
            value={scanUrl}
            size={180}
            bgColor='#ffffff'
            fgColor='#000000'
            level='H'
            includeMargin={true}
          />
        )}
      </div>
      {/* Remaining scans */}
      <p
        className={`mt-3 text-xs ${
          isExpired ? 'text-red-500 font-semibold' : 'text-gray-500'
        }`}
      >
        {isExpired
          ? 'No scans remaining'
          : `Scans remaining: ${maxScans - scanCount}`}
      </p>
      {/* Download button */}
      {!isExpired && (
        <button
          onClick={handleDownload}
          className='mt-3 flex items-center gap-2 text-sm bg-orange-600 hover:bg-orange-700 text-white py-1.5 px-4 rounded-md'
        >
          <FaDownload /> Download QR
        </button>
      )}
    </div>
  );
};

export default QRCard;
