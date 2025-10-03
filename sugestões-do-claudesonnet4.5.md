# 📰 PROMPT PARA TRAE IDE - Design de Jornal

Preciso melhorar o Hero slider de notícias com DESIGN DE JORNAL CLÁSSICO.

## DESIGN OBJETIVO (Aparência de Jornal):

### Layout Principal:
- Fundo: Papel jornal envelhecido (bege/sépia claro)
- Tipografia: Fontes serifadas estilo jornal (Playfair Display, Merriweather, Georgia)
- Grid: Layout de colunas como jornal impresso
- Elementos: Linhas divisórias finas, data em destaque, fonte itálica para descrições

### Hero Slider Estilo Jornal:
```
┌─────────────────────────────────────────────────────────┐
│  MINISTÉRIO BÍBLICO DA RECONCILIAÇÃO                    │
│  ═══════════════════════════════════════════════════    │
│  📅 Sexta-feira, 03 de Outubro de 2025  |  Edição Diária│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌───────────────┐  NOTÍCIAS CRISTÃS                    │
│  │               │                                       │
│  │  [Imagem      │  Cristãos Perseguidos na Nigéria     │
│  │   Notícia]    │  Recebem Apoio Internacional         │
│  │               │  ─────────────────────────────────   │
│  │               │  Por Portas Abertas                   │
│  └───────────────┘                                       │
│                    Duas pessoas morreram e três ficaram  │
│                    gravemente feridas após um homem      │
│                    atropelar pedestres em frente a uma   │
│                    sinagoga no bairro de Crumpsall...    │
│                                                          │
│                    [Continuar lendo →]                   │
│                                                          │
│  ◄ Anterior    ● ○ ○ ○ ○    Próxima ►                  │
└─────────────────────────────────────────────────────────┘
```

### Elementos Visuais de Jornal:

1. **Cabeçalho Estilo Jornal:**
```typescript
<header className="border-b-4 border-double border-gray-800 pb-4 mb-6">
  <h1 className="font-serif text-4xl font-bold text-center tracking-wide">
    MINISTÉRIO BÍBLICO DA RECONCILIAÇÃO
  </h1>
  <div className="flex justify-between items-center mt-2 text-sm">
    <span className="font-serif italic">Edição Diária</span>
    <span className="font-serif">{new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</span>
    <span className="font-serif italic">Ano I</span>
  </div>
</header>
```

2. **Card de Notícia Estilo Jornal:**
```typescript
<article className="bg-[#f9f6f0] border-2 border-gray-300 shadow-lg p-8">
  {/* Badge Categoria */}
  <div className="border-b border-gray-400 pb-2 mb-4">
    <span className="font-serif text-xs uppercase tracking-widest font-bold">
      📰 NOTÍCIAS CRISTÃS
    </span>
  </div>
  
  {/* Layout Grid: Imagem + Texto */}
  <div className="grid md:grid-cols-[300px_1fr] gap-6">
    {/* Imagem */}
    <div className="border-4 border-gray-800 p-1 bg-white">
      <img 
        src={article.imageUrl} 
        alt={article.title}
        className="w-full h-[200px] object-cover grayscale"
      />
      <p className="text-xs italic text-center mt-1 font-serif">
        Foto: {article.source}
      </p>
    </div>
    
    {/* Conteúdo */}
    <div>
      {/* Título */}
      <h2 className="font-serif text-3xl font-bold leading-tight mb-2 text-gray-900">
        {article.title}
      </h2>
      
      {/* Linha decorativa */}
      <div className="border-t-2 border-gray-400 w-24 mb-3"></div>
      
      {/* Byline */}
      <p className="text-sm font-serif italic text-gray-600 mb-3">
        Por {article.source} • {formatDate(article.publishedAt)}
      </p>
      
      {/* Lead (descrição) */}
      <p className="font-serif text-lg leading-relaxed text-gray-800 mb-4">
        {article.description}
      </p>
      
      {/* Call to Action */}
      <a 
        href={article.link}
        target="_blank"
        className="inline-block font-serif text-sm uppercase tracking-wide 
                   border-2 border-gray-800 px-4 py-2 hover:bg-gray-800 
                   hover:text-white transition-colors"
      >
        Continuar lendo →
      </a>
    </div>
  </div>
</article>
```

