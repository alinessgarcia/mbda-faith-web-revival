import NewspaperHeroSlider from "./NewspaperHeroSlider";

const Hero = () => {
  return (
    <section className="hero-section bg-black/60 relative">
      {/* News Slider - Full Width */}
      <div className="absolute left-0 right-0 bottom-0 top-14 md:top-16 z-30">
        <NewspaperHeroSlider />
      </div>
    </section>
  );
};

export default Hero;