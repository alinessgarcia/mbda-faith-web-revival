import React from 'react';
import { X } from 'lucide-react';
import { Abrigo } from '../data/abrigos';

interface AbrigoModalProps {
  abrigo: Abrigo | null;
  isOpen: boolean;
  onClose: () => void;
}

const AbrigoModal: React.FC<AbrigoModalProps> = ({ abrigo, isOpen, onClose }) => {
  if (!isOpen || !abrigo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-modal relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-in">
        {/* Header */}
        <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 p-6 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              Abrigo #{abrigo.id} – {abrigo.titulo}
            </h2>
            <p className="text-blue-light font-semibold">
              📖 {abrigo.versiculo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Chamada */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border-l-4 border-blue-light">
            <p className="text-white font-medium text-lg italic">
              "{abrigo.chamada}"
            </p>
          </div>

          {/* Texto principal */}
          <div>
            <h3 className="text-xl font-semibold text-yellow-custom mb-3 flex items-center">
              📝 Reflexão
            </h3>
            <p className="text-white/90 leading-relaxed text-base">
              {abrigo.texto}
            </p>
          </div>

          {/* Aplicação prática */}
          <div>
            <h3 className="text-xl font-semibold text-lime mb-3 flex items-center">
              🎯 Aplicação Prática
            </h3>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/90 leading-relaxed">
                {abrigo.aplicacao}
              </p>
            </div>
          </div>

          {/* Perguntas de reflexão */}
          <div>
            <h3 className="text-xl font-semibold text-orange-400 mb-3 flex items-center">
              🤔 Perguntas de Reflexão
            </h3>
            <div className="space-y-3">
              {abrigo.reflexoes.map((pergunta, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border-l-2 border-orange-400/50">
                  <p className="text-white/90">
                    <span className="font-medium text-orange-400">
                      {index + 1}.
                    </span>{' '}
                    {pergunta}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className="text-white/70 text-sm">
              📚 Baseado no livro "Abrigo no temporal" por Paul David Tripp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbrigoModal;