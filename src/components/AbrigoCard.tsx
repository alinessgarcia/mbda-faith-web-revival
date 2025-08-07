import React from 'react';
import { BookOpen } from 'lucide-react';
import { Abrigo } from '../data/abrigos';

interface AbrigoCardProps {
  abrigo: Abrigo;
  onClick: () => void;
}

const AbrigoCard: React.FC<AbrigoCardProps> = ({ abrigo, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="glass-card-modern p-6 cursor-pointer group animate-fade-in hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${abrigo.id * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-light/20 rounded-full p-3 group-hover:bg-blue-light/30 transition-colors">
          <BookOpen className="w-6 h-6 text-blue-light" />
        </div>
        <span className="text-sm font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full">
          #{abrigo.id}
        </span>
      </div>

      {/* Título */}
      <h3 className="text-xl font-bold text-yellow-title mb-3 group-hover:text-white transition-colors">
        {abrigo.titulo}
      </h3>

      {/* Versículo */}
      <div className="mb-4">
        <p className="text-blue-light font-semibold text-sm mb-2">
          📖 {abrigo.versiculo}
        </p>
      </div>

      {/* Chamada */}
      <p className="text-white/80 leading-relaxed mb-4 line-clamp-3">
        {abrigo.chamada}
      </p>

      {/* Call to action */}
      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <span className="text-white/60 text-sm">
          Clique para ler mais
        </span>
        <div className="w-2 h-2 bg-blue-light rounded-full group-hover:scale-150 transition-transform" />
      </div>
    </div>
  );
};

export default AbrigoCard;