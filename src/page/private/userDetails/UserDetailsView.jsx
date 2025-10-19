import { FaRegCalendar } from 'react-icons/fa';

import { GrLocation } from 'react-icons/gr';
import { Bio } from './components/Bio';
import Traveling from './components/Traveling';

const images = [
  { id: 1, image: '/img/page/admin/img1.png' },
  { id: 2, image: '/img/page/admin/img2.png' },
  { id: 3, image: '/img/page/admin/img3.png' },
  { id: 4, image: '/img/page/admin/img4.png' },
  { id: 5, image: '/img/page/admin/img5.png' },
];

const UserDetailsView = () => {
  return (
    <div className='text-black'>
      {/* Before Bio */}

      {/* After Bio */}
      <div className=''>
        <Bio
          image={'/img/page/admin/img5.png'}
          title={'Albert Flores'}
          email={'albertflores@gmail.com'}
          number={'(319) 555-0115'}
          age={'56'}
          height={'5’7'}
          bodyType={'Curvy'}
          deal={'Smokers'}
          paragraph1={
            'Hi, I’m Cheryl Ann — 56 years young, standing tall at 5’7” with a naturally curvy figure. I’m a warm, down-to-earth woman who values kindness, honesty, and meaningful connections over superficial small talk. I love spending my time with people who can make me laugh, share their passions, and hold deep, genuine conversations that go beyond the surface.'
          }
          paragraph2={
            'I enjoy cozy coffee dates, spontaneous weekend getaways, and evenings filled with good food and even better company. I’m looking to meet someone authentic and emotionally mature — someone who’s ready to build something real, not just swipe endlessly.'
          }
          paragraph3={
            'Smoking is a no-go for me. If you’re open-minded, kind-hearted, and know what you want, we might just get along beautifully.'
          }
        />
      </div>

      <Traveling />

      {/* Image And Textarea Fiend */}
      <div className='pt-8'>
        <div className=''>
          <h3 className='text-2xl text-[#252525] font-raleway font-semibold mb-5'>
            Images
          </h3>
          <div className='grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4'>
            {images.map((img) => (
              <div key={img.id} className='overflow-hidden rounded-lg'>
                <img
                  src={img.image}
                  alt={`Image ${img.id}`}
                  className='w-full h-full object-cover bg-yellow-200 '
                />
              </div>
            ))}
          </div>
        </div>
        <div className='p-4 border border-gray-100 bg-white rounded-lg my-6'>
          <h3 className='text-xl text-[#252525] font-raleway font-medium mb-4'>
            Cancel With Feedback.
          </h3>
          <textarea
            className='w-full max-h-[195px] min-h-[195px] font-raleway p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300'
            placeholder='Write a review message here...'
          />
          <button className='bg-[#FF8C00] text-black w-full py-2 rounded-[4px] mb-6'>
            Send
          </button>
          <div className='md:flex items-center gap-4 space-y-6 sm:space-y-0 md:w-[50%]'>
            <button className='bg-[#1BA400] text-white w-full py-2 rounded-[4px]'>
              Approved
            </button>
            <button className='bg-[#FF8C00] text-black w-full py-2 rounded-[4px]'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;
