
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src="https://via.placeholder.com/150x50.webp?text=MBdA+Logo"
              alt="MBdA Reconciliação Logo"
              className="h-10 md:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <a href="#quem-somos" className="nav-link">
              Quem Somos
            </a>
            <a href="#declaracao-de-fe" className="nav-link">
              Declaração de Fé
            </a>
            <a href="#devocional" className="nav-link">
              Devocional
            </a>
            <a href="#estudos-biblicos" className="nav-link">
              Estudos Bíblicos
            </a>
            <a href="#seterec" className="nav-link">
              S.E.T.E.R.E.C
            </a>
            <a href="#agenda" className="nav-link">
              Agenda
            </a>
            <a href="#espaco-familia" className="nav-link">
              Espaço Família
            </a>
            <a href="#midia" className="nav-link">
              Mídia
            </a>
            <a href="#contato" className="nav-link">
              Contato
            </a>
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
              <a
                href="#quem-somos"
                className="nav-link"
                onClick={closeMenu}
              >
                Quem Somos
              </a>
              <a
                href="#declaracao-de-fe"
                className="nav-link"
                onClick={closeMenu}
              >
                Declaração de Fé
              </a>
              <a
                href="#devocional"
                className="nav-link"
                onClick={closeMenu}
              >
                Devocional
              </a>
              <a
                href="#estudos-biblicos"
                className="nav-link"
                onClick={closeMenu}
              >
                Estudos Bíblicos
              </a>
              <a
                href="#seterec"
                className="nav-link"
                onClick={closeMenu}
              >
                S.E.T.E.R.E.C
              </a>
              <a
                href="#agenda"
                className="nav-link"
                onClick={closeMenu}
              >
                Agenda
              </a>
              <a
                href="#espaco-familia"
                className="nav-link"
                onClick={closeMenu}
              >
                Espaço Família
              </a>
              <a
                href="#midia"
                className="nav-link"
                onClick={closeMenu}
              >
                Mídia
              </a>
              <a
                href="#contato"
                className="nav-link"
                onClick={closeMenu}
              >
                Contato
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
