import { MapPin, MessageCircle, MoveUpRight } from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { scrollToTop } = useScrollTo();

  return (
    <footer className="relative overflow-hidden bg-[#082f65] text-white">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0f4ea8]/25 via-transparent to-[#072a59]/65" />

      <div className="container mx-auto relative z-10 px-4 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <h3 className="text-xl font-bold">MBdaReconciliação</h3>
            <p className="mt-3 text-white/80">
              Igreja cristã voltada ao ensino da Palavra, comunhão familiar e edificação espiritual.
            </p>
            <p className="mt-4 text-sm text-white/75 leading-relaxed">
              Av. Osvaldo Aranha, nº 790
              <br />
              Jardim Maravilha (Vicente de Carvalho)
              <br />
              Guarujá/SP - CEP 11470-100
            </p>
          </article>

          <article className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <h3 className="text-xl font-bold">Atalhos</h3>
            <div className="mt-4 space-y-3">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-white/85 transition-colors hover:text-white"
              >
                <MoveUpRight className="h-4 w-4" />
                Voltar ao início
              </button>

              <a
                href="https://maps.app.goo.gl/zbXh9cc38umsD9bU7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-white/85 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                Abrir localização no mapa
              </a>
            </div>
          </article>

          <article className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <h3 className="text-xl font-bold">Horários</h3>
            <ul className="mt-4 space-y-2 text-white/85 text-sm">
              <li>Domingo: 08:00 / 09:00 / 11:00</li>
              <li>Quarta-feira: 20:00 - Oração e Palavra</li>
              <li>Sexta-feira: 20:00 - Oração e Palavra (online)</li>
            </ul>

            <a
              href="https://wa.me/+5513981517913"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              +55 (13) 98151-7913
            </a>
          </article>
        </div>

        <div className="mt-8 border-t border-white/20 pt-5 text-center text-sm text-white/65">
          © {currentYear} MBdaReconciliação - Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;
