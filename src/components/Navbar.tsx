
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Radio } from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";
import { NAVIGATION_ITEMS } from "../constants";

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
        <div className="flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={scrollToTop}
          >
            <img
              src="https://i.imgur.com/SWj1IpT.png"
              alt="MBdA Reconciliação Logo"
              className="h-10 md:h-12"
            />
            <span className="ml-2 nav-link font-bold font-roboto text-lg md:text-xl">MBdaR</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
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
            <button onClick={() => scrollToSection("sites-sugestivos")} className="nav-link" type="button">
              Sites
            </button>
            <Link
              to="/blog"
              className="nav-link"
            >
              Blog
            </Link>
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
                onClick={() => scrollToSection("quem-somos")}
                className="nav-link"
                type="button"
              >
                Quem Somos
              </button>
              <button
                onClick={() => scrollToSection("declaracao-de-fe")}
                className="nav-link"
                type="button"
              >
                Declaração de Fé
              </button>
              <button
                onClick={() => scrollToSection("devocional")}
                className="nav-link"
                type="button"
              >
                Devocional
              </button>
              <button
                onClick={() => scrollToSection("estudos-biblicos")}
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
                onClick={() => scrollToSection("agenda")}
                className="nav-link"
                type="button"
              >
                Agenda
              </button>
              <button
                onClick={() => scrollToSection("espaco-familia")}
                className="nav-link"
                type="button"
              >
                Espaço Família
              </button>
              <button
                onClick={() => scrollToSection("midia")}
                className="nav-link"
                type="button"
              >
                Mídia
              </button>
              <button
                onClick={() => scrollToSection("sites-sugestivos")}
                className="nav-link"
                type="button"
              >
                Sites
              </button>
              <Link
                to="/blog"
                className="nav-link"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <button
                onClick={() => scrollToSection("contato")}
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
