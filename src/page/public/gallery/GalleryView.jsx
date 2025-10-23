import { IoMdArrowBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const GalleryView = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.profile);
  const images = userProfile?.images || [];

  return (
    <div className='px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D]'>
      <div className='max-w-[600px] mx-auto'>
        <h3
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-white mb-3 cursor-pointer'
        >
          <IoMdArrowBack /> Back
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {images.map((img, index) => (
            <div key={index} className='overflow-hidden rounded-lg'>
              <img
                src={img.url}
                alt={`Image ${index + 1}`}
                className='w-full h-full object-cover bg-yellow-200'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryView;
