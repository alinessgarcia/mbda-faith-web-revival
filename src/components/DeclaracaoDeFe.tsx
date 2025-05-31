
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const declaracoes = [
  {
    id: 1,
    title: "1. Há um só Deus",
    content: "Há um só Deus (Dt 6.4), espírito criador e sustentador de todas as coisas (Jo 4.24; At 4.24; Ne 9.6), infinito e imutável (1Rs 8.27; Tg 1.17), absolutamente soberano (Ef 1.11), sábio (Rm 11.33), justo (Is 45.21), santo (i) e amoroso(1 Jo 4.8); onipresente (Sl 139.7-11), onisciente (Hb 4.13) e onipotente (Jó 42.2), que subsiste eternamente em três Pessoas: o Pai, o Filho e o Espírito Santo (Mt 28.19; 2 Co 13.13)."
  },
  {
    id: 2,
    title: "2. Jesus Cristo é o Filho de Deus",
    content: "Jesus Cristo é o Filho de Deus (Mt 16.16), a segunda Pessoa da Santíssima Trindade (Mt 28.19), totalmente Deus e totalmente homem (Jo 1.14; Rm 9.5;Cl 2.9; 1Tm 2.5; 1Jo 5.20), não-criado (Cl 1.17), eterno (Mq 5.2; Jo 8.58), impecável (1Jo 3.5), gerado pelo Espírito Santo da Virgem Maria (Mt 1.18-23), criador do universo (Jo 1.3; Hb 1.2), sustentador de tudo (Cl 1.16-17; Hb 1.3), salvador de todo aquele que nele crê (Jo 3.16), que, por sua morte na cruz, fez expiação pelo pecado (Gl 3.13), foi ressuscitado ao terceiro dia (1 Co 15.3-4) e subiu aos céus onde está sentado à direita do Pai (At 1.9; Hb 10.12), de onde um dia voltará para estabelecer seu Reino Eterno (Hb 9.27; Ap 11.15)."
  },
  {
    id: 3,
    title: "3. O Espírito Santo é a terceira Pessoa da Santíssima Trindade",
    content: "O Espírito Santo é a terceira Pessoa da Santíssima Trindade (Mt 28.19), o Consolador divino prometido (Jo 15.26), que convence o mundo do pecado, da justiça e do juízo (Jo 16.8-11), que regenera e batiza o crente no momento de sua conversão (Jo 3.3-6; 1 Co 12.13), passando a habitar nele permanentemente(1 Co 6.19), selando-o como propriedade perene de Deus (Rm 8.9; Ef 1.13-14) e dando-lhe dons que o capacitam para o serviço de edificação da igreja(1Co 12.4-7)."
  },
  {
    id: 4,
    title: "4. Dom de línguas",
    content: "O dom de línguas era a capacidade sobrenatural dada por Deus a alguns crentes de falar das grandezas do Senhor em um outro idioma jamais aprendido por quem recebia essa graça (At 2.4-11; 1 Co 12.30), sendo certo que tal capacitação, uma vez que servia como um sinal do juízo iminente de Deus sobre a geração que rejeitou o Filho (1 Co 14.21-22 – compare com Dt 28.45, 46, 49), deixou de existir já no primeiro século, tão logo o castigo do Senhor caiu sobre os judeus no ano 70 d.C., por mão de Tito, general romano, conforme o próprio Senhor Jesus havia predito (Lc 13.34-35)."
  },
  {
    id: 5,
    title: "5. Bíblia, a Palavra de Deus",
    content: "A Bíblia é a Palavra de Deus, inerrante e infalível (Jo 10.35; Sl 119.11), inspirada por ele nos escritos originais (2Tm 3.16), única regra de fé e prática do cristão (Rm 15.4), que foi dada a nós por meio de homens santos que falaram da parte de Deus movidos pelo Espírito Santo (2Pe 1.21), sendo ela o instrumento indispensável do Senhor não só para a salvação do pecador (Rm 1.16; 1 Co 1.21; 2Tm 3.15; Tg 1.18; 1Pe 1.23), mas também para o crescimento do crente na santificação (Sl 119.9; Jo 17.17; Hb 4.12)."
  },
  {
    id: 6,
    title: "6. Homem e mulher: criação de Deus",
    content: "Homem e mulher foram criados por Deus que os fez à sua imagem e semelhança (Gn 1.27; 5.1-2; Tg 3.9), sem pecado (Ec 7.29), com um corpo maravilhosamente formado (Gn 2.7, 21-22 – veja também Sl 139.14) e uma alma imortal (Ec 12.7; Mt 10.28), dando-lhes, em seguida, o domínio sobre toda a criação (Gn 1.26, 29-30) e impondo-lhes o dever de dela cuidar (Gn 2.15)."
  },
  {
    id: 7,
    title: "7. O casamento",
    content: "Ao tempo da criação da humanidade, Deus estabeleceu o casamento (Mt 19.4-6), o ato solene que promove a união entre um homem e uma mulher, jamais podendo ocorrer entre um crente e um incrédulo (1Co 7.39; 2 Co 6.14-15) ou entre pessoas do mesmo sexo (Lv 20.13; 1 Co 6.9-10), e que implica o surgimento de um novo núcleo familiar, o direito ao desfrute do prazer sexual e a criação de um vínculo que só se dissolve com a morte de um dos cônjuges (Mt 5.32; 19.9; Lc 16.18; Rm 7.2-3; 1 Co 7.10-11, 39; Hb 13.4)."
  },
  {
    id: 8,
    title: "8. O pecado",
    content: "O pecado entrou no mundo por um ato voluntário do primeiro ser humano (1 Tm 2.14) que, no Éden, desobedeceu a ordem expressa de Deus, comendo do fruto proibido (Gn 3.6 – compare com Gn 2.16-17). Como resultado disso, toda a raça, representada em Adão, tornou-se pecadora (Rm 3.23; 5.18). A morte, que é o salário do pecado (Rm 6.23), passou a todos os homens (Rm 5.12), os quais, agora, estão separados de Deus (Ef 4.18), eternamente perdidos (Mt 25.41, 46) e vivendo conforme os ditames de suas próprias paixões e raciocínios vãos (Ef 2.1-3; 4.17)."
  },
  {
    id: 9,
    title: "9. A salvação",
    content: "A provisão para a salvação do ser humano foi feita em Cristo, o qual, por sua morte na cruz do Calvário, satisfez as exigências de Deus, sofrendo as conseqüências da nossa culpa (Mt 20.28; Gl 3.13; 1 Pe 2.24; 3.18; 1 Jo 2.2; 4.10). Ao ressuscitar ao terceiro dia (1Co 15.3-4), nosso Senhor demonstrou que a justiça de Deus foi plenamente satisfeita por ele no Gólgota (Rm 4.25; 1 Pe 1.3), bastando agora que o pecador o receba pela fé (Jo 3.36; Ef 2.8) como seu único e suficiente salvador (At 4.12; 1 Tm 2.5) a fim de ter o perdão dos pecados (Rm 5.1; Ef 1.7) e a remoção da culpa que leva à eterna condenação (Rm 8.1)."
  },
  {
    id: 10,
    title: "10. Fé versus obras",
    content: "A salvação do homem é somente pela fé em Cristo e nunca por boas obras (Jo 6.28-29; Rm 3.20-24; Gl 3.11), sendo certo que essa fé é dom de Deus que a concede aos seus eleitos (Jo 6.65; At 11.18; Ef 2.8; Fl 1.29; 2 Pe 1.1), ou seja, àqueles que o Senhor, unicamente por sua graça, escolheu antes da fundação do mundo e predestinou para serem salvos (Rm 9.14-18; Ef 1.4-5, 11). A eleição ocorreu sem que Deus visse de antemão qualquer virtude que tornasse os predestinados dignos do seu favor (Rm 5.6-8; 9.10-13). Deus também não escolheu seu povo por antever que creriam, uma vez que, conforme já dito, a fé salvadora é concedida por ele próprio aos eleitos (Jo 6.37, 44, 65; At 13.48;  Rm 8.29-30)."
  },
  {
    id: 11,
    title: "11. A igreja",
    content: "A igreja é a comunidade dos crentes em Cristo (Ef 1.1), comprada, fundada, protegida, edificada e dirigida por ele (Mt 16.18; At 20.28), a qual se reúne para cultuar o Deus Trino (At 13.1-2), sustentar com firmeza a verdade revelada (1 Tm 3.15), observar as ordenanças do Senhor (batismo e ceia), nutrir uma amorosa, edificante e pura comunhão entre os irmãos (At 2.42-47) e proclamar a salvação ao mundo (1 Pe 2.9), tudo com o propósito final de promover a glória de Deus (Ef 3.21)."
  },
  {
    id: 12,
    title: "12. Batismo e ceia",
    content: "As duas ordenanças estabelecidas por Cristo e que devem ser regularmente observadas pela igreja são o batismo e a ceia (Mt 28.19-20; Lc 22.19-20). A primeira, que não pode ser entendida como um meio de salvação  (1 Co 1.14-17), deve ser realizada somente depois que o indivíduo crê  (At 2.41-42), sendo, portanto, inaceitável o batismo de bebês. A forma correta de batismo, à luz da Bíblia, é a imersão total do crente na água (Mc 1.9-11; Jo 3.23; At 8.36-39). Quanto à ceia, esta deve ser distribuída em dois elementos: o pão, que é símbolo do corpo de Cristo, e o cálice, que representa seu sangue (1 Co 11.23-26). Tais elementos não podem ser negados a nenhum crente em Cristo (1 Co 11.28). Frise-se ainda que a ceia consiste de um memorial em que a igreja recorda a morte do Filho de Deus na cruz do Calvário para remissão dos pecados, sendo supersticiosa a crença de que o corpo e o sangue do Senhor estão de alguma forma presentes nos elementos, ou que se pode obter a vida eterna participando deles."
  },
  {
    id: 13,
    title: "13. Os anjos",
    content: "Os anjos são seres espirituais poderosos, criados por Deus para glorificá-lo e cumprir suas ordens (Sl 103.20; Is 6.2-3). Tais seres têm como uma de suas funções ministrar em prol dos crentes (Lc 16.22; Hb 1.13-14). Sabe-se que todos esses seres foram criados santos por Deus (Jó 38.4-7). Porém, há indícios na Escritura que, na pré-criação, um número deles se rebelou e, sendo agora chamados de demônios, foram confirmados na maldade (2 Pe 2.4; Jd 6), enquanto os que guardaram seu estado original, também chamados de anjos eleitos, foram confirmados em bondade (1 Tm 5.21). Não há esperança de arrependimento para os demônios (Hb 2.16), nem possibilidade de queda para os anjos bons, havendo um lugar fixo para as duas categorias no plano de Deus para o futuro (Mt 25.31; Mc 8.38; 1 Co 6.3; Ap 12.7-9)."
  },
  {
    id: 14,
    title: "14. Satanás",
    content: "Satanás, o nosso adversário, é um anjo que foi criado por Deus sem pecado e que exerceu uma posição de autoridade sobre os demais seres espirituais (Ez 28.12-15). Ocorreu, porém, que, movido pelo orgulho, rebelou-se desejando ser como Deus, pelo que foi destituído de sua posição original e destinado ao inferno (Is 14.12-15; Ez 28.15-19; Mt 25.41; Ap 12.9-10). Sua obra consiste, de modo geral, em acusar, atacar e tentar os servos de Deus a fim de destruí-los (Jó 2.7; At 5.3; 1 Ts 3.5; 1 Pe 5.8-9; Ap 12.9-10), obstruir o avanço do evangelho e enganar os homens, mantendo-os sob seu controle e domínio (Mc 4.15;  2 Co 4.4; Ef 2.1-2; 2 Tm 2.26)."
  },
  {
    id: 15,
    title: "15. O plano de Deus",
    content: "O plano de Deus para o futuro abrange a ressurreição dos crentes (1 Co 15.20-23; 1 Ts 4.16), o arrebatamento da igreja (1 Ts 4.13-18;  1 Co 15.50-53), o surgimento do Anticristo (Dn 7.8; 2 Ts 2.3-4), a Grande Tribulação (Dn 9.27; Mt 24.21-29; Ap 11.2-3; 12.6, 14; 13.5), a Segunda Vinda de Cristo (Mt 24.37-44; At 1.11; Ap 1.7), o estabelecimento do Reino Milenar (Ap 20.1-6), o Juízo Final (Ap 20.11-15) e a criação de novos céus e nova terra (Ap 21.1-8). Ao fim da história, os justos viverão para sempre na presença de Deus, enquanto os que rejeitaram a salvação oferecida por Cristo sofrerão a pena da eterna destruição (Dn 12.2-3; 2 Ts 1.9; Ap 14.9-11)."
  }
];

