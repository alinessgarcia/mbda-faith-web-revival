import NewsSlider from "./NewsSlider";
import NewspaperHeroSlider from "./NewspaperHeroSlider";

// Permite alternar o estilo do slider via env:
// VITE_NEWS_SLIDER_STYLE = 'legacy' | 'banners'
const sliderStyle = (import.meta as any)?.env?.VITE_NEWS_SLIDER_STYLE ?? 'legacy';
const SliderComponent = sliderStyle === 'banners' ? NewsSlider : NewspaperHeroSlider;

const Hero = () => {
  return (
    <section className="hero-section bg-black/60 relative">
      {/* News Slider - Full Width (com banners intercalados) */}
      <div className="absolute left-0 right-0 bottom-0 top-14 md:top-16 z-30">
        <SliderComponent />
      </div>
    </section>
  );
};

export default Hero;