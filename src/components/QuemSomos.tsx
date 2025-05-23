
import React from "react";

const QuemSomos = () => {
  return (
    <section 
      id="quem-somos" 
      className="section-padding relative flex items-center"
      style={{
        backgroundImage: "url('https://raw.githubusercontent.com/alinessgarcia/mbda-faith-web-revival/e006e4aadea1147cd8570f5caa629f98096459b7/public/images/imagem1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh"
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto relative z-10">
        <h2 className="section-title text-white">Quem Somos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="text-white mb-4">
              Somos o Ministério Bíblico da Reconciliação, uma comunidade cristã dedicada ao amor, à fé e à transformação espiritual. Nosso ministério é um espaço de encontro, reflexão e crescimento, onde todos são bem-vindos a desenvolver um relacionamento mais profundo com Deus.
            </p>
            <p className="text-white mb-4">
              Nossa missão é proclamar a mensagem de Cristo a todas as pessoas, promovendo a reconciliação com Deus e com o próximo. Buscamos ser uma igreja relevante, que vive e aplica os princípios bíblicos na realidade do mundo atual.
            </p>
            <p className="text-white">
              Valorizamos a autenticidade, a comunhão e o discipulado. Somos uma família espiritual que caminha unida, apoiando uns aos outros e servindo com amor à comunidade ao nosso redor.
            </p>
          </div>
          <div className="order-1 md:order-2 bg-white/10 p-4 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Comunidade MBdA Reconciliação"
              className="rounded-lg shadow-lg object-cover h-[400px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuemSomos;
