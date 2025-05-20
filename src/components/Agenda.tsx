
import React from "react";
import { Clock, Calendar } from "lucide-react";

const eventos = [
  {
    id: 1,
    title: "Oração",
    day: "Domingo",
    time: "08:00",
    location: "Presencial",
    description: "Momento dedicado à oração"
  },
  {
    id: 2,
    title: "Escola Bíblica",
    day: "Domingo",
    time: "09:00",
    location: "Presencial",
    description: "Estudo e aprendizado da Palavra de Deus"
  },
  {
    id: 3,
    title: "Ministração da Palavra",
    day: "Domingo",
    time: "11:00",
    location: "Presencial",
    description: "Culto principal de pregação"
  },
  {
    id: 4,
    title: "Oração e Palavra",
    day: "Quarta-feira",
    time: "20:00",
    location: "Presencial",
    description: "Culto de meio de semana"
  },
  {
    id: 5,
    title: "Oração e Palavra",
    day: "Sexta-feira",
    time: "20:00",
    location: "Online",
    description: "Culto online de encerramento da semana"
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
                    <p className="text-gray-600">{evento.description}</p>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0">
                    <div className="bg-primary/10 text-primary rounded-md px-3 py-1 text-sm font-medium mr-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {evento.day}
                    </div>
                    <div className="bg-secondary/10 text-secondary rounded-md px-3 py-1 text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {evento.time}h
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${evento.location === "Online" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {evento.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-600 italic">
            Venha participar de nossas atividades! Todos são bem-vindos.
          </p>
          <p className="text-center mt-4 text-primary font-medium">
            Rua: Oswaldo Aranha, 790 - Jd. Maravilha - Vic. Carvalho - Guarujá
          </p>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
