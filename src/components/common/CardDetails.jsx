import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaQrcode,
  FaEye,
  FaChartBar,
  FaHistory,
  FaCheckCircle,
  FaLink,
  FaGlobe,
  FaDesktop,
  FaCalendarAlt,
  FaDownload,
  FaShareAlt,
  FaCopy,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  MdQrCodeScanner,
  MdVisibility,
  MdCheckCircle,
  MdLink,
  MdPublic,
  MdDevices,
  MdCalendarToday,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

const CardDetails = ({ user }) => {
  const { qrCodeList } = useSelector((state) => state.dashboard);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const cardData = qrCodeList?.[0] || null;

  if (!cardData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-4">
            <MdQrCodeScanner className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            No Card Data Available
          </h3>
          <p className="text-gray-500">
            Please select a QR card to view details
          </p>
        </div>
      </div>
    );
  }

  const { scans, scansRemaining, scanUrl, createdAt, updatedAt, maxScans } =
    cardData;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get device info
  const getDeviceInfo = (userAgent) => {
    if (!userAgent) return { device: "Unknown", browser: "Unknown" };
    const deviceMatch = userAgent.match(/\((.*?)\)/);
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/\S+/);
    return {
      device: deviceMatch ? deviceMatch[1] : "Unknown Device",
      browser: browserMatch ? browserMatch[0] : "Unknown Browser",
    };
  };

  const lastScan = scans?.[0];
  const deviceInfo = lastScan ? getDeviceInfo(lastScan.userAgent) : null;

  // Calculate scan percentage
  const scanPercentage = ((scans?.length || 0) / maxScans) * 100;
  const totalScans = scans?.length || 0;

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(scanUrl);
    // You might want to add a toast notification here
  };

  // Filter and sort scans for table
  const filteredScans =
    scans?.filter(
      (scan) => scan.ipAddress !== null && scan.userAgent !== null,
    ) || [];

  const sortedScans = [...filteredScans].sort((a, b) => {
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortField === "ipAddress") {
      return sortDirection === "asc"
        ? (a.ipAddress || "").localeCompare(b.ipAddress || "")
        : (b.ipAddress || "").localeCompare(a.ipAddress || "");
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedScans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScans = sortedScans.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getBrowserIcon = (userAgent) => {
    if (!userAgent) return <MdDevices className="h-4 w-4" />;
    if (userAgent.includes("Chrome"))
      return <MdPublic className="h-4 w-4 text-green-500" />;
    if (userAgent.includes("Firefox"))
      return <MdPublic className="h-4 w-4 text-orange-500" />;
    if (userAgent.includes("Safari"))
      return <MdPublic className="h-4 w-4 text-blue-500" />;
    if (userAgent.includes("Edge"))
      return <MdPublic className="h-4 w-4 text-purple-500" />;
    return <MdDevices className="h-4 w-4 text-gray-500" />;
  };

  const getDeviceType = (userAgent) => {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Mobile")) return "Mobile";
    if (userAgent.includes("Tablet")) return "Tablet";
    if (userAgent.includes("Windows")) return "Desktop";
    if (userAgent.includes("Mac")) return "Desktop";
    return "Unknown";
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* QR Card Statistics */}

      <div className="">
        {/* Main Stats Cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 text-center">
            <div className="mb-2 text-4xl font-bold text-gray-800">
              {maxScans}
            </div>
            <div className="text-sm font-semibold text-green-600">
              Maximum Scans
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 text-center">
            <div className="mb-2 text-4xl font-bold text-gray-800">
              {totalScans}
            </div>
            <div className="text-sm font-semibold text-blue-600">
              Total Scans
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-5 text-center">
            <div className="mb-2 text-4xl font-bold text-gray-800">
              {scansRemaining}
            </div>
            <div className="text-sm font-semibold text-red-600">
              Remaining Scans
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Scan Usage Progress
            </span>
            <span className="text-sm font-bold text-gray-800">
              {totalScans} / {maxScans}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
              style={{ width: `${Math.min(scanPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>{Math.round(scanPercentage)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white p-4">
              <div className="mb-1 text-sm text-gray-500">Maximum Scans</div>
              <div className="text-xl font-bold text-gray-800">{maxScans}</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="mb-1 text-sm text-gray-500">Scan Rate</div>
              <div className="text-xl font-bold text-gray-800">
                {maxScans > 0 ? ((totalScans / maxScans) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white p-4">
              <div className="mb-1 flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-1 h-3 w-3" />
                Created
              </div>
              <div className="text-sm font-medium text-gray-800">
                {formatDate(createdAt)}
              </div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="mb-1 flex items-center text-sm text-gray-500">
                <MdCalendarToday className="mr-1 h-3 w-3" />
                Last Updated
              </div>
              <div className="text-sm font-medium text-gray-800">
                {formatDate(updatedAt)}
              </div>
            </div>
          </div>

          {/* Scan URL Section */}
          <div className="mt-6">
            <div className="mb-2 flex items-center text-sm font-medium text-gray-700">
              <MdLink className="mr-2 h-4 w-4 text-blue-500" />
              Scan URL
            </div>
            <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <div className="flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm text-blue-600">
                    {scanUrl}
                  </p>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    title="Copy URL"
                  >
                    <FaCopy className="h-4 w-4" />
                  </button>
                  <a
                    href={scanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600"
                    title="Open in new tab"
                  >
                    <FaShareAlt className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Scan Details */}
      <div className="pt-4">
        <div className="my-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
          <h2 className="flex items-center text-xl font-bold text-gray-800">
            <FaHistory className="mr-3 h-5 w-5 text-orange-500" />
            Last Scan Details
          </h2>
        </div>

        <div className="">
          {lastScan ? (
            <>
              {/* Last Scan Header */}
              <div className="mb-4 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1 text-sm font-medium text-gray-500">
                      Last Scan Time
                    </div>
                    <div className="flex items-center text-lg font-bold text-gray-800">
                      <MdCalendarToday className="mr-2 h-5 w-5 text-orange-500" />
                      {formatDate(lastScan.createdAt)}
                    </div>
                  </div>
                  <div className="rounded-full border border-orange-200 bg-white px-3 py-1">
                    <span className="text-sm font-semibold text-orange-600">
                      Latest
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 font-bold text-white">
                      <MdVisibility className="mr-2 h-5 w-5" />
                      SCAN #{totalScans}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan Details Grid */}
              <div className="space-y-5">
                {/* IP Address */}
                <DetailCard
                  icon={<MdPublic className="h-5 w-5 text-blue-500" />}
                  label="IP Address"
                  value={lastScan.ipAddress}
                  subtext="Location: United States"
                  color="blue"
                />

                {/* Device Info */}
                <DetailCard
                  icon={<MdDevices className="h-5 w-5 text-green-500" />}
                  label="Device Information"
                  value={deviceInfo?.device}
                  subtext={deviceInfo?.browser}
                  color="green"
                />

                {/* User Agent */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-700">
                    <FaDesktop className="mr-2 h-4 w-4 text-gray-500" />
                    Full User Agent
                  </div>
                  <div className="rounded-lg border border-gray-300 bg-white p-3">
                    <code className="break-all font-mono text-xs text-gray-600">
                      {lastScan.userAgent}
                    </code>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Scan State */
            <div className="py-12 text-center">
              <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-gray-100 to-gray-200 p-6">
                <MdVisibility className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-700">
                No Scan Activity Yet
              </h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500">
                This QR code hasn't been scanned yet. Share the URL to start
                tracking scans.
              </p>
              <div className="mx-auto max-w-md rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Share this URL:
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={scanUrl}
                    className="flex-1 truncate rounded-l-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="rounded-r-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white transition-opacity hover:opacity-90"
                  >
                    <FaCopy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scan History Table */}
      <div className="">
        <div className="px-0 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="flex items-center text-xl font-bold text-gray-800">
                <FaHistory className="mr-3 h-5 w-5 text-gray-500" />
                Scan History ({totalScans} scans)
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Complete list of all QR code scans
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          {filteredScans.length > 0 ? (
            <>
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-gray-500">
                      Timestamp
                    </th>
                    <th className="text-left text-xs uppercase tracking-wider text-gray-500">
                      IP Address
                    </th>
                    <th className="px-4 text-left text-xs uppercase tracking-wider text-gray-500">
                      Device
                    </th>
                    <th className="text-left text-xs uppercase tracking-wider text-gray-500">
                      Browser
                    </th>
                    <th className="text-center text-xs uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="text-center text-xs uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedScans.map((scan, index) => {
                    const deviceInfo = getDeviceInfo(scan.userAgent);
                    const deviceType = getDeviceType(scan.userAgent);
                    const browserIcon = getBrowserIcon(scan.userAgent);
                    const isExpanded = expandedRow === scan.id;

                    return (
                      <React.Fragment key={scan.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-2">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(scan.createdAt)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-2">
                            <div className="flex items-center">
                              <MdPublic className="mr-2 h-4 w-4 text-blue-500" />
                              <span className="font-mono text-sm text-gray-900">
                                {scan.ipAddress}
                              </span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-2">
                            <div className="flex items-center">
                              <div className="mr-2">
                                {deviceType === "Mobile" ? (
                                  <MdDevices className="h-4 w-4 text-green-500" />
                                ) : deviceType === "Tablet" ? (
                                  <MdDevices className="h-4 w-4 text-purple-500" />
                                ) : (
                                  <MdDevices className="h-4 w-4 text-blue-500" />
                                )}
                              </div>

                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {deviceType}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {deviceInfo.device.split(";")[0]}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="whitespace-nowrap py-2">
                            <div className="flex items-center">
                              {browserIcon}
                              <span className="ml-2 text-sm text-gray-900">
                                {deviceInfo.browser.split("/")[0]}
                              </span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap text-center">
                            <span className="inline-flex items-center rounded-full">
                              <MdCheckCircle className="mr-1 h-5 w-5 text-green-600" />
                            </span>
                          </td>

                          <td className="whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : scan.id)
                              }
                              className="flex items-center text-blue-600 hover:text-blue-900"
                            >
                              {isExpanded ? (
                                <>
                                  <MdExpandLess className="mr-1 h-4 w-4" />
                                  Less
                                </>
                              ) : (
                                <>
                                  <MdExpandMore className="mr-1 h-4 w-4" />
                                  More
                                </>
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Row Details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="bg-gray-50 px-4 py-4">
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-lg bg-white p-4 shadow-sm">
                                  <h4 className="mb-4 text-sm font-semibold text-gray-700">
                                    Full User Agent:
                                  </h4>

                                  <div className="space-y-2 text-sm">
                                    {/* User Agent */}
                                    <div>
                                      <span className="block font-semibold text-gray-700"></span>
                                      <code className="block break-all text-xs text-gray-600">
                                        {scan.userAgent}
                                      </code>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-lg bg-white p-4 shadow-sm">
                                  <h4 className="mb-3 text-sm font-semibold text-gray-700">
                                    Scan Information
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">
                                        Scan ID:
                                      </span>
                                      <span className="font-mono text-sm text-gray-700">
                                        {scan.id}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">
                                        Scan Number:
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        #{totalScans - index}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">
                                        QR Card ID:
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        {scan.qrCardId}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredScans.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredScans.length}</span>{" "}
                    scans
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                      <FaChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 inline-block rounded-full bg-gray-100 p-4">
                <FaSearch className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                No scans found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No scans match "${searchTerm}"`
                  : "No scan history available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Detail Card Component
const DetailCard = ({ icon, label, value, subtext, color }) => {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-start">
        <div className="mr-4 rounded-lg bg-white p-2 shadow-sm">{icon}</div>
        <div className="flex-1">
          <div className="mb-1 text-sm font-medium text-gray-500">{label}</div>
          <div className="mb-1 text-lg font-bold text-gray-800">{value}</div>
          {subtext && <div className="text-sm text-gray-600">{subtext}</div>}
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
