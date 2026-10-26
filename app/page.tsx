import { Header } from "./components/Header";
import { Verifier } from "./components/Verifier";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Verifier />
      <div className="mx-auto w-full max-w-6xl px-6 pb-10">
        <FaqSection />
      </div>
      <Footer />
    </>
  );
}