3. **Navegação Estilo Jornal:**
```typescript
<nav className="flex justify-between items-center mt-6 pt-4 border-t border-gray-400">
  <button className="font-serif text-sm uppercase tracking-wide hover:underline">
    ◄ Edição Anterior
  </button>
  
  <div className="flex gap-2">
    {articles.map((_, idx) => (
      <button
        key={idx}
        className={`w-2 h-2 rounded-full border border-gray-800 
                   ${idx === current ? 'bg-gray-800' : 'bg-white'}`}
      />
    ))}
  </div>
  
  <button className="font-serif text-sm uppercase tracking-wide hover:underline">
    Próxima Edição ►
  </button>
</nav>
```

## PALETA DE CORES (Jornal Vintage):

```css
:root {
  --newspaper-bg: #f9f6f0;        /* Papel envelhecido */
  --newspaper-text: #1a1a1a;      /* Tinta preta */
  --newspaper-border: #8b7355;    /* Marrom sépia */
  --newspaper-accent: #d4a574;    /* Dourado vintage */
  --newspaper-muted: #6b6b6b;     /* Cinza texto secundário */
}
```

## TIPOGRAFIA:

```typescript
// Adicionar ao Tailwind config ou usar fontes do Google
import { Playfair_Display, Merriweather } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
});

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--font-merriweather'
});

// Usar:
<h1 className="font-[family-name:var(--font-playfair)]">Título</h1>
<p className="font-[family-name:var(--font-merriweather)]">Texto</p>
```

## EFEITOS ESPECIAIS:

### Textura de Papel:
```css
.newspaper-texture {
  background-image: 
    repeating-linear-gradient(
      0deg,
      rgba(0,0,0,.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(0,0,0,.03) 3px
    );
  background-color: #f9f6f0;
}
```

### Imagens em Sépia/PB:
```css
.newspaper-image {
  filter: grayscale(100%) contrast(1.1) sepia(10%);
  border: 4px solid #1a1a1a;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
```

### Texto com sombra suave (efeito impressão):
```css
.newspaper-text {
  text-shadow: 0.5px 0.5px 0.5px rgba(0,0,0,0.1);
  letter-spacing: 0.02em;
}
```

## COMPONENTE COMPLETO:

