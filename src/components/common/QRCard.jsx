import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaDownload, FaRegGrinWink } from "react-icons/fa";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const QRCard = ({ qrCode, userInfo }) => {
  const cardRef = useRef(null);
  const winkIconRef = useRef(null);
  const scanUrl = `https://scanmemaybe.com/welcome-scan/${qrCode}`;

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

  const loadLogoAsBase64 = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        // Draw with transparent background to preserve sparkles
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      // Use the sparkly orange logo
      img.src = "/img/assets/card.png";
    });
  };

  const generatePDF = async () => {
    // A4 size in portrait orientation
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210; // A4 width
    const pageHeight = 297; // A4 height

    // Business card dimensions in PORTRAIT orientation (55mm wide x 85mm tall - Industry Standard)
    const cardWidth = 55;
    const cardHeight = 85;

    // White background for the page
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Load logo
    let logoBase64;
    try {
      logoBase64 = await loadLogoAsBase64();
    } catch (error) {
      console.error("Failed to load logo:", error);
    }

    // Generate QR code and Wink icon
    const qrCodeDataUrl = await generateQRCodeDataURL();
    const winkIconDataUrl = await generateWinkIconDataURL();

    // Calculate center positions for cards (side by side)
    const cardGap = 10;
    const totalWidth = cardWidth * 2 + cardGap;
    const startX = (pageWidth - totalWidth) / 2;
    const card1X = startX;
    const card2X = startX + cardWidth + cardGap;
    const cardY = 40; // Vertical position

    // ============ CARD 1: Front (Logo Side) - PORTRAIT ============
    // Dark gray background (#3b3b3d)
    pdf.setFillColor(59, 59, 61);
    pdf.roundedRect(card1X, cardY, cardWidth, cardHeight, 2, 2, "F");

    // Calculate vertical spacing for Card 1
    const card1ContentHeight = 25 + 10; // logo size + text space
    const card1StartY = cardY + (cardHeight - card1ContentHeight) / 2;

    // Add sparkly orange logo icon centered
    if (logoBase64) {
      const logoSize = 25;
      const logoX = card1X + (cardWidth - logoSize) / 2;
      const logoY = card1StartY;
      pdf.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);
    }

    // Add "SCAN ME MAYBE" text in Raleway font (bold), centered below logo with equal spacing
    pdf.setFont("Raleway", "bold"); // Raleway style - bold weight
    pdf.setFontSize(13);
    pdf.setTextColor(210, 105, 30); // Orange color matching sparkly logo

    const logoText = "SCAN ME MAYBE";
    const logoWidth = pdf.getTextWidth(logoText);

    pdf.text(
      logoText,
      card1X + (cardWidth - logoWidth) / 2,
      card1StartY + 25 + 5,
    );

    // ============ CARD 2: Back (Info + QR Side) - PORTRAIT ============
    // Dark gray background (#3b3b3d) - NO WHITE SCREEN
    pdf.setFillColor(59, 59, 61);
    pdf.roundedRect(card2X, cardY, cardWidth, cardHeight, 2, 2, "F");

    const contentCenterX = card2X + cardWidth / 2;

    // QR Code - BIGGER SIZE and centered in upper area
    if (qrCodeDataUrl) {
      const qrSize = 40; // Much bigger QR code
      const qrX = card2X + (cardWidth - qrSize) / 2;
      const qrY = cardY + 6; // Top position with small margin
      pdf.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
    }

    // "Check me out" with wink icon - Raleway font
    pdf.setFont("Raleway", "bold"); // Raleway style - bold weight
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255); // Light gray text

    const checkMeText = "Check me out";
    const checkMeTextWidth = pdf.getTextWidth(checkMeText);
    const winkIconSize = 3.5;
    const winkIconPadding = 1.5;
    const totalContentWidth = checkMeTextWidth + winkIconPadding + winkIconSize;
    const contentStartX = contentCenterX - totalContentWidth / 2;

    pdf.text(checkMeText, contentStartX, cardY + cardHeight - 25);

    if (winkIconDataUrl) {
      const winkIconX = contentStartX + checkMeTextWidth + winkIconPadding;
      const winkIconY = cardY + cardHeight - 25 - winkIconSize + 0.5;
      pdf.addImage(
        winkIconDataUrl,
        "PNG",
        winkIconX,
        winkIconY,
        winkIconSize,
        winkIconSize,
      );
    }

    // Name with dash - PERFECTLY CENTERED at bottom
    pdf.setFont("Raleway", "italic"); // Modernline handwriting style
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255); // White text on dark background
    const userName = userInfo.displayName || "User Name";
    const nameWithDash = `— ${userName}`;
    const nameWidth = pdf.getTextWidth(nameWithDash);
    const nameX = contentCenterX - nameWidth / 2;
    pdf.text(nameWithDash, nameX, cardY + cardHeight - 15);

    // Save the PDF
    pdf.save(`ScanMeMaybe-Card-${qrCode.slice(0, 8)}.pdf`);
  };

  const generateWinkIconDataURL = () => {
    return new Promise((resolve) => {
      if (!winkIconRef.current) {
        return resolve(null);
      }
      toPng(winkIconRef.current)
        .then((dataUrl) => {
          resolve(dataUrl);
        })
        .catch((error) => {
          console.error("Failed to generate wink icon", error);
          resolve(null);
        });
    });
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
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div
          ref={winkIconRef}
          style={{ display: "inline-block", fontSize: "24px" }}
        >
          <FaRegGrinWink color="#FFC107" size={24} />
        </div>
      </div>
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
