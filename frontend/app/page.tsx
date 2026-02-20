import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { PlatformPreview } from "@/components/home/PlatformPreview";
import { LabsGrid } from "@/components/home/LabsGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { UniversityAlignment } from "@/components/home/UniversityAlignment";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />
        <PlatformPreview />
        <LabsGrid />
        <HowItWorks />
        <UniversityAlignment />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
