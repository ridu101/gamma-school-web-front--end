import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import Statistics from "@/components/Statistics";
import AboutSchool from "@/components/AboutSchool";
import SearchSection from "@/components/SearchSection";
import Services from "@/components/Services";
import NoticeBoard from "@/components/NoticeBoard";
import Teachers from "@/components/Teachers";
import StudentPortal from "@/components/StudentPortal";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ডিজিটাল বিদ্যালয় | আধুনিক শিক্ষা ও ডিজিটাল সেবা প্ল্যাটফর্ম" },
      {
        name: "description",
        content:
          "ডিজিটাল বিদ্যালয়ের অফিসিয়াল ওয়েবসাইট — বিদ্যালয় পরিচিতি, সেবাসমূহ, নোটিশ, শিক্ষকবৃন্দ, শিক্ষার্থী পোর্টাল, গ্যালারি ও যোগাযোগের সব তথ্য এক জায়গায়।",
      },
      { property: "og:title", content: "ডিজিটাল বিদ্যালয় | আধুনিক শিক্ষা ও ডিজিটাল সেবা প্ল্যাটফর্ম" },
      {
        property: "og:description",
        content:
          "ফলাফল, উপস্থিতি, ক্লাস রুটিন, নোটিশ ও শিক্ষক তথ্য — শিক্ষার্থী ও অভিভাবকদের জন্য একটি আধুনিক ডিজিটাল শিক্ষা প্ল্যাটফর্ম।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main>
        <HeroCarousel />
        <Statistics />
        <AboutSchool />
        <SearchSection />
        <Services />
        <NoticeBoard />
        <Teachers />
        <StudentPortal />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
