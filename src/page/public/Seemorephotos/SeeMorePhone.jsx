import { IoMdArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] h-screen">
      <div className="max-w-[600px] mx-auto">
        <h3
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white mb-3 cursor-pointer"
        >
          <IoMdArrowBack /> Back
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="col-span-1">
              <Link to={`/lets-connect`}>
                <img
                  src={image.img}
                  alt="preview"
                  className="w-full h-full rounded-xl bg-cover object-cover"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
