
import { ExternalLink, Globe, BookOpen } from "lucide-react";

const sites = [
  {
    id: 1,
    name: "Livros - CPAD",
    description: "Conteúdos e livros cristãos para crescimento espiritual",
    url: "https://www.cpad.com.br/Livros",
    icon: BookOpen
  },
  {
    id: 2,
    name: "Bíblia Online",
    description: "Leitura e estudo da Bíblia em várias traduções",
    url: "https://www.bibliaonline.com.br",
    icon: BookOpen
  },
  {
    id: 3,
    name: "Capacitando Líderes e Igrejas",
    description: "Materiais para líderes e professores da escola dominical",
    url: "https://www.youtube.com/watch?v=tcAkbXRVgH0",
    icon: Globe
  }
];

const SitesSugestivos = () => {
  return (
    <section id="sites-sugestivos" className="section-padding relative overflow-hidden bg-black/60">
      {/* Background decorativo glassmorphism */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse shape-blob" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400 rounded-full blur-3xl animate-pulse shape-blob animate-delay-300" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-400 rounded-full blur-3xl animate-pulse shape-blob animate-delay-500" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Título */}
      <div className="text-center mb-16">
       <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg mb-6">
         🌐 Sites Sugestivos
            </h2>
               <p className="text-xl text-white max-w-3xl mx-auto">
            Confira alguns sites que recomendamos para crescimento espiritual e informação
          </p>
           </div>

        
        {/* Cards glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {sites.map((site, index) => {
            const IconComponent = site.icon;
            return (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-modern p-8 group animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <IconComponent className="w-8 h-8 text-lime mr-3" />
                  <h3 className="text-xl font-bold text-yellow-title">{site.name}</h3>
                </div>
                
                <p className="text-white mb-6 leading-relaxed">{site.description}</p>
                
                <div className="flex items-center justify-end text-white font-medium group-hover:text-blue-light transition-colors">
                  <span className="mr-2">Visitar Site</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SitesSugestivos;
