import { SEOConfig, NavigationItem, SocialLink, ContactInfo } from '../types';

// Configurações SEO centralizadas
export const SEO_CONFIG: SEOConfig = {
  title: "MBdaR - Ministério Bíblico da Reconciliação | Site Oficial",
  description: "Igreja cristã em Guarujá/SP dedicada ao ensino da Palavra de Deus, comunhão familiar e crescimento espiritual. Conheça o Ministério Bíblico da Reconciliação.",
  keywords: "igreja cristã, ministério bíblico, reconciliação, Guarujá, São Paulo, comunhão, família, palavra de Deus",
  ogTitle: "MBdaR - Ministério Bíblico da Reconciliação",
  ogDescription: "Igreja cristã voltada ao ensino profundo da Palavra de Deus, comunhão familiar e edificação espiritual."
};

// Navegação principal
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "inicio", label: "Início", href: "#" },
  { id: "quem-somos", label: "Quem Somos", href: "#quem-somos" },
  { id: "declaracao-de-fe", label: "Declaração de Fé", href: "#declaracao-de-fe" },
  { id: "devocional", label: "Devocional", href: "#devocional" },
  { id: "estudos-biblicos", label: "Estudos Bíblicos", href: "#estudos-biblicos" },
  { id: "seterec", label: "S.E.T.E.R.E.C", href: "#seterec" },
  { id: "agenda", label: "Agenda", href: "#agenda" },
  { id: "espaco-familia", label: "Espaço Família", href: "#espaco-familia" },
  { id: "midia", label: "Mídia", href: "#midia" },
  { id: "sites", label: "Sites", href: "#sites" },
  { id: "contato", label: "Contato", href: "#contato" }
];

// Informações de contato
export const CONTACT_INFO: ContactInfo = {
  address: "Av. Osvaldo Aranha, nº790 - Jardim Maravilha (Vicente de Carvalho) - Guarujá/SP - CEP: 11470-100",
  phone: "(13) 99999-9999",
  email: "contato@mbdareconciliacao.com.br",
  whatsapp: "5513999999999"
};

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

// Cores do tema
export const THEME_COLORS = {
  primary: {
    blue: '#0091eb',
    blueDark: '#006bb3',
    blueLight: '#33a3ef'
  },
  secondary: {
    amber: '#f59e0b',
    amberLight: '#fbbf24',
    yellow: '#eab308', // Para títulos como "Agenda Semanal"
    lime: '#84cc16'    // Verde limão para destaques
  },
  neutral: {
    white: '#ffffff',
    gray100: '#f3f4f6',
    gray800: '#1f2937',
    gray900: '#111827'
  },
  // Cores por dia da semana
  schedule: {
    sunday: '#f97316',    // Laranja
    wednesday: '#eab308', // Amarelo
    friday: '#8b5cf6',    // Roxo
    seterec: '#06b6d4'    // Ciano
  }
} as const;

// Agenda da igreja
export const CHURCH_SCHEDULE = [
  {
    day: 'Domingo',
    color: THEME_COLORS.schedule.sunday,
    activities: [
      { time: '08h', activity: 'Oração', type: 'Presencial', icon: '🙏' },
      { time: '09h', activity: 'Escola Bíblica', type: 'Presencial', icon: '📚' },
      { time: '11h', activity: 'Ministração da Palavra', type: 'Presencial', icon: '✝️' },
    ],
    special: '1º Domingo do mês: Ceia do Senhor 🕊️'
  },
  {
    day: 'Quarta-feira',
    color: THEME_COLORS.schedule.wednesday,
    activities: [
      { time: '20h', activity: 'Oração e Palavra', type: 'Presencial', icon: '🙏' }
    ]
  },
  {
    day: 'Sexta-feira',
    color: THEME_COLORS.schedule.friday,
    activities: [
      { time: '20h', activity: 'Oração e Palavra', type: 'Online (quando anunciado)', icon: '💻' }
    ],
    special: 'Última sexta do mês: Culto da Família 👨‍👩‍👧‍👦'
  },
  {
    day: 'Terças e Quintas',
    color: THEME_COLORS.schedule.seterec,
    activities: [
      { time: '19h', activity: 'S.E.T.E.R.E.C', type: 'Seminário Teológico', icon: '🎓' }
    ]
  }
];