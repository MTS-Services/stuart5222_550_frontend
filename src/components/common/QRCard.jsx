import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaDownload } from "react-icons/fa";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const QRCard = ({ qrCode, userInfo }) => {
  const cardRef = useRef(null);
  const scanUrl = `https://stuart05frontend.mtscorporate.com/welcome/${qrCode}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Download QR code as PNG
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement("a");
      link.download = `QR-${qrCode.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();

      // Generate and download PDF
      await generatePDF();
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();

    // Add ScanMeMaybe logo (text-based for now)
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 128); // Blue color
    pdf.text("ScanMeMaybe", 20, 25);

    // Add subtitle
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    const descriptions =
      "A spontaneous approach to dating that combines the authenticity of real-world meetings with the convenience of digital profiles. Get your story out there, one card at a time.";
    const splitDescriptions = pdf.splitTextToSize(descriptions, 170);
    pdf.text(splitDescriptions, 20, 35);

    // Add personal information section
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Connection Information", 20, 55);

    pdf.setFontSize(12);
    pdf.text(`Name: ${userInfo.displayName}`, 60, 70);
    pdf.text(`Age: ${userInfo.age}`, 60, 75);
    pdf.text(`Height: ${userInfo.height}`, 60, 80);
    pdf.text(`Body type: ${userInfo.bodyType}`, 60, 85);
    pdf.text(`Dealbreakers: ${userInfo.dealbreakers}`, 60, 90);

    // Generate QR code as data URL
    const qrCodeDataUrl = await generateQRCodeDataURL();

    // Add QR code to PDF
    if (qrCodeDataUrl) {
      pdf.addImage(qrCodeDataUrl, "PNG", 17, 60, 40, 40);
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Scan to connect:", 24, 103);
    }

    // Save the PDF
    pdf.save(`ScanMeMaybe-${qrCode.slice(0, 8)}.pdf`);
  };

  const generateQRCodeDataURL = () => {
    return new Promise((resolve) => {
      const existingQR = document.querySelector("canvas");
      if (existingQR) {
        resolve(existingQR.toDataURL("image/png"));
      } else {
        // Fallback: create a new QR code
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");
        tempCanvas.width = 200;
        tempCanvas.height = 200;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = "#000000";
        ctx.font = "10px Arial";
        ctx.fillText("QR Code: " + qrCode, 10, 100);
        resolve(tempCanvas.toDataURL("image/png"));
      }
    });
  };

  return (
    <div className="group relative inline-block">
      <div ref={cardRef} className="">
        <QRCodeCanvas
          value={scanUrl}
          bgColor="#ffffff"
          fgColor="#000000"
          includeMargin={true}
          size={128}
        />
      </div>

      <button
        onClick={handleDownload}
        className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span className="flex items-center gap-2 rounded-lg border border-gray-500 bg-black px-3 py-2 font-semibold text-white">
          <FaDownload size={20} />
        </span>
      </button>
    </div>
  );
};

export default QRCard;
