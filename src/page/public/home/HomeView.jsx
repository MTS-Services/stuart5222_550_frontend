import AboutSection from "./section/AboutSection";
import HeroSection from "./section/HeroSection";
// import HowSection from "./section/HowSection";

const HomeView = () => {
  return (
    <div className="gap-[60px] overflow-hidden bg-[#3B3B3D] px-[10px] font-raleway">
      <HeroSection />
      <AboutSection />
      {/* <HowSection /> */}
    </div>
  );
};

export default HomeView;
