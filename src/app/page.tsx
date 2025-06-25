import StickyHeader from "@/components/nav";
import Logo from "@/components/logo";
import Bumper from "@/components/bumper";
import Experience from "@/components/experience";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <StickyHeader />
      
      {/* Logo Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <Logo />
      </section>

      {/* About Section Bumper */}
      <Bumper 
        number="01" 
        sectionHeader="ABOUT" 
        id="about"
      />

      {/* Experience Section */}
      <section id="experience">
        <Experience />
      </section>

      {/* Work Section Bumper */}
      <Bumper 
        number="02" 
        sectionHeader="WORK" 
        id="work"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}