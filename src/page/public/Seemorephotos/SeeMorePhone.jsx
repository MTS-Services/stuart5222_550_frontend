import { IoMdArrowBack } from "react-icons/io";

const images = [
  { id: 1, img: "/img/page/chery/img2.jpg" },
  { id: 2, img: "/img/page/chery/img3.jpg" },
  { id: 3, img: "/img/page/chery/img3.jpg" },
  { id: 4, img: "/img/page/chery/img2.jpg" },
  { id: 5, img: "/img/page/chery/img3.jpg" },
  { id: 6, img: "/img/page/chery/img3.jpg" },
  { id: 7, img: "/img/page/chery/img2.jpg" },
  { id: 8, img: "/img/page/chery/img3.jpg" },
  { id: 9, img: "/img/page/chery/img2.jpg" },
];

export const SeeMorePhone = () => {
  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-[#3B3B3D] h-screen">
      <div className="max-w-[600px] mx-auto">
        <h3 className="flex items-center gap-2 text-white mb-3">
          <IoMdArrowBack /> Back
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div className="col-span-1">
              <img
                src={image.img}
                alt="preview"
                className="w-full h-full rounded-xl bg-cover object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