```typescript
// src/components/Hero/NewspaperHeroSlider.tsx

export default function NewspaperHeroSlider() {
  const { articles, loading } = useNews(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % articles.length);
    }, 8000); // 8 segundos para dar tempo de ler
    
    return () => clearInterval(interval);
  }, [articles.length]);
  
  if (loading) return <LoadingNewspaper />;
  if (!articles.length) return <EmptyNewspaper />;
  
  const current = articles[currentIndex];
  const today = new Date();
  
  return (
    <section className="newspaper-texture min-h-[600px] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Masthead (Cabeçalho do Jornal) */}
        <header className="border-b-4 border-double border-gray-800 pb-4 mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center 
                         tracking-wide text-gray-900 uppercase">
            Ministério Bíblico da Reconciliação
          </h1>
          <div className="flex flex-wrap justify-between items-center mt-3 
                          text-sm text-gray-700 font-serif">
            <span className="italic">Edição Diária</span>
            <span className="font-semibold">
              {today.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="italic">Ano I • Nº {Math.floor(Math.random() * 365)}</span>
          </div>
        </header>
        
        {/* Notícia Principal */}
        <article className="bg-white border-2 border-gray-800 shadow-2xl p-6 md:p-10 
                           newspaper-texture">
          {/* Categoria */}
          <div className="border-b-2 border-gray-400 pb-2 mb-6">
            <span className="font-serif text-xs uppercase tracking-[0.2em] 
                           font-bold text-gray-800">
              📰 {getCategoryLabel(current.category)}
            </span>
          </div>
          
          {/* Grid Principal */}
          <div className="grid md:grid-cols-[350px_1fr] gap-8">
            {/* Imagem */}
            <figure className="newspaper-image-container">
              <img 
                src={current.imageUrl || '/images/newspaper-placeholder.jpg'}
                alt={current.title}
                className="newspaper-image w-full h-[250px] object-cover"
              />
              <figcaption className="text-xs italic text-center mt-2 
                                     font-serif text-gray-600">
                Foto: {current.source}
              </figcaption>
            </figure>
            
            {/* Conteúdo */}
            <div>
              {/* Headline (Título Principal) */}
              <h2 className="font-serif text-3xl md:text-4xl font-bold 
                           leading-tight mb-3 text-gray-900 newspaper-text">
                {current.title}
              </h2>
              
              {/* Decorative Line */}
              <div className="border-t-4 border-gray-800 w-32 mb-4"></div>
              
              {/* Byline */}
              <p className="text-sm font-serif italic text-gray-600 mb-4">
                <span className="font-semibold">Por</span> {current.source} • {' '}
                {formatTimeAgo(current.publishedAt)}
              </p>
              
              {/* Lead Paragraph */}
              <p className="font-serif text-lg md:text-xl leading-relaxed 
                          text-gray-800 mb-6 newspaper-text first-letter:text-5xl 
                          first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                {current.description}
              </p>
              
              {/* Continuar lendo */}
              <a 
                href={current.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-serif text-sm uppercase tracking-widest 
                         border-2 border-gray-800 px-6 py-3 hover:bg-gray-800 
                         hover:text-white transition-all duration-300 font-semibold"
              >
                Continuar lendo →
              </a>
            </div>
          </div>
        </article>
        
        {/* Navegação */}
        <nav className="flex flex-wrap justify-between items-center mt-8 pt-6 
                       border-t-2 border-gray-400">
          <button 
            onClick={goToPrevious}
            className="font-serif text-sm uppercase tracking-wide hover:underline 
                     text-gray-700 transition-colors"
          >
            ◄ Edição Anterior
          </button>
          
          {/* Indicadores */}
          <div className="flex gap-3 my-4">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 border-2 border-gray-800 transition-all
                          ${idx === currentIndex 
                            ? 'bg-gray-800 scale-125' 
                            : 'bg-white hover:bg-gray-300'
                          }`}
                aria-label={`Ir para notícia ${idx + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={goToNext}
            className="font-serif text-sm uppercase tracking-wide hover:underline 
                     text-gray-700 transition-colors"
          >
            Próxima Edição ►
          </button>
        </nav>
        
        {/* Rodapé decorativo */}
        <footer className="mt-8 pt-4 border-t border-gray-400 text-center">
          <p className="font-serif text-xs italic text-gray-600">
            "Examinai as Escrituras, porque julgais ter nelas a vida eterna" - João 5:39
          </p>
        </footer>
      </div>
    </section>
  );
}

// Helper functions
function getCategoryLabel(category: string): string {
  const labels = {
    noticia: 'Notícias Cristãs',
    teologia: 'Teologia Reformada',
    ensino: 'Estudos Bíblicos',
    arqueologia: 'Arqueologia Bíblica'
  };
  return labels[category] || 'Notícias';
}

function formatTimeAgo(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return 'Publicado agora';
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ontem';
  return `Há ${days} dias`;
}
```

## FONTES RSS (mesmas de antes):
- Portas Abertas
- https://noticiasdeisrael.com.br/
- Gospelprime
- Púlpito Cristão
- Voltemos ao Evangelho
- Ministério Fiel
- Biblical Archaeology Society
- https://teologiabrasileira.com.br/noticias/

## EXTRAS OPCIONAIS:

### Seção "Outras Notícias" (sidebar estilo jornal):
```typescript
<aside className="mt-8 border-t-2 border-gray-800 pt-6">
  <h3 className="font-serif text-xl font-bold mb-4 uppercase tracking-wide">
    Outras Notícias
  </h3>
  <div className="grid md:grid-cols-3 gap-6">
    {articles.slice(1, 4).map(article => (
      <article key={article.id} className="border-l-4 border-gray-800 pl-4">
        <h4 className="font-serif font-bold text-sm mb-2">{article.title}</h4>
        <p className="font-serif text-xs text-gray-600 italic">
          {article.source}
        </p>
      </article>
    ))}
  </div>
</aside>
```

## IMPORTANTE:
- Auto-play: 8 segundos (mais tempo para ler)
- Imagens em sépia/PB para efeito vintage
- Tipografia serifada obrigatória
- Primeiro caractere grande (drop cap)
- Layout em colunas como jornal real
- Bordas e linhas decorativas
- Branch: "noticias-slide-update"

Implemente com foco em legibilidade e autenticidade de jornal clássico.
```

---

## 🎨 VISUALIZAÇÃO DO RESULTADO:

O Hero ficará assim:

- **Cabeçalho:** Nome da igreja em destaque + data atual
- **Notícia:** Grid com imagem (PB/sépia) + texto em colunas
- **Tipografia:** Fontes serifadas elegantes
- **Cores:** Tons de papel envelhecido
- **Detalhes:** Linhas decorativas, bordas duplas, drop caps
- **Navegação:** Botões "Edição Anterior/Próxima"

**Cole no Lovable e tenha um jornal digital reformado!** 📰✨

