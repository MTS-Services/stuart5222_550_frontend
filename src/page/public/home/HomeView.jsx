import AboutSection from "./section/AboutSection";
import HeroSection from "./section/HeroSection";

const HomeView = () => {
  return (
    <div className="gap-[60px] bg-[#3B3B3D] px-[10px] font-raleway">
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default HomeView;
