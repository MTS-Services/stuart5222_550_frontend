/** Combine legal first + last into the existing User.name string (no schema change). */
export function combineLegalName(firstName, lastName) {
  return [firstName, lastName]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ");
}
