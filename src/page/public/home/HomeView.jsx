import AboutSection from './section/AboutSection';
import HeroSection from './section/HeroSection';

const HomeView = () => {
  return (
    <div className='px-[10px] font-raleway bg-[#3B3B3D] gap-[60px]'>
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default HomeView;
