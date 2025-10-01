import AboutSection from "./components/AboutSection";
import FooterCard from "./components/FooterCard";
import { ScanSection } from "./components/ScanSection";
import SignupForm from "./components/SignupForm";

export const HomeView = () => {
  return <div className="p-2 sm:p-4 md:p-6 lg:p-8">
    <ScanSection/>
    <AboutSection/>
    <SignupForm/>
    <FooterCard/>
  </div>;
};
