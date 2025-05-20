
import React from "react";

const eventos = [
  {
    id: 1,
    title: "Culto de Domingo",
    day: "Domingo",
    time: "18:00",
    location: "Templo Principal"
  },
  {
    id: 2,
    title: "Culto de Oração",
    day: "Terça-feira",
    time: "19:30",
    location: "Salão de Oração"
  },
  {
    id: 3,
    title: "Estudo Bíblico",
    day: "Quinta-feira",
    time: "19:30",
    location: "Templo Principal"
  },
  {
    id: 4,
    title: "Ensaio do Coral",
    day: "Sábado",
    time: "16:00",
    location: "Sala de Música"
  },
  {
    id: 5,
    title: "Encontro de Jovens",
    day: "Sábado",
    time: "19:00",
    location: "Espaço Jovem"
  }
];

const Agenda = () => {
  return (
    <section id="agenda" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title">Agenda da Igreja</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-center">
          Confira nossa programação semanal e junte-se a nós nos cultos e atividades.
        </p>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-gray-50 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-primary">{evento.title}</h3>
                    <p className="text-gray-600">{evento.location}</p>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0">
                    <div className="bg-primary/10 text-primary rounded-md px-3 py-1 text-sm font-medium mr-2">
                      {evento.day}
                    </div>
                    <div className="bg-secondary/10 text-secondary rounded-md px-3 py-1 text-sm font-medium">
                      {evento.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-600 italic">
            Venha participar de nossas atividades! Todos são bem-vindos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
