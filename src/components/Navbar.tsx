
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Removed isScrolled state and conditional styling since we want the glass effect always visible

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetPosition = section.offsetTop - 100; // Adjust offset as needed
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      closeMenu();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect py-2">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img
              src="https://via.placeholder.com/150x50.webp?text=MBdA+Logo"
              alt="MBdA Reconciliação Logo"
              className="h-10 md:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection("quem-somos")} className="nav-link">
              Quem Somos
            </button>
            <button onClick={() => scrollToSection("declaracao-de-fe")} className="nav-link">
              Declaração de Fé
            </button>
            <button onClick={() => scrollToSection("devocional")} className="nav-link">
              Devocional
            </button>
            <button onClick={() => scrollToSection("estudos-biblicos")} className="nav-link">
              Estudos Bíblicos
            </button>
            <button onClick={() => scrollToSection("seterec")} className="nav-link">
              S.E.T.E.R.E.C
            </button>
            <button onClick={() => scrollToSection("agenda")} className="nav-link">
              Agenda
            </button>
            <button onClick={() => scrollToSection("espaco-familia")} className="nav-link">
              Espaço Família
            </button>
            <button onClick={() => scrollToSection("midia")} className="nav-link">
              Mídia
            </button>
            <button onClick={() => scrollToSection("contato")} className="nav-link">
              Contato
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-primary focus:outline-none"
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
          <div className="md:hidden mt-4 glass-effect rounded-lg p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("quem-somos")}
                className="nav-link"
              >
                Quem Somos
              </button>
              <button
                onClick={() => scrollToSection("declaracao-de-fe")}
                className="nav-link"
              >
                Declaração de Fé
              </button>
              <button
                onClick={() => scrollToSection("devocional")}
                className="nav-link"
              >
                Devocional
              </button>
              <button
                onClick={() => scrollToSection("estudos-biblicos")}
                className="nav-link"
              >
                Estudos Bíblicos
              </button>
              <button
                onClick={() => scrollToSection("seterec")}
                className="nav-link"
              >
                S.E.T.E.R.E.C
              </button>
              <button
                onClick={() => scrollToSection("agenda")}
                className="nav-link"
              >
                Agenda
              </button>
              <button
                onClick={() => scrollToSection("espaco-familia")}
                className="nav-link"
              >
                Espaço Família
              </button>
              <button
                onClick={() => scrollToSection("midia")}
                className="nav-link"
              >
                Mídia
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="nav-link"
              >
                Contato
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
