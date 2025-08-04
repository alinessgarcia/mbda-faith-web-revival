const QuemSomos = () => {
  return (
    <section
      id="quem-somos"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'rgba(0, 140, 227, 0.7)' }}
    >
      <div className="container mx-auto relative z-10">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">

          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg">
            ⛪ Quem Somos
          </h2>


        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className="order-2 lg:order-1 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <p className="text-blue-900 font-bold mb-6 text-lg leading-relaxed">
                Somos o Ministério Bíblico da Reconciliação, uma comunidade cristã dedicada ao amor, à fé e à transformação espiritual. Nosso ministério é um espaço de encontro, reflexão e crescimento, onde todos são bem-vindos a desenvolver um relacionamento mais profundo com Deus.
              </p>
              <p className="text-blue-900 font-bold mb-6 text-lg leading-relaxed">
                Nossa missão é proclamar a mensagem de Cristo a todas as pessoas, promovendo a reconciliação com Deus e com o próximo. Buscamos ser uma igreja relevante, que vive e aplica os princípios bíblicos na realidade do mundo atual.
              </p>
              <p className="text-blue-900 font-bold text-lg leading-relaxed">
                Valorizamos a autenticidade, a comunhão e o discipulado. Somos uma família espiritual que caminha unida, apoiando uns aos outros e servindo com amor à comunidade ao nosso redor.
              </p>
              {/* Stats or highlights */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">22+</div>
                  <div className="text-blue-900 font-bold text-sm">Anos de Ministério</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">500+</div>
                  <div className="text-blue-900 font-bold text-sm">Famílias</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">3</div>
                  <div className="text-blue-900 font-bold text-sm">Cultos Semanais</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="order-1 lg:order-2 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-black to-secondary rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

              <a
                href="https://share.google/EHGmpIZA2tg4CKlzP"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir localização no Google Maps"
              >
                <img
                  src="https://i.imgur.com/SWiMFCc.jpg"
                  alt="Igreja MBdaReconciliação - Vista da fachada e ambiente da comunidade cristã"
                  className="rounded-2xl shadow-2xl object-cover w-full h-full min-h-[350px] transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  loading="lazy"
                  style={{ aspectRatio: "1/1" }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default QuemSomos;