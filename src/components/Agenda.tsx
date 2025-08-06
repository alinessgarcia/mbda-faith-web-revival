
import { Clock } from "lucide-react";
import { CHURCH_SCHEDULE } from "../constants";

const Agenda = () => {
  return (
    <section id="agenda" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black/60">
      {/* Background decorativo menor */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-400 rounded-full blur-3xl animate-pulse shape-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse shape-blob animate-delay-300" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título com glassmorphism */}
        <div className="text-center mb-16 pt-8 md:pt-0">

          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-yellow-title drop-shadow-lg">
            📅 Agenda Semanal
          </h2>

        </div>

        {/* Layout customizado: Esquerda (3 cards) + Direita (1 card grande) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {/* COLUNA ESQUERDA - 3 cards pequenos */}
          <div className="space-y-6">
            {CHURCH_SCHEDULE.filter(schedule => schedule.position === 'left').map((schedule, index) => (
              <div
                key={schedule.day}
                className="glass-card-agenda p-6 animate-fade-in agenda-card"
                style={{
                  '--schedule-color': schedule.color,
                  '--schedule-color-light': `${schedule.color}20`,
                  '--schedule-color-lighter': `${schedule.color}10`,
                  animationDelay: `${index * 0.1}s`
                } as React.CSSProperties}
              >
                {/* Cabeçalho do dia */}
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3 agenda-day-indicator" />
                  <h3 className="text-xl font-bold text-yellow-title">
                    {schedule.day}
                  </h3>
                </div>

                {/* Atividades */}
                <div className="space-y-3 mb-4">
                  {schedule.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-center justify-between bg-white/30 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{activity.icon}</span>
                        <div>
                          <p className="font-semibold text-white text-sm">{activity.activity}</p>
                          <p className="text-xs text-yellow-custom">{activity.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-lime text-white px-2 py-1 rounded-full text-xs font-bold">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Informação especial */}
                {schedule.special && (
                  <div className="bg-white/40 rounded-lg p-3 border-l-4 agenda-special-border">
                    <p className="text-xs font-medium text-white">
                      ✨ {schedule.special}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* COLUNA DIREITA - 1 card grande (Domingo) */}
          <div>
            {CHURCH_SCHEDULE.filter(schedule => schedule.position === 'right').map((schedule) => (
              <div
                key={schedule.day}
                className="glass-card-agenda p-8 animate-fade-in agenda-card h-full"
                style={{
                  '--schedule-color': schedule.color,
                  '--schedule-color-light': `${schedule.color}20`,
                  '--schedule-color-lighter': `${schedule.color}10`,
                  animationDelay: '0.3s'
                } as React.CSSProperties}
              >
                {/* Cabeçalho do dia */}
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 rounded-full mr-4 agenda-day-indicator" />
                  <h3 className="text-3xl font-bold text-yellow-title">
                    {schedule.day}
                  </h3>
                </div>

                {/* Atividades */}
                <div className="space-y-4 mb-6">
                  {schedule.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-center justify-between bg-white/30 rounded-lg p-4">
                      <div className="flex items-center">
                        <span className="text-3xl mr-4">{activity.icon}</span>
                        <div>
                          <p className="font-semibold text-white text-lg">{activity.activity}</p>
                          <p className="text-sm text-yellow-custom">{activity.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-lime text-white px-4 py-2 rounded-full text-sm font-bold">
                        <Clock className="w-4 h-4 mr-2" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Informações especiais */}
                <div className="space-y-3">
                  {schedule.special && (
                    <div className="bg-white/40 rounded-lg p-4 border-l-4 agenda-special-border">
                      <p className="text-sm font-medium text-white">
                        ✨ {schedule.special}
                      </p>
                    </div>
                  )}
                  {schedule.specialExtra && (
                    <div className="bg-white/40 rounded-lg p-4 border-l-4 agenda-special-border">
                      <p className="text-sm font-medium text-white">
                        ✨ {schedule.specialExtra}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default Agenda;
