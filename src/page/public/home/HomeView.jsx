import AboutSection from "./components/AboutSection";
import { HeroSection } from "./components/HeroSection";

export const HomeView = () => {
  return (
    <div className="px-[10px] font-raleway bg-[#3B3B3D] gap-[60px]">
      <HeroSection />
      <AboutSection/>
    </div>
  );
};
