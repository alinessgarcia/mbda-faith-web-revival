
import React from "react";

const Hero = () => {
  const scrollToQuemSomos = () => {
    const quemSomosSection = document.getElementById("quem-somos");
    if (quemSomosSection) {
      quemSomosSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-primary/40"></div>
      <div className="relative z-10 text-center p-4">
        <h1 className="mb-2 animate-fade-in">
          <span className="text-4xl md:text-5xl font-bold text-white block">
            Ministério Bíblico da
          </span>
          <span className="text-5xl md:text-7xl font-bold text-amber-400 block mt-2 relative inline-block">
            Reconciliação
            <span className="block h-1 bg-amber-400 w-full mt-2 mx-auto"></span>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Igreja cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual.
        </p>
        <button
          onClick={scrollToQuemSomos}
          className="btn-secondary animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          Conheça Mais
        </button>
      </div>
    </section>
  );
};

export default Hero;
