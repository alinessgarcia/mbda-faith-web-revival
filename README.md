# MB da Reconciliação — Site e ReconNews

Este repositório contém o site da Igreja MB da Reconciliação e o módulo de notícias ReconNews, desenvolvido com React, TypeScript e Vite.

## Tecnologias
- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn-ui

## Requisitos
- Node.js (recomendado LTS)
- npm

## Desenvolvimento
```sh
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```
A aplicação inicia por padrão em http://localhost:8080/.

## Build de produção
```sh
# Compilar TypeScript e gerar build
npm run build

# Pré-visualizar o build de produção
npm run preview
```

## Qualidade de código
```sh
# Lint (verifica padrões e possíveis problemas)
npm run lint
```

## Estrutura do projeto
- src/components: componentes React
- src/pages: páginas principais (Index, etc.)
- src/api: integração de notícias (ReconNews)
- src/data: dados estáticos úteis
- src/index.css: estilos globais (Tailwind + utilitários)

## Deploy
Recomendado: Vercel ou outra plataforma de sua preferência.

- Faça o build (`npm run build`)
- Configure a plataforma para servir o diretório `dist`

## Observações
- Componentes e dados não utilizados foram arquivados em `_archive` para possível uso futuro, sem impacto no build atual.
- Menções e dependências externas não usadas (ex.: ferramentas não essenciais ao projeto) foram removidas para manter o repositório enxuto.
