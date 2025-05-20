
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";
import ChatBox from "../components/ChatBox";

const SeterecPage = () => {
  useEffect(() => {
    document.title = "S.E.T.E.R.E.C - MBdA Reconciliação";
    
    // Meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Seminário Teológico de Reconciliação Cristã - Formação para líderes");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="section-padding bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                S.E.T.E.R.E.C
              </h1>
              <p className="text-xl text-gray-600">
                Seminário Teológico de Reconciliação Cristã
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="S.E.T.E.R.E.C - Seminário Teológico"
                  className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Sobre o Seminário
                </h2>
                <p className="text-gray-700 mb-4">
                  O Seminário Teológico de Reconciliação Cristã (S.E.T.E.R.E.C) é um 
                  centro de formação teológica e ministerial, comprometido com o preparo 
                  de líderes para servir à igreja e à comunidade com excelência.
                </p>
                <p className="text-gray-700 mb-4">
                  Nossa visão é formar líderes cristãos capacitados, que sejam agentes 
                  de transformação em suas igrejas e comunidades, levando a mensagem do 
                  evangelho de forma relevante e contextualizada.
                </p>
                <p className="text-gray-700">
                  Com um corpo docente qualificado e comprometido, oferecemos uma formação 
                  teológica sólida, baseada na Bíblia e em metodologias pedagógicas atuais, 
                  preparando nossos alunos para os desafios do ministério contemporâneo.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-12">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Nossos Cursos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-primary mb-2">Teologia Básica</h3>
                  <p className="text-gray-700 mb-4">
                    Fundamentos da fé cristã, panorama bíblico e introdução à teologia.
                  </p>
                  <p className="text-secondary font-medium">Duração: 1 ano</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-primary mb-2">Liderança Cristã</h3>
                  <p className="text-gray-700 mb-4">
                    Princípios de liderança, gestão ministerial e desenvolvimento de equipes.
                  </p>
                  <p className="text-secondary font-medium">Duração: 6 meses</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-primary mb-2">Aconselhamento</h3>
                  <p className="text-gray-700 mb-4">
                    Técnicas de aconselhamento pastoral e apoio espiritual.
                  </p>
                  <p className="text-secondary font-medium">Duração: 8 meses</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Inscreva-se
              </h2>
              <p className="text-gray-700 max-w-3xl mx-auto mb-6">
                As inscrições para os cursos do S.E.T.E.R.E.C estão abertas! Entre em 
                contato conosco para mais informações sobre os cursos, valores e processo 
                de admissão.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://wa.me/+5511987654321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Fale Conosco
                </a>
                <Link to="/" className="btn-primary">
                  Voltar para Página Inicial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <FloatingButtons />
      <ChatBox />
    </div>
  );
};

export default SeterecPage;
