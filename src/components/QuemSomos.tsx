const QuemSomos = () => {
  return (
    <section id="quem-somos" className="section-padding relative overflow-hidden bg-[#0b3a80]/95">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0f4ea8]/25 via-transparent to-[#072a59]/55" />

      <div className="container mx-auto relative z-10">
        <div className="mb-10 md:mb-12">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
            Institucional
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Quem Somos</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <article className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_14px_30px_rgba(2,22,64,0.28)] p-6 md:p-8">
            <p className="text-white/95 leading-relaxed">
              Somos o Ministério Bíblico da Reconciliação, uma comunidade cristã dedicada ao amor,
              à fé e à transformação espiritual. Nosso ministério é um espaço de encontro, reflexão
              e crescimento para famílias e para todos que desejam se aproximar de Deus.
            </p>

            <p className="text-white/85 leading-relaxed mt-4">
              Nossa missão é proclamar a mensagem de Cristo, promovendo reconciliação com Deus e com o
              próximo. Buscamos viver princípios bíblicos de forma prática, com ensino fiel da Palavra
              e serviço à comunidade.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-7 pt-5 border-t border-white/20">
              <div className="rounded-lg border border-white/15 bg-white/10 p-3 text-center">
                <p className="text-2xl font-bold text-white">22+</p>
                <p className="text-xs md:text-sm text-white/75 mt-1">Anos de ministério</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3 text-center">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs md:text-sm text-white/75 mt-1">Famílias</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3 text-center">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs md:text-sm text-white/75 mt-1">Cultos semanais</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_14px_30px_rgba(2,22,64,0.28)] overflow-hidden">
            <a
              href="https://share.google/EHGmpIZA2tg4CKlzP"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir localização no Google Maps"
              className="block h-full"
            >
              <div className="h-full flex flex-col">
                <img
                  src="https://i.imgur.com/SWiMFCc.jpg"
                  alt="Igreja MBdaReconciliação"
                  className="w-full h-64 md:h-[360px] object-cover"
                  loading="lazy"
                />
                <div className="p-5 md:p-6">
                  <h3 className="text-2xl font-bold text-white">Nossa Casa</h3>
                  <p className="text-white/80 mt-2 leading-relaxed">
                    Estamos em Guarujá/SP. Clique para abrir o mapa e planejar sua visita.
                  </p>
                  <span className="inline-flex mt-4 rounded-lg bg-[#1d64d8] px-3 py-2 text-sm font-semibold text-white">
                    Ver localização
                  </span>
                </div>
              </div>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
};

export default QuemSomos;
