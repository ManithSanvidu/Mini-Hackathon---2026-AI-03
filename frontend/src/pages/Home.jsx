import Hero from '../components/Hero';
import Features from '../components/Features';
import MapSection from '../components/MapSection';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <div 
      className="flex flex-col min-h-screen font-sans relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2069&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10">
        <Hero />
        <Features />
        <MapSection />
        <CTA />
      </div>
    </div>
  );
};

export default Home;
