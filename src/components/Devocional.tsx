
import React, { useState } from "react";

const devocionais = [
  {
    id: 1,
    title: "O Poder da Oração",
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verse: "Filipenses 4:6-7",
    content: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará o coração e a mente de vocês em Cristo Jesus."
  },
  {
    id: 2,
    title: "Confie em Deus",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verse: "Provérbios 3:5-6",
    content: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas."
  },
  {
    id: 3,
    title: "Amor ao Próximo",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verse: "1 João 4:7",
    content: "Amados, amemo-nos uns aos outros, pois o amor procede de Deus. Aquele que ama é nascido de Deus e conhece a Deus."
  },
  {
    id: 4,
    title: "Fortaleza em Cristo",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verse: "Filipenses 4:13",
    content: "Posso todas as coisas naquele que me fortalece."
  },
  {
    id: 5,
    title: "A Luz do Mundo",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    verse: "Mateus 5:14-16",
    content: "Vocês são a luz do mundo. Não se pode esconder uma cidade construída sobre um monte. E, também, ninguém acende uma candeia e a coloca debaixo de uma vasilha. Pelo contrário, coloca-a no lugar apropriado, e assim ilumina a todos os que estão na casa. Assim brilhe a luz de vocês diante dos homens, para que vejam as suas boas obras e glorifiquem ao Pai de vocês, que está nos céus."
  }
];

const Devocional = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDevocional, setCurrentDevocional] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextDevocional = () => {
    setCurrentDevocional((prev) => (prev === devocionais.length - 1 ? 0 : prev + 1));
  };

  const prevDevocional = () => {
    setCurrentDevocional((prev) => (prev === 0 ? devocionais.length - 1 : prev - 1));
  };

  return (
    <section id="devocional" className="section-padding bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="section-title">Devocional</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          Reflexões e devocionais para fortalecer sua caminhada com Deus.
          Medite nestas palavras diariamente e cresça em sua fé.
        </p>
        <button onClick={openModal} className="btn-primary">
          Ver Devocionais
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={closeModal}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden z-10">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-primary">
                  {devocionais[currentDevocional].title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto">
                  <img
                    src={devocionais[currentDevocional].image}
                    alt={devocionais[currentDevocional].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <span className="text-secondary font-semibold mb-2">
                    {devocionais[currentDevocional].verse}
                  </span>
                  <p className="text-gray-700 mb-6 flex-grow">
                    {devocionais[currentDevocional].content}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {currentDevocional + 1} de {devocionais.length}
                    </span>
                    <div className="flex space-x-4">
                      <button
                        onClick={prevDevocional}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextDevocional}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <svg
                          className="w-5 h-5"
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Devocional;
