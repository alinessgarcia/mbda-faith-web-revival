
import React, { useState } from "react";

const declaracoes = [
  {
    id: 1,
    title: "Deus",
    content: "Cremos em um único Deus, eternamente existente em três pessoas: Pai, Filho e Espírito Santo."
  },
  {
    id: 2,
    title: "Jesus Cristo",
    content: "Cremos em Jesus Cristo, verdadeiro Deus e verdadeiro homem, concebido pelo Espírito Santo, nascido da virgem Maria, morto na cruz pelos nossos pecados, ressuscitado ao terceiro dia."
  },
  {
    id: 3,
    title: "Espírito Santo",
    content: "Cremos no Espírito Santo, terceira pessoa da Trindade, que convence o mundo do pecado, da justiça e do juízo, e capacita o crente para a vida cristã."
  },
  {
    id: 4,
    title: "Bíblia Sagrada",
    content: "Cremos que a Bíblia é a Palavra de Deus, inspirada e infalível, única regra de fé e prática para a vida e o caráter cristão."
  },
  {
    id: 5,
    title: "Salvação",
    content: "Cremos que a salvação é pela graça, mediante a fé em nosso Senhor Jesus Cristo e não por obras humanas."
  },
  {
    id: 6,
    title: "Igreja",
    content: "Cremos que a Igreja é o corpo de Cristo, uma comunidade de fiéis batizados que se reúnem para adoração, comunhão, discipulado, ministério e evangelização."
  },
  {
    id: 7,
    title: "Batismo e Ceia",
    content: "Cremos nos dois sacramentos instituídos por Cristo: o Batismo e a Ceia do Senhor."
  },
  {
    id: 8,
    title: "Santificação",
    content: "Cremos na santificação do crente, mediante a obra do Espírito Santo, pela qual o crente é capacitado para viver uma vida de testemunho e serviço cristão."
  },
  {
    id: 9,
    title: "Dons Espirituais",
    content: "Cremos nos dons espirituais concedidos pelo Espírito Santo para a edificação da Igreja e testemunho ao mundo."
  },
  {
    id: 10,
    title: "Cura Divina",
    content: "Cremos na cura divina, concedida a nós na obra expiatória de Cristo."
  },
  {
    id: 11,
    title: "Segunda Vinda de Cristo",
    content: "Cremos na segunda vinda pessoal e visível de nosso Senhor Jesus Cristo."
  },
  {
    id: 12,
    title: "Ressurreição",
    content: "Cremos na ressurreição dos mortos, na vida eterna dos salvos e na condenação eterna dos perdidos."
  },
  {
    id: 13,
    title: "Evangelização",
    content: "Cremos no dever de evangelizar e fazer discípulos de todas as nações, conforme a grande comissão de Cristo."
  },
  {
    id: 14,
    title: "Família",
    content: "Cremos que a família é instituída por Deus e deve ser preservada segundo os princípios bíblicos."
  },
  {
    id: 15,
    title: "Reino de Deus",
    content: "Cremos no Reino de Deus, já presente, mas ainda não consumado, que será plenamente estabelecido quando Cristo retornar."
  }
];

const DeclaracaoDeFe = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeclaracao, setCurrentDeclaracao] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextDeclaracao = () => {
    setCurrentDeclaracao((prev) => (prev === declaracoes.length - 1 ? 0 : prev + 1));
  };

  const prevDeclaracao = () => {
    setCurrentDeclaracao((prev) => (prev === 0 ? declaracoes.length - 1 : prev - 1));
  };

  return (
    <section id="declaracao-de-fe" className="section-padding bg-white">
      <div className="container mx-auto text-center">
        <h2 className="section-title">Declaração de Fé</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          Nossa fé é fundamentada nas Escrituras Sagradas. Confira nossa declaração
          de fé para conhecer os princípios que norteiam nossa comunidade.
        </p>
        <button onClick={openModal} className="btn-primary">
          Ver Declaração de Fé
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={closeModal}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto z-10">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-primary">
                  {declaracoes[currentDeclaracao].title}
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
              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  {declaracoes[currentDeclaracao].content}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {currentDeclaracao + 1} de {declaracoes.length}
                  </span>
                  <div className="flex space-x-4">
                    <button
                      onClick={prevDeclaracao}
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
                      onClick={nextDeclaracao}
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
        )}
      </div>
    </section>
  );
};

export default DeclaracaoDeFe;
