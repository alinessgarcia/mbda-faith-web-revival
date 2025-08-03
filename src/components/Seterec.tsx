
import { useState } from "react";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { Modal } from "./ui/Modal";

const Seterec = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="seterec" className="section-padding bg-white">
        <div className="container mx-auto">
          {/* Título */}
          <div className="text-center mb-16">
            <div className="glass-card-modern inline-block px-8 py-4 mb-6">
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-custom drop-shadow-lg">
                🎓 S.E.T.E.R.E.C
              </h2>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Seminário Teológico da Reconciliação
            </p>
          </div>

          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Texto */}
            <div className="space-y-6">
              <div className="glass-card-modern p-8">
                <div className="flex items-center mb-4">
                  <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">Formação Teológica</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  O S.E.T.E.R.E.C é um programa de formação e capacitação para líderes cristãos. 
                  Baseado em princípios bíblicos sólidos, prepara discípulos para servir a igreja 
                  e a comunidade com excelência.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Oferecemos cursos em diversas áreas do ministério cristão, com professores 
                  experientes e qualificados.
                </p>
              </div>

              {/* Cards de cursos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card-agenda p-6 text-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-800 mb-2">Teologia</h4>
                  <p className="text-gray-600 text-sm">Fundamentos bíblicos</p>
                </div>
                <div className="glass-card-agenda p-6 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-800 mb-2">Liderança</h4>
                  <p className="text-gray-600 text-sm">Gestão ministerial</p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/5513981517913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-agenda px-6 py-3 text-center font-bold text-green-600 hover:text-green-700 transition-colors flex items-center justify-center"
                >
                  📱 WhatsApp
                </a>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="glass-card-modern px-6 py-3 font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  📖 Saiba Mais
                </button>
              </div>
            </div>

            {/* Imagem */}
            <div className="relative">
              <div className="glass-card-modern p-6">
                <img
                  src="/images/seterec-site.jpg"
                  alt="S.E.T.E.R.E.C - Seminário Teológico"
                  className="rounded-2xl w-full h-[400px] object-cover shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-6 rounded-2xl bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="S.E.T.E.R.E.C - Seminário Teológico"
        size="xl"
      >
        <div className="space-y-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-amber-400" />
                Sobre o Seminário
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                O Seminário Teológico de Reconciliação Cristã é um centro de formação 
                teológica e ministerial, comprometido com o preparo de líderes para 
                servir à igreja e à comunidade com excelência.
              </p>
              <p className="text-white/90 leading-relaxed">
                Nossa visão é formar líderes cristãos capacitados, que sejam agentes 
                de transformação em suas igrejas e comunidades.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-amber-400" />
                Nossos Cursos
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="font-bold">Teologia Básica</h4>
                  <p className="text-sm text-white/80">Fundamentos da fé cristã - 1 ano</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="font-bold">Liderança Cristã</h4>
                  <p className="text-sm text-white/80">Princípios de liderança - 6 meses</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <h4 className="font-bold">Aconselhamento</h4>
                  <p className="text-sm text-white/80">Técnicas pastorais - 8 meses</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-white/20">
            <p className="text-white/90 mb-4">
              As inscrições estão abertas! Entre em contato para mais informações.
            </p>
            <a
              href="https://wa.me/5513981517913"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition-colors"
            >
              📱 Fale Conosco no WhatsApp
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Seterec;
