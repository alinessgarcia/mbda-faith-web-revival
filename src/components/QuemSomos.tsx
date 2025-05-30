import React from "react";

const QuemSomos = () => {
  return (
    <section
      id="quem-somos"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-blue-100"
    >
      {/* Elementos decorativos */}
<div className="absolute inset-0 opacity-10">
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
</div>
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center max-w-fit mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg text-blue-900">
            Quem Somos
          </h2>
          <div className="h-1 w-full bg-blue-900 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className="order-2 lg:order-1 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <p className="text-white/95 mb-6 text-lg leading-relaxed">
                Somos o Ministério Bíblico da Reconciliação, uma comunidade cristã dedicada ao amor, à fé e à transformação espiritual. Nosso ministério é um espaço de encontro, reflexão e crescimento, onde todos são bem-vindos a desenvolver um relacionamento mais profundo com Deus.
              </p>
              <p className="text-white/95 mb-6 text-lg leading-relaxed">
                Nossa missão é proclamar a mensagem de Cristo a todas as pessoas, promovendo a reconciliação com Deus e com o próximo. Buscamos ser uma igreja relevante, que vive e aplica os princípios bíblicos na realidade do mundo atual.
              </p>
              <p className="text-white/95 text-lg leading-relaxed">
                Valorizamos a autenticidade, a comunhão e o discipulado. Somos uma família espiritual que caminha unida, apoiando uns aos outros e servindo com amor à comunidade ao nosso redor.
              </p>
              {/* Stats or highlights */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">22+</div>
                  <div className="text-white/80 text-sm">Anos de Ministério</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">500+</div>
                  <div className="text-white/80 text-sm">Famílias</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">3</div>
                  <div className="text-white/80 text-sm">Cultos Semanais</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="order-1 lg:order-2 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
  <a
    href="https://www.google.com/maps?q=igreja+mbda+reconciliacao"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Abrir localização no Google Maps"
  >
    <img
      src="https://i.imgur.com/SWiMFCc.jpg"
      alt="Igreja MBdaReconciliação - Vista da fachada e ambiente da comunidade cristã"
      className="rounded-xl shadow-2xl object-cover h-[400px] w-full transition-transform duration-300 group-hover:scale-105 cursor-pointer"
      loading="lazy"
    />
  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuemSomos;