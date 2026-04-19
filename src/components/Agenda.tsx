import { Clock } from "lucide-react";
import { CHURCH_SCHEDULE } from "../constants";

const Agenda = () => {
  const leftSchedules = CHURCH_SCHEDULE.filter((schedule) => schedule.position === "left");
  const rightSchedules = CHURCH_SCHEDULE.filter((schedule) => schedule.position === "right");

  return (
    <section id="agenda" className="section-padding relative overflow-hidden bg-[#0a3779]/95">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0f4ea8]/30 via-transparent to-[#0a2f63]/55" />

      <div className="container mx-auto relative z-10">
        <div className="mb-10 md:mb-12">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
            Programação
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Agenda Semanal</h2>
          <p className="mt-2 text-white/75 max-w-2xl">
            Horários oficiais de reuniões, oração e ministração da Palavra.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2 space-y-5">
            {leftSchedules.map((schedule) => (
              <article
                key={schedule.day}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_12px_28px_rgba(2,22,64,0.28)] p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{schedule.day}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70">
                    Reunião
                  </span>
                </div>

                <div className="space-y-3">
                  {schedule.activities.map((activity, index) => (
                    <div
                      key={`${schedule.day}-${activity.time}-${index}`}
                      className="rounded-xl border border-white/15 bg-white/10 px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white font-semibold leading-tight">{activity.activity}</p>
                          <p className="text-white/70 text-sm mt-1">{activity.type}</p>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-lg bg-[#1d64d8] px-2.5 py-1 text-sm font-bold text-white whitespace-nowrap">
                          <Clock className="h-4 w-4" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {schedule.special && (
                  <p className="mt-4 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90">
                    {schedule.special}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="xl:col-span-3 space-y-5">
            {rightSchedules.map((schedule) => (
              <article
                key={schedule.day}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_14px_32px_rgba(2,22,64,0.32)] p-6 md:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{schedule.day}</h3>
                  <span className="text-sm font-semibold text-white/75">
                    Dia principal de comunhão
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schedule.activities.map((activity, index) => (
                    <div
                      key={`${schedule.day}-${activity.time}-${index}`}
                      className="rounded-xl border border-white/15 bg-white/10 p-4"
                    >
                      <p className="text-white font-semibold">{activity.activity}</p>
                      <p className="text-white/70 text-sm mt-1">{activity.type}</p>
                      <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#1d64d8] px-2.5 py-1 text-sm font-bold text-white">
                        <Clock className="h-4 w-4" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  {schedule.special && (
                    <p className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90">
                      {schedule.special}
                    </p>
                  )}
                  {schedule.specialExtra && (
                    <p className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90">
                      {schedule.specialExtra}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
