import {
  CalendarDays,
  ChevronRight,
  Ellipsis,
  HandHeart,
  Home,
  Search,
  Video,
} from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";

const upcomingEvents = [
  {
    date: "29/OUT",
    time: "10:00",
    title: "Culto de Celebração",
    location: "Santuário Principal",
  },
  {
    date: "30/OUT",
    time: "20:00",
    title: "Reunião de Oração",
    location: "Templo Principal",
  },
  {
    date: "02/NOV",
    time: "19:30",
    title: "Culto de Jovens",
    location: "Auditório",
  },
];

const ministryCards = [
  { title: "Jovens", subtitle: "Comunidade e discipulado" },
  { title: "Louvor", subtitle: "Adoração e música" },
  { title: "Escola Bíblica", subtitle: "Formação na Palavra" },
  { title: "Mídia", subtitle: "Sermões e conteúdos" },
];

const StitchHomeShell = () => {
  const { scrollToTop, scrollToSection } = useScrollTo();

  return (
    <section
      className="stitch-shell relative overflow-hidden pb-28 md:pb-16"
      style={{ fontFamily: "Manrope, Roboto, sans-serif" }}
    >
      <div className="container mx-auto px-4 md:px-6 pt-4 md:pt-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="stitch-topbar">
            <button type="button" onClick={scrollToTop} className="stitch-brand">
              MBdaReconciliação
            </button>
            <nav className="stitch-top-actions" aria-label="Atalhos principais">
              <button type="button" onClick={() => scrollToSection("agenda")}>
                Agenda
              </button>
              <button type="button" onClick={() => scrollToSection("contato")}>
                Contato
              </button>
            </nav>
          </header>

          <button
            type="button"
            className="stitch-search w-full text-left"
            aria-label="Pesquisar no site"
          >
            <span className="flex items-center gap-3 text-white/70">
              <Search className="h-5 w-5" />
              <span className="text-base md:text-lg">Pesquisar no site</span>
            </span>
          </button>

          <article className="stitch-hero-card stitch-hero-card-minimal">
            <img
              src="/images/desktop-hero.png"
              alt="Culto com ministração da Palavra"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="stitch-hero-overlay" />

            <div className="stitch-hero-content">
              <p className="stitch-eyebrow">Culto da Semana</p>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
                Ministério Bíblico
                <br />
                da Reconciliação
              </h1>
              <p className="mt-3 text-white/85 max-w-xl">
                Comunidade bíblica, ensino fiel da Palavra e cuidado com famílias.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/@mbdareconciliacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stitch-gradient-btn"
                >
                  Assistir mensagem
                </a>
                <a
                  href="https://wa.me/+5513981517913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stitch-outline-btn"
                >
                  Falar com a igreja
                </a>
              </div>
            </div>
          </article>

          <section className="space-y-4">
            <div className="flex items-center justify-between text-white">
              <h2 className="text-3xl font-bold tracking-tight">Agenda Semanal</h2>
              <button
                type="button"
                onClick={() => scrollToSection("agenda")}
                className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors"
              >
                Ver agenda <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="stitch-scroll-row">
              {upcomingEvents.map((event) => (
                <article key={`${event.title}-${event.date}`} className="stitch-event-card stitch-event-card-minimal">
                  <p className="stitch-event-meta">
                    {event.date} • {event.time}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight">{event.title}</h3>
                  <p className="text-white/80 mt-1 text-sm md:text-base">{event.location}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => scrollToSection("quem-somos")}
              className="stitch-story-card text-left"
            >
              <img
                src="/images/familia.jpg"
                alt="Comunidade reunida"
                className="h-20 w-24 rounded-xl object-cover shrink-0"
                loading="lazy"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">Nossa História</h3>
                <p className="text-white/75 text-sm md:text-base">
                  Conheça nossa jornada de fé, discipulado e serviço.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("contato")}
              className="stitch-simple-card text-left"
            >
              <div>
                <h3 className="text-2xl font-bold text-white">Pedidos de Oração</h3>
                <p className="text-white/75 text-sm md:text-base">
                  Compartilhe seu pedido e vamos orar juntos como família.
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-white/90" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {ministryCards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => scrollToSection("espaco-familia")}
                  className="stitch-ministry-card text-left"
                >
                  <h4 className="text-2xl md:text-3xl font-bold text-white">{card.title}</h4>
                  <p className="text-sm md:text-base text-white/80 mt-1">{card.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="stitch-bottom-dock md:hidden" role="navigation" aria-label="Atalhos">
        <button type="button" onClick={scrollToTop} className="stitch-dock-item">
          <Home className="h-5 w-5" />
          <span>Início</span>
        </button>
        <button type="button" onClick={() => scrollToSection("midia")} className="stitch-dock-item">
          <Video className="h-5 w-5" />
          <span>Sermões</span>
        </button>
        <button type="button" onClick={() => scrollToSection("agenda")} className="stitch-dock-item">
          <CalendarDays className="h-5 w-5" />
          <span>Eventos</span>
        </button>
        <button type="button" onClick={() => scrollToSection("contato")} className="stitch-dock-item">
          <HandHeart className="h-5 w-5" />
          <span>Doar</span>
        </button>
        <button type="button" onClick={() => scrollToSection("reconnews")} className="stitch-dock-item">
          <Ellipsis className="h-5 w-5" />
          <span>Mais</span>
        </button>
      </div>
    </section>
  );
};

export default StitchHomeShell;
