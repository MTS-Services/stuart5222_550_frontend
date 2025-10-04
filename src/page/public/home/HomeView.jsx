import AboutSection from "./components/AboutSection";
import { HeroSection } from "./components/HeroSection";

export const HomeView = () => {
  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 font-raleway bg-[#3B3B3D]">
      <HeroSection />
      <AboutSection/>
    </div>
  );
};
