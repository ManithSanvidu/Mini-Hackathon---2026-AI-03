import Hero from '../components/Hero';
import Features from '../components/Features';
import MapSection from '../components/MapSection';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Hero />
      <Features />
      <MapSection />
      <CTA />
    </div>
  );
};

export default Home;
