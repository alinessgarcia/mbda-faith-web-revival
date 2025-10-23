// Dados dos Abrigos - Livro "Abrigo no temporal" por Paul David Tripp

export interface Abrigo {
  id: number;
  titulo: string;
  versiculo: string;
  chamada: string;
  texto: string;
  aplicacao: string;
  reflexoes: string[];
}

export const ABRIGOS_DATA: Abrigo[] = [
  {
    id: 1,
    titulo: "O Senhor é minha luz e salvação",
    versiculo: "Salmo 27:1",
    chamada: "Deus é luz em tempos de escuridão e medo.",
    texto: "Davi começa com uma poderosa afirmação de fé: \"O Senhor é a minha luz e a minha salvação\". Em tempos de trevas emocionais, ansiedade e confusão, Deus se apresenta como Aquele que dissipa as sombras. Ele não apenas oferece salvação espiritual, mas também uma presença iluminadora em meio à insegurança.",
    aplicacao: "Escreva esse versículo em um papel e coloque em um lugar visível da casa. Relembre que nenhuma escuridão é maior do que a luz de Deus.",
    reflexoes: [
      "Que áreas da sua vida hoje parecem escuras?",
      "O que você tem feito com seus medos?"
    ]
  },
  {
    id: 2,
    titulo: "Refúgio contra os ataques",
    versiculo: "Salmo 27:2",
    chamada: "Mesmo quando pessoas se levantam contra nós, Deus permanece.",
    texto: "O salmista fala de adversários reais, gente que quer sua queda. Ainda assim, ele descansa. O verdadeiro refúgio não está na ausência de luta, mas na presença de Deus que o protege.",
    aplicacao: "Lembre-se que sua segurança não está nas circunstâncias, mas em quem está com você nelas.",
    reflexoes: [
      "Quem ou o que tem atacado sua paz ultimamente?",
      "Como você pode confiar em Deus como escudo?"
    ]
  },
  {
    id: 3,
    titulo: "O coração firme diante da guerra",
    versiculo: "Salmo 27:3",
    chamada: "Mesmo em guerra, o coração pode ter paz.",
    texto: "Davi afirma que mesmo se um exército se acampar ao seu redor, seu coração não temerá. A verdadeira segurança vem de dentro – da presença de Deus habitando em nós.",
    aplicacao: "Em momentos de pressão, ore: \"Senhor, fortalece meu coração por dentro\".",
    reflexoes: [
      "Você está em meio a alguma batalha?",
      "Onde está firmada sua coragem?"
    ]
  },
  {
    id: 4,
    titulo: "O desejo de estar com Deus",
    versiculo: "Salmo 27:4",
    chamada: "O maior abrigo não é um lugar, mas uma presença.",
    texto: "Mais do que proteção, Davi deseja comunhão. O seu pedido é: estar na casa do Senhor. A presença de Deus é o maior abrigo da alma.",
    aplicacao: "Separe um tempo diário só para estar com Deus em silêncio.",
    reflexoes: [
      "O que você tem buscado mais: ajuda ou a presença do Ajudador?"
    ]
  },
  {
    id: 5,
    titulo: "Deus me esconderá",
    versiculo: "Salmo 27:5",
    chamada: "Deus sabe como esconder você quando tudo parece exposto.",
    texto: "Há momentos em que parece que o mundo inteiro nos observa cair. Mas Deus, como Pai cuidadoso, nos esconde na segurança da Sua graça.",
    aplicacao: "Medite em como Deus te guardou em situações passadas. Ele continua sendo seu esconderijo.",
    reflexoes: [
      "Você já sentiu que Deus te livrou em silêncio?"
    ]
  },
  {
    id: 6,
    titulo: "Cabeça erguida acima dos inimigos",
    versiculo: "Salmo 27:6",
    chamada: "Quando Deus te levanta, ninguém pode te rebaixar.",
    texto: "Deus ergue a cabeça do seu povo. Mesmo cercado, Davi louva. Esse é o efeito do abrigo divino: liberdade interior mesmo na prisão exterior.",
    aplicacao: "Louve a Deus mesmo em tempos difíceis. Isso muda sua postura interior.",
    reflexoes: [
      "O que você tem feito quando se sente cercado?"
    ]
  },
  {
    id: 7,
    titulo: "Ouve, Senhor, a minha voz",
    versiculo: "Salmo 27:7",
    chamada: "Deus ouve orações feitas com sinceridade.",
    texto: "Davi clama por misericórdia e pede que o Senhor o escute. A oração é o caminho para transformar angústia em abrigo.",
    aplicacao: "Hoje, ore com total transparência. Deus não se ofende com sua dor, Ele a acolhe.",
    reflexoes: [
      "Você tem sido sincero com Deus em suas orações?"
    ]
  },
  {
    id: 8,
    titulo: "Buscarei a tua face",
    versiculo: "Salmo 27:8",
    chamada: "A face de Deus é mais importante que Suas mãos.",
    texto: "Buscar a face do Senhor é buscar intimidade, não apenas bênçãos. Davi responde ao chamado interior para adoração profunda.",
    aplicacao: "Em vez de orar pedindo coisas, apenas adore a Deus hoje.",
    reflexoes: [
      "Você busca a presença de Deus ou apenas o que Ele pode dar?"
    ]
  },
  {
    id: 9,
    titulo: "Não me abandones",
    versiculo: "Salmo 27:9-10",
    chamada: "Deus nunca rejeita os que O buscam.",
    texto: "Davi admite o medo do abandono. Mas mesmo que pai e mãe o deixem, Deus o acolherá. Um abrigo para quem carrega rejeições profundas.",
    aplicacao: "Reafirme em voz alta: \"O Senhor me acolhe.\" Isso cura a alma.",
    reflexoes: [
      "Você carrega feridas de abandono?",
      "Já se sentiu acolhido por Deus?"
    ]
  },
  {
    id: 10,
    titulo: "Espera no Senhor",
    versiculo: "Salmo 27:13-14",
    chamada: "Esperar não é perda de tempo quando você espera por Deus.",
    texto: "A espera em Deus não é passiva. É uma esperança ativa que transforma. Mesmo sem respostas, Davi confia que verá a bondade do Senhor.",
    aplicacao: "Mude sua oração: de \"quando vai acontecer?\" para \"me sustenta enquanto espero\".",
    reflexoes: [
      "Em que área da sua vida você está esperando?",
      "O que Deus quer ensinar nesse tempo?"
    ]
  }
];

// Informações do livro
export const LIVRO_INFO = {
  titulo: "Abrigo no temporal",
  autor: "Paul David Tripp",
  subtitulo: "52 reflexões sobre o salmo 27",
  capaUrl: "https://m.media-amazon.com/images/I/81cOaIh5z7L._SL1500_.jpg",
  introducao: `Existe um lugar seguro, mesmo quando a vida parece sem direção. Existe descanso, mesmo quando não há onde repousar. Existe esperança, mesmo quando a dor insiste.

Abrigo no temporal é um convite a reencontrar essa esperança. Em 52 reflexões sobre o salmo 27, Paul Tripp nos guia a um lugar de refúgio, renovação e paz.

Leia com calma. Deixe cada página tocar seu coração. E descubra, dia após dia, que há um Deus em quem podemos nos abrigar.`
};