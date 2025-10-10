# 🔒 Guia de Atualização para Vite 7.x

## ⚠️ IMPORTANTE: Backup Primeiro
Antes de começar, faça backup do seu projeto ou commit as mudanças atuais.

## 📋 Passo a Passo

### 1. Execute o Comando de Correção
```bash
npm audit fix --force
```

### 2. Principais Mudanças do Vite 7.x

#### Breaking Changes Esperados:
- **Nova API de Configuração**: Vite 7 pode ter mudanças na estrutura de configuração
- **Node.js**: Requer Node 18+ (preferencialmente 20+)
- **Plugins**: Alguns plugins podem precisar de atualização
- **Environment API**: Nova API de ambientes

### 3. Atualize Dependências Críticas

Após o `npm audit fix --force`, execute:

```bash
# Atualizar plugins do Vite
npm install -D @vitejs/plugin-react-swc@latest

# Atualizar TypeScript se necessário
npm install -D typescript@latest

# Atualizar ESLint se necessário
npm install -D eslint@latest typescript-eslint@latest
```

### 4. Verifique a Versão do Node.js

```bash
node --version
```

Se estiver abaixo de v18, atualize o Node.js antes de prosseguir.

### 5. Arquivos que Precisam de Atualização

Após o `npm audit fix --force`, verifique se os seguintes arquivos precisam de ajustes:

#### ✅ `vite.config.ts`
- Verifique se há novas opções de configuração
- A estrutura básica deve permanecer compatível

#### ✅ `tsconfig.json` / `tsconfig.app.json`
- Verifique compatibilidade com novas versões do TypeScript
- Configurações atuais devem funcionar

#### ✅ `eslint.config.js`
- Pode precisar ajustes se ESLint 9+ for instalado

### 6. Teste o Projeto

```bash
# Limpar cache
rm -rf node_modules/.vite

# Iniciar servidor de desenvolvimento
npm run dev

# Verificar build de produção
npm run build
```

### 7. Possíveis Problemas e Soluções

#### Problema: Plugin não compatível
**Solução:**
```bash
# Verificar versão do plugin
npm list @vitejs/plugin-react-swc

# Atualizar se necessário
npm install -D @vitejs/plugin-react-swc@latest
```

#### Problema: Erro de configuração do Vite
**Solução:** Consulte as mudanças em https://vitejs.dev/guide/migration.html

#### Problema: Erro no build
**Solução:**
```bash
# Limpar completamente
rm -rf node_modules package-lock.json
npm install
```

### 8. Configurações Específicas do Projeto

Seu projeto usa:
- ✅ React com SWC (otimizado)
- ✅ TypeScript (configuração relaxada para desenvolvimento)
- ✅ Tailwind CSS
- ✅ Radix UI
- ✅ Supabase
- ✅ Vercel (deploy)

**Nenhuma dessas dependências deve causar problemas com Vite 7.x**

### 9. Verificação de Segurança

Após a atualização:

```bash
# Verificar vulnerabilidades restantes
npm audit

# Verificar dependências desatualizadas
npm outdated
```

### 10. Deploy no Vercel

O `vercel.json` está otimizado e não precisa de mudanças. Após testar localmente:

```bash
# Deploy
vercel --prod
```

## 🎯 Checklist Final

- [ ] Backup realizado
- [ ] `npm audit fix --force` executado
- [ ] Node.js 18+ instalado
- [ ] `npm run dev` funciona
- [ ] `npm run build` funciona
- [ ] Funcionalidades testadas no navegador
- [ ] Deploy no Vercel bem-sucedido
- [ ] `npm audit` mostra 0 vulnerabilidades (ou muito reduzidas)

## 📞 Suporte

Se encontrar problemas específicos:
1. Verifique os logs de erro completos
2. Consulte https://vitejs.dev/guide/migration.html
3. Verifique compatibilidade de plugins específicos

## 🔄 Rollback (se necessário)

Se algo der muito errado:
```bash
git checkout package.json package-lock.json
npm install
```