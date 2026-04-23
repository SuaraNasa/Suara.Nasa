import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import PosterPlaceholder from "@/sections/PosterPlaceholder";
import RegulationsSection from "@/sections/RegulationsSection";
import IkrarSection from "@/sections/IkrarSection";
import ReportFormSection from "@/sections/ReportFormSection";
import GuruCTASection from "@/sections/GuruCTASection";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <PosterPlaceholder />
        <RegulationsSection />
        <IkrarSection />
        <ReportFormSection />
        <GuruCTASection />
      </main>
      <Footer />
    </>
  );
}
