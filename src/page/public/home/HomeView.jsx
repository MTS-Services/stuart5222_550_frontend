import { useEffect } from 'react';
import AboutSection from './section/AboutSection';
import HeroSection from './section/HeroSection';

import { useDispatch } from 'react-redux';
import { fetchAllChecks } from '../../../features/checks/checksFetch';

const HomeView = () => {
  // Fetch checks data on component mount
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllChecks());
  }, []);

  return (
    <div className='px-[10px] font-raleway bg-[#3B3B3D] gap-[60px]'>
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default HomeView;
