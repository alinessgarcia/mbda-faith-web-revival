
import React from "react";

const sites = [
  {
    id: 1,
    name: "Livros - CPAD",
    description: "Conteúdos e livros cristãos para crescimento espiritual",
    url: "https://www.cpad.com.br/Livros"
  },
  {
    id: 2,
    name: "Bíblia Online",
    description: "Leitura e estudo da Bíblia em várias traduções",
    url: "https://www.bibliaonline.com.br"
  },
  {
    id: 3,
    name: "Capacitando Líderes e Igrejas",
    description: "Materiais para líderes e professores da escola dominical",
    url: "https://www.youtube.com/watch?v=tcAkbXRVgH0"
  }
];

const SitesSugestivos = () => {
  return (
    <section id="sites-sugestivos" className="section-padding bg-blue-200">
      <div className="container mx-auto">
        <h2 className="section-title">Sites Sugestivos</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-center">
          Confira alguns sites que recomendamos para crescimento espiritual e
          informação.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sites.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
            >
              <h3 className="text-lg font-bold text-primary mb-2">{site.name}</h3>
              <p className="text-gray-600 mb-4">{site.description}</p>
              <div className="flex justify-end">
                <span className="text-secondary inline-flex items-center text-sm font-medium">
                  Visitar Site
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SitesSugestivos;
