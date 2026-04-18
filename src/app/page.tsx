import StickyHeader from "@/components/nav";
import Logo from "@/components/logo";
import Bumper from "@/components/bumper";
import Projects from "@/components/projects";
import Footer from "@/components/footer";
import Bio from "@/components/bio";
import Experience from "@/components/experience";
import ScrollIndicator from "@/components/scroll-indicator";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <StickyHeader />

      {/* Hero — full-viewport logo section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative">
        <Logo />
        <ScrollIndicator />
      </section>

      <Bumper number="01" sectionHeader="ABOUT" id="about" />

      <section id="experience">
        <Bio />
        <Experience />
      </section>

      <Bumper number="02" sectionHeader="PROJECTS" id="projects" />

      <section>
        <Projects />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}
