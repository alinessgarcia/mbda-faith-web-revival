import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface NewsFilterState {
  searchTerm: string;
  selectedTags: string[];
  selectedCategories: string[];
  minRelevanceScore: number;
}

interface NewsFiltersProps {
  availableTags: string[];
  availableCategories: string[];
  filters: NewsFilterState;
  onFiltersChange: (filters: NewsFilterState) => void;
  totalNews: number;
  filteredNews: number;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  availableTags,
  availableCategories,
  filters,
  onFiltersChange,
  totalNews,
  filteredNews,
}) => {
  // Expandido por padrão para exibir os chips como antes
  const [isExpanded, setIsExpanded] = useState(true);

  // Palavras-chave rápidas ("botões de pesquisa" que você mencionou: sítio, síria, babilônia, grécia...)
  const quickKeywords: string[] = [
    'sítio', 'síria', 'babilônia', 'grécia', 'israel', 'egito', 'jerusalém', 'galileia',
    'pérsia', 'crescente fértil', 'roma', 'assírio', 'helênico',
    'arqueologia', 'escavação', 'descoberta', 'artefato', 'ruínas', 'criacionismo'
  ];
  const [selectedQuick, setSelectedQuick] = useState<string[]>([]);

  const updateFilter = (key: keyof NewsFilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    updateFilter('selectedTags', newTags);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    updateFilter('selectedCategories', newCategories);
  };

  const toggleQuickKeyword = (kw: string) => {
    let next: string[];
    if (selectedQuick.includes(kw)) {
      next = selectedQuick.filter(k => k !== kw);
    } else {
      next = [...selectedQuick, kw];
    }
    setSelectedQuick(next);
    // Atualiza o campo de busca com todas as palavras selecionadas, permitindo múltiplas
    updateFilter('searchTerm', next.join(' '));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedTags: [],
      selectedCategories: [],
      minRelevanceScore: 0,
    });
    setSelectedQuick([]);
  };

  const hasActiveFilters = filters.searchTerm || filters.selectedTags.length > 0 || 
    filters.selectedCategories.length > 0 || filters.minRelevanceScore > 0 || selectedQuick.length > 0;

  return (
    <div className="w-full bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
      {/* Header compacto sempre visível */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filtrar Notícias</span>
          </button>
          
          <div className="flex-1 text-right text-sm text-gray-300">
            {filteredNews !== totalNews && (
              <span className="text-yellow-400 font-medium">{filteredNews} de {totalNews}</span>
            )}
            {filteredNews === totalNews && (
              <span>{totalNews} notícias</span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>

        {/* Busca sempre visível */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            placeholder="Buscar por palavras-chave (arqueologia, Israel, etc)..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
          />
        </div>

        {/* Pesquisa rápida: sempre visível como os botões antigos */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {quickKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => toggleQuickKeyword(kw)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedQuick.includes(kw)
                    ? 'bg-yellow-500 text-black shadow-lg scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
                title={`Pesquisar por: ${kw}`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros expandíveis */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
          {/* Tags de Temas */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Temas</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.selectedTags.includes(tag)
                        ? 'bg-yellow-500 text-black shadow-lg scale-105'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categorias */}
          {availableCategories.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Categorias</h4>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.selectedCategories.includes(category)
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Slider de Relevância */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-300">Relevância Mínima</h4>
              <span className="text-yellow-400 text-sm font-medium">
                {filters.minRelevanceScore > 0 ? `${filters.minRelevanceScore}+` : 'Todas'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={filters.minRelevanceScore}
              onChange={(e) => updateFilter('minRelevanceScore', parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Todas</span>
              <span>Alta relevância</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #EAB308;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(234, 179, 8, 0.5);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #EAB308;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(234, 179, 8, 0.5);
        }
      `}</style>
    </div>
  );
};

export default NewsFilters;
