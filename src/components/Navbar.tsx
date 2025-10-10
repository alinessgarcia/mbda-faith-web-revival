
import { useState } from "react";
import { Radio } from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollToTop, scrollToSection } = useScrollTo();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleScrollToTop = () => {
    scrollToTop();
    closeMenu();
  };

  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId);
    closeMenu();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-blue py-2">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between md:justify-start items-center">
          <div
            className="flex items-center cursor-pointer md:mr-16"
            onClick={scrollToTop}
          >
            <img
              src="/images/logo-maio.png"
              alt="MBdA Reconciliação Logo"
              className="h-10 md:h-12"
            />
            <span className="nav-link font-bold font-roboto text-lg md:text-xl ml-1">
              <span className="md:hidden">MBdaReconciliação</span>
              <span className="hidden md:inline">MBdaR</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 flex-1">
            <button onClick={scrollToTop} className="nav-link" type="button">
              Início
            </button>
            <button onClick={() => scrollToSection("quem-somos")} className="nav-link" type="button">
              Quem Somos
            </button>
            <button onClick={() => scrollToSection("declaracao-de-fe")} className="nav-link" type="button">
              Declaração de Fé
            </button>
            <button onClick={() => scrollToSection("devocional")} className="nav-link" type="button">
              Devocional
            </button>
            <button onClick={() => scrollToSection("estudos-biblicos")} className="nav-link" type="button">
              Estudos Bíblicos
            </button>
            <button onClick={() => scrollToSection("seterec")} className="nav-link" type="button">
              S.E.T.E.R.E.C
            </button>
            <button onClick={() => scrollToSection("agenda")} className="nav-link" type="button">
              Agenda
            </button>
            <button onClick={() => scrollToSection("espaco-familia")} className="nav-link" type="button">
              Espaço Família
            </button>
            <button onClick={() => scrollToSection("midia")} className="nav-link" type="button">
              Mídia
            </button>
            <a
              href="/blog/index.html"
              className="nav-link"
            >
              Blog
            </a>
            <button onClick={() => scrollToSection("contato")} className="nav-link" type="button">
              Contato
            </button>
            <a
              href="https://www.ipb.org.br/projetos-radio-ipb.php"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link flex items-center"
            >
              <Radio className="h-5 w-5 mr-1 radio-icon" />
              <span className="sr-only">Hinos Antigos</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 glass-blue rounded-lg p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <button
                onClick={scrollToTop}
                className="nav-link"
                type="button"
              >
                Início
              </button>
              <button
                onClick={() => {
                  scrollToSection("quem-somos");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Quem Somos
              </button>
              <button
                onClick={() => {
                  scrollToSection("declaracao-de-fe");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Declaração de Fé
              </button>
              <button
                onClick={() => {
                  scrollToSection("devocional");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Devocional
              </button>
              <button
                onClick={() => {
                  scrollToSection("estudos-biblicos");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Estudos Bíblicos
              </button>
              <button
                onClick={() => {
                  scrollToSection("seterec");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                S.E.T.E.R.E.C
              </button>
              <button
                onClick={() => {
                  scrollToSection("agenda");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Agenda
              </button>
              <button
                onClick={() => {
                  scrollToSection("espaco-familia");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Espaço Família
              </button>
              <button
                onClick={() => {
                  scrollToSection("midia");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Mídia
              </button>
              <a
                href="/blog/index.html"
                className="nav-link"
                onClick={closeMenu}
              >
                Blog
              </a>
              <button
                onClick={() => {
                  scrollToSection("contato");
                  closeMenu();
                }}
                className="nav-link"
                type="button"
              >
                Contato
              </button>
              <a
                href="https://www.ipb.org.br/projetos-radio-ipb.php"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link flex items-center"
                onClick={closeMenu}
              >
                <Radio className="h-5 w-5 mr-1 radio-icon" />
                <span>Hinos Antigos</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
