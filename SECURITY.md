# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

Se você descobrir uma vulnerabilidade de segurança neste projeto, por favor nos informe de forma responsável.

### Como reportar:

1. **NÃO** abra uma issue pública
2. Envie um email para: [SEU-EMAIL@DOMINIO.COM]
3. Inclua o máximo de detalhes possível:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

### O que esperar:

- **Confirmação**: Responderemos em até 48 horas
- **Avaliação**: Avaliaremos a vulnerabilidade em até 7 dias
- **Correção**: Trabalharemos para corrigir vulnerabilidades críticas em até 30 dias
- **Divulgação**: Coordenaremos a divulgação responsável após a correção

### Vulnerabilidades aceitas:

- Injeção de código (XSS, SQL Injection, etc.)
- Problemas de autenticação/autorização
- Exposição de dados sensíveis
- Vulnerabilidades em dependências críticas

### Fora do escopo:

- Problemas de UI/UX que não afetam segurança
- Vulnerabilidades em dependências de desenvolvimento
- Ataques que requerem acesso físico ao dispositivo
- Problemas já conhecidos e documentados

## Medidas de Segurança Implementadas

### Frontend:
- Content Security Policy (CSP)
- Headers de segurança (X-Frame-Options, etc.)
- Sanitização de inputs
- Environment variables para chaves API

### GitHub:
- Branch protection rules
- Dependabot para atualizações automáticas
- Security scanning com CodeQL
- Secrets management

### Deploy:
- HTTPS obrigatório
- Headers de segurança via Vercel
- Environment variables seguras

## Contato

Para questões de segurança: [SEU-EMAIL@DOMINIO.COM]
Para outras questões: [Abra uma issue no GitHub]

---

**Obrigado por ajudar a manter o Ministério Bíblico da Reconciliação seguro!** 🙏