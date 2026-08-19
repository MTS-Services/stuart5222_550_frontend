/**
 * Shared helpers for structured profile images (face, fullbody, toothyGrin, extras).
 */

/** Pre-R2 / local-server URLs are not usable after the Cloudflare migration. */
export const isUsableProfileImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.endsWith(".r2.dev") ||
      host.endsWith(".r2.cloudflarestorage.com")
    );
  } catch {
    return false;
  }
};

export const getExtrasFromStructured = (extras) => {
  if (!extras) return [];
  if (Array.isArray(extras)) {
    return extras
      .filter(Boolean)
      .map((url, i) => ({ url, label: `Extra ${i + 1}`, required: false }));
  }
  return Object.entries(extras)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, url], i) => ({ url, label: `Extra ${i + 1}`, required: false }));
};

export const buildOrderedImagesFromProfile = (userProfile) => {
  const structuredImages =
    userProfile?.imagesJson || userProfile?.images || {};
  const fallbackImages = userProfile?.imageUrls || userProfile?.image || [];

  const ordered = [];

  if (structuredImages.face) {
    ordered.push(
      typeof structuredImages.face === "string"
        ? { url: structuredImages.face }
        : structuredImages.face,
    );
  }
  if (structuredImages.fullbody) {
    ordered.push(
      typeof structuredImages.fullbody === "string"
        ? { url: structuredImages.fullbody }
        : structuredImages.fullbody,
    );
  }
  if (structuredImages.toothyGrin) {
    ordered.push(
      typeof structuredImages.toothyGrin === "string"
        ? { url: structuredImages.toothyGrin }
        : structuredImages.toothyGrin,
    );
  }

  getExtrasFromStructured(structuredImages.extras).forEach((item) => {
    ordered.push({ url: item.url });
  });

  if (ordered.length > 0) return ordered;

  return fallbackImages.map((img) =>
    typeof img === "string" ? { url: img } : img,
  );
};

export const imagesJsonHasUrls = (json) => {
  if (!json) return false;
  if (json.face || json.fullbody || json.toothyGrin) return true;
  return getExtrasFromStructured(json.extras).length > 0;
};

/** Build edit-form image slots from API profile (structured JSON + imageUrls fallback). */
export const buildImageSlotsFromProfile = (profile) => {
  const makeFilledSlot = (url, imageType, extraKey) => ({
    file: null,
    preview: url,
    id: `existing-${imageType}-${extraKey || "main"}`,
    isEmpty: false,
    isExisting: true,
    originalUrl: url,
    imageType,
    extraKey,
  });

  const makeEmptySlot = (imageType) => ({
    file: null,
    preview: null,
    id: null,
    isEmpty: true,
    isExisting: false,
    originalUrl: null,
    imageType,
  });

  const ordered = buildOrderedImagesFromProfile(profile);

  if (ordered.length === 0) {
    return [makeEmptySlot("face"), makeEmptySlot("fullbody"), makeEmptySlot("toothyGrin")];
  }

  const slots = ordered.map((img, index) => {
    const url = typeof img === "string" ? img : img?.url;
    const imageType =
      index === 0 ? "face" : index === 1 ? "fullbody" : index === 2 ? "toothyGrin" : "extra";
    return makeFilledSlot(url, imageType, index > 2 ? String(index - 2) : undefined);
  });

  while (slots.length < 3) {
    const type = slots.length === 0 ? "face" : slots.length === 1 ? "fullbody" : "toothyGrin";
    slots.push(makeEmptySlot(type));
  }

  return reassignSlotTypes(slots);
};

export const buildImagesJsonFromSlots = (slots) => {
  const json = { extras: {} };

  const filled = slots.filter((slot) => !slot.isEmpty);

  filled.forEach((slot, index) => {
    const url = slot.isExisting ? slot.originalUrl : null;
    if (!url || !isUsableProfileImageUrl(url)) return;

    if (index === 0) json.face = url;
    else if (index === 1) json.fullbody = url;
    else if (index === 2) json.toothyGrin = url;
    else json.extras[String(index - 2)] = url;
  });

  return json;
};

/** Flat URL array in display order (for reorder API compatibility). */
export const buildImageOrderFromSlots = (slots) =>
  slots
    .filter((slot) => !slot.isEmpty && slot.originalUrl)
    .map((slot) => slot.originalUrl);

/** True if slots contain at least one existing URL or new file to send. */
export const slotsHaveImageData = (slots) =>
  slots.some((slot) => !slot.isEmpty && (slot.originalUrl || slot.file));

export const getPhotoSlotLabel = (_slot, idx) => `Photo ${idx + 1}`;

export const getImageTypeLabel = (slot, idx) => {
  const type = slot.imageType;
  if (type === "face") return "Face";
  if (type === "fullbody") return "Full Body";
  if (type === "toothyGrin") return "Toothy Grin";
  if (type === "extra") return `Extra ${slot.extraKey || idx - 2}`;
  if (idx === 0) return "Face";
  if (idx === 1) return "Full Body";
  if (idx === 2) return "Toothy Grin";
  return `Extra ${idx - 2}`;
};

/** Reassign imageType/extraKey based on slot position after reorder. */
export const reassignSlotTypes = (slots) =>
  slots.map((slot, idx) => {
    const imageType =
      idx === 0 ? "face" : idx === 1 ? "fullbody" : idx === 2 ? "toothyGrin" : "extra";
    return {
      ...slot,
      imageType,
      extraKey: idx > 2 ? String(idx - 2) : undefined,
    };
  });

/** Move a slot from one index to another; returns new array or null if no change. */
export const movePhotoSlot = (slots, fromIndex, toIndex) => {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= slots.length ||
    toIndex >= slots.length
  ) {
    return null;
  }
  const updated = [...slots];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return reassignSlotTypes(updated);
};