const DeclaracaoDeFe = () => {
  const [open, setOpen] = useState(false);
  const [currentDeclaracao, setCurrentDeclaracao] = useState(0);

  const nextDeclaracao = () => {
    setCurrentDeclaracao((prev) => (prev === declaracoes.length - 1 ? 0 : prev + 1));
  };

  const prevDeclaracao = () => {
    setCurrentDeclaracao((prev) => (prev === 0 ? declaracoes.length - 1 : prev - 1));
  };

  return (
    <section id="declaracao-de-fe" className="section-padding bg-blue-50" pt-0>
      <div className="container mx-auto text-center pt-0">
        <div className="mb-12 animate-fade-in"></div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg text-blue-900 mt-0">
      Declaração de Fé
    </h2>
        <p className="text-blue-900 font-bold max-w-3xl mx-auto mb-8 text-center">
          Nossa fé é fundamentada nas Escrituras Sagradas. Confira nossa declaração
          de fé para conhecer os princípios que norteiam nossa comunidade.
        </p>
        <button onClick={() => setOpen(true)} className="btn-primary">
          Ver Declaração de Fé
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                {declaracoes[currentDeclaracao].title}
              </DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                {declaracoes[currentDeclaracao].content}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-900">
                  {currentDeclaracao + 1} de {declaracoes.length}
                </span>
                <div className="flex space-x-4">
                  <button
                    onClick={prevDeclaracao}
                    className="p-2 rounded-full bg-blue-900 hover:bg-blue-300"
                    aria-label="Item anterior"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M15 19l-7-7 7-7"
/>
</svg>
</button>

<button
  onClick={nextDeclaracao}
  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
  aria-label="Próximo item"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
</button>
</div>
</div>
</div>
</DialogContent>
</Dialog>
</div>
</section>
);
};

export default DeclaracaoDeFe;
