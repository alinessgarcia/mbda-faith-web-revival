import NewsSlider from "./NewsSlider";

const Hero = () => {
  return (
    <section className="hero-section bg-black/60 relative">
      {/* News Slider - Full Width */}
      <div className="absolute inset-0 z-30">
        <NewsSlider />
      </div>
    </section>
  );
};

export default Hero;