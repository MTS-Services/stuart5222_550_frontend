import { IoMdArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GalleryView = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.profile);

  // Prioritize structured images (face, fullbody, toothyGrin, extras) over imageUrls
  const structuredImages = userProfile?.images || {};
  const fallbackImages = userProfile?.imageUrls || [];

  // Create ordered array: face -> fullbody -> toothyGrin -> extras
  const orderedImages = [];

  // Add face image first
  if (structuredImages.face) {
    orderedImages.push(
      typeof structuredImages.face === "string"
        ? { url: structuredImages.face }
        : structuredImages.face,
    );
  }

  // Add fullbody image second
  if (structuredImages.fullbody) {
    orderedImages.push(
      typeof structuredImages.fullbody === "string"
        ? { url: structuredImages.fullbody }
        : structuredImages.fullbody,
    );
  }

  // Add toothyGrin image third
  if (structuredImages.toothyGrin) {
    orderedImages.push(
      typeof structuredImages.toothyGrin === "string"
        ? { url: structuredImages.toothyGrin }
        : structuredImages.toothyGrin,
    );
  }

  // Add extras images (last -> first)
  if (structuredImages.extras && Array.isArray(structuredImages.extras)) {
    [...structuredImages.extras].reverse().forEach((img) => {
      if (img) {
        orderedImages.push(typeof img === "string" ? { url: img } : img);
      }
    });
  }

  // If no structured images available, fall back to imageUrls array
  const images =
    orderedImages.length > 0
      ? orderedImages
      : fallbackImages.map((img) =>
          typeof img === "string" ? { url: img } : img,
        );

  return (
    <div className="mx-auto max-w-4xl bg-[#3B3B3D] px-[10px] py-2 sm:py-4 md:py-6 lg:py-8">
      <div className="">
        <h3
          onClick={() => navigate(-1)}
          className="mb-3 flex cursor-pointer items-center gap-2 text-white"
        >
          <IoMdArrowBack /> Back
        </h3>
        <div className="grid grid-cols-2 gap-4 py-8 md:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <img
                src={img.url}
                alt={`Image ${index + 1}`}
                className="h-full w-full bg-yellow-200 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryView;
