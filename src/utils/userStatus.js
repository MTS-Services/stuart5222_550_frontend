/** Frontend-only labels for user statuses (DB enum values unchanged). */
export function formatUserStatusLabel(status) {
  switch (status) {
    case "PAID_SETUP":
      return "Needs Edits";
    case "PROFILE_PENDING":
      return "Awaiting Approval";
    case "WAITLIST":
      return "Waitlist";
    case "ACTIVE":
      return "Active";
    case "REJECTED":
      return "Rejected";
    case "VERIFIED":
      return "Verified";
    default:
      return status || "—";
  }
}

export function getUserStatusColor(status) {
  switch (status) {
    case "WAITLIST":
      return "text-yellow-600 font-semibold";
    case "ACTIVE":
      return "text-orange-400 font-semibold";
    case "REJECTED":
      return "text-red-600 font-semibold";
    case "PAID_SETUP":
      return "text-purple-500 font-semibold";
    case "PROFILE_PENDING":
      return "text-blue-600 font-semibold";
    case "VERIFIED":
      return "text-green-500 font-semibold";
    default:
      return "text-gray-600 font-medium";
  }
}

/** Split account `name` into legal first / last for admin display (no DB fields). */
export function splitLegalName(fullName = "") {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}
