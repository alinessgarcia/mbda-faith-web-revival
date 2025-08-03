
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { CHURCH_SCHEDULE, CONTACT_INFO } from "../constants";

const Agenda = () => {
  return (
    <section id="agenda" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-light-blue">
      {/* Background decorativo menor */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-400 rounded-full blur-3xl animate-pulse shape-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse shape-blob animate-delay-300" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16">
          
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg">
              📅 Agenda Semanal
            </h2>
          
        </div>

        {/* Grid de cards da agenda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {CHURCH_SCHEDULE.map((schedule, index) => (
            <div
              key={schedule.day}
              className="glass-card-agenda p-6 animate-fade-in"
              style={{
                backgroundImage: `linear-gradient(135deg, ${schedule.color}20 0%, ${schedule.color}10 100%)`
              }}
              
            >
              {/* Cabeçalho do dia */}
              <div className="flex items-center mb-4">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: schedule.color }}
                />
                <h3 className="text-2xl font-bold text-gray-800">
                  {schedule.day}
                </h3>
              </div>

              {/* Atividades */}
              <div className="space-y-3 mb-4">
                {schedule.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-center justify-between bg-white/30 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{activity.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{activity.activity}</p>
                        <p className="text-sm text-gray-600">{activity.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-lime text-white px-3 py-1 rounded-full text-sm font-bold">
                      <Clock className="w-4 h-4 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>

              {/* Informação especial */}
              {schedule.special && (
                <div className="bg-white/40 rounded-lg p-3 border-l-4" style={{ borderColor: schedule.color }}>
                  <p className="text-sm font-medium text-gray-700">
                    ✨ {schedule.special}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Agenda;
