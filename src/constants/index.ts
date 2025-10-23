import { SEOConfig, SocialLink } from '../types';

// Configurações SEO centralizadas
export const SEO_CONFIG: SEOConfig = {
  title: "MBdaR - Ministério Bíblico da Reconciliação | Site Oficial",
  description: "Igreja cristã em Guarujá/SP dedicada ao ensino da Palavra de Deus, comunhão familiar e crescimento espiritual. Conheça o Ministério Bíblico da Reconciliação.",
  keywords: "igreja cristã, ministério bíblico, reconciliação, Guarujá, São Paulo, comunhão, família, palavra de Deus",
  ogTitle: "MBdaR - Ministério Bíblico da Reconciliação",
  ogDescription: "Igreja cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual."
};

// NAVIGATION_ITEMS removido - não estava sendo usado (navegação implementada diretamente nos componentes)
// CONTACT_INFO removido - não estava sendo usado (dados hardcoded no Footer)

// Links sociais
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Facebook",
    url: "https://www.facebook.com/reconciliacaoguaruja",
    icon: "facebook"
  },
  {
    platform: "Instagram",
    url: "https://instagram.com/mbdareconciliacao",
    icon: "instagram"
  },
  {
    platform: "YouTube",
    url: "https://youtube.com/@mbdareconciliacao",
    icon: "youtube"
  }
];

// Cores simplificadas - apenas as realmente usadas
const SCHEDULE_COLORS = {
  sunday: '#f97316',    // Laranja
  wednesday: '#eab308', // Amarelo
  friday: '#8b5cf6',    // Roxo

} as const;

// Agenda da igreja
export const CHURCH_SCHEDULE = [
  // COLUNA ESQUERDA (3 cards)

  {
    day: 'Quarta-feira',
    color: SCHEDULE_COLORS.wednesday,
    activities: [
      { time: '20h', activity: 'Oração e Palavra', type: 'Presencial', icon: '🙏' }
    ],
    position: 'left'
  },
  {
    day: 'Sexta-feira',
    color: SCHEDULE_COLORS.friday,
    activities: [
      { time: '20h', activity: 'Oração e Palavra', type: 'Online (quando anunciado)', icon: '💻' }
    ],
    position: 'left'
  },
  // COLUNA DIREITA (1 card grande)
  {
    day: 'Domingo',
    color: SCHEDULE_COLORS.sunday,
    activities: [
      { time: '08h', activity: 'Oração', type: 'Presencial', icon: '🙏' },
      { time: '09h', activity: 'Escola Bíblica', type: 'Presencial', icon: '📚' },
      { time: '11h', activity: 'Ministração da Palavra', type: 'Presencial', icon: '✝️' },
    ],
    special: '1º Domingo do mês: Ceia do Senhor 🕊️',
    specialExtra: 'Último Domingo do mês: Culto da Família 👨‍👩‍👧‍👦',
    position: 'right'
  }
];