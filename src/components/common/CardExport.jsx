import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { FaDownload } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function CardExport({ user }) {
  const cardRef = useRef(null);
  const { qrCodeList } = useSelector((state) => state.dashboard);
  const qrCodeValue = qrCodeList.map((code) => {
    return code.qrCode;
  });

  const qrURL = `http://scanmemaybe.com/welcome-scan/${qrCodeValue}`;

  const handleExportPDF = async () => {
    if (!cardRef.current) return;
    const scale = 2;
    const canvas = await html2canvas(cardRef.current, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(user.outputFileName);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Export Button */}
      <div className="text-center">
        {/* Instruction Text */}
        <p>{user.qrCards.lenght}</p>
        <button
          onClick={handleExportPDF}
          className="mx-auto flex items-center gap-2 rounded-md bg-[#e9781b] px-6 py-3 text-base font-semibold text-white shadow transition hover:bg-[#021635]"
        >
          <FaDownload /> <span>Export to PDF</span>
        </button>
      </div>
      {/* Hidden printable A4 canvas */}
      <div
        ref={cardRef}
        className="flex h-[1123px] w-[794px] items-start justify-center bg-white pt-20 font-sans"
      >
        {/* LEFT CARD */}
        <div className="mr-8 flex h-[450px] w-[300px] flex-col items-center justify-start rounded-lg bg-[#3b3b3b] p-8 shadow-md">
          {/* Icon placeholder — replace with your SVG/image */}
          <div className="mb-16 text-[80px] text-[#dcd7cf]">
            <img src="/new-logo.png" alt="pwa" className="w-[140px]" />
          </div>

          <div className="w-full">
            <p className="text-center font-raleway text-[18px] font-medium text-[#d6946d]">
              Person to person dating, but with a safer approach.
            </p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="flex h-[450px] w-[300px] flex-col items-center justify-start rounded-lg bg-[#3b3b3b] px-4 pt-8 shadow-md">
          {/* QR Code */}
          <div className="mb-2 rounded-md bg-[#dcd7cf] p-4">
            <QRCodeSVG
              value={qrURL}
              size={180}
              bgColor="#dcd7cf"
              fgColor="#000000"
              level="M"
            />
          </div>

          {/* CTA Text */}
          <div className="mb-4 text-center text-[18px] font-medium text-[#dcd7cf]">
            Check me out
          </div>

          {/* Signature */}
          <div className="flex rotate-[-10deg] items-center justify-center gap-4 text-center text-[36px] text-[#dcd7cf]">
            <p className="" style={{ fontFamily: "marketPro" }}>
              {user.username}
            </p>
            <img src="/wink.png" className="h-6" alt="wink" />
          </div>
          {/* <h2 className="text-4xl text-white">☺</h2> */}
        </div>
      </div>

      <div className="pb-4 text-center">
        <p className="text-center text-sm text-gray-500">
          * Click the "Export to PDF" button to download your business card as
          an A4-sized PDF.
        </p>
      </div>
    </div>
  );
}
