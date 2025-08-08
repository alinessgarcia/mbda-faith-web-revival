# 🛡️ Guia Completo: Testes de Invasão e Implementação de Segurança

**Documento Base para Todos os Projetos Web**  
**Versão:** 1.0  
**Data:** $(date '+%Y-%m-%d')  
**Projeto Referência:** MBdaReconciliação  

---

## 📋 **ÍNDICE**

1. [Metodologia de Testes de Invasão](#metodologia)
2. [Vetores de Ataque Identificados](#vetores)
3. [Implementação de Segurança](#implementacao)
4. [Scripts e Ferramentas](#scripts)
5. [Checklist de Segurança](#checklist)
6. [Monitoramento Contínuo](#monitoramento)
7. [Plano de Resposta a Incidentes](#resposta)

---

## 🎯 **METODOLOGIA DE TESTES DE INVASÃO** {#metodologia}

### **Fase 1: Reconhecimento**
```bash
# Análise de DNS
nslookup dominio.com.br
dig dominio.com.br ANY

# Scan de portas
nmap -sS -O dominio.com.br

# Análise de headers HTTP
curl -I https://dominio.com.br
```

### **Fase 2: Enumeração**
- **Tecnologias utilizadas:** React, TypeScript, Vite, Vercel
- **CDNs externos:** Google Fonts, EmailJS, Vercel Analytics
- **Domínios de imagem:** Imgur, Amazon S3
- **Serviços de terceiros:** YouTube (embeds)

### **Fase 3: Análise de Vulnerabilidades**

#### **3.1 Frontend Vulnerabilities**
```javascript
// ❌ VULNERABILIDADES COMUNS A PROCURAR:

// XSS (Cross-Site Scripting)
// Procurar por innerHTML sem sanitização
document.innerHTML = userInput; // PERIGOSO

// Dados sensíveis expostos
const API_KEY = "sk-1234567890"; // NUNCA FAZER

// CORS mal configurado
fetch('https://api.externa.com', {
  mode: 'cors' // Verificar origens permitidas
});

// Validação client-side apenas
if (email.includes('@')) { // Insuficiente
  // Enviar dados
}
```

#### **3.2 Infrastructure Vulnerabilities**
- **Headers de segurança ausentes**
- **HTTPS não forçado**
- **Environment variables expostas**
- **Dependências desatualizadas**
- **Branch protection desabilitada**

### **Fase 4: Exploração Controlada**

#### **4.1 Teste de Rate Limiting**
```bash
# Teste de spam no formulário
for i in {1..10}; do
  curl -X POST https://dominio.com.br/api/contact \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","message":"spam"}'
done
```

#### **4.2 Teste de Validação de Email**
```javascript
// Emails para testar
const testEmails = [
  'test@tempmail.org',      // Email temporário
  'admin@localhost',        // Domínio local
  'user123@fake.com',       // Padrão suspeito
  '<script>alert(1)</script>@test.com', // XSS
  'a@b.c',                  // Muito curto
  'normal@gmail.com'        // Válido
];
```

#### **4.3 Teste de Honeypot**
```html
<!-- Campo honeypot - deve estar invisível -->
<input type="text" name="website" style="display:none" />
```

---

## ⚔️ **VETORES DE ATAQUE IDENTIFICADOS** {#vetores}

### **1. Ataques ao Frontend**

#### **XSS (Cross-Site Scripting)**
```javascript
// ❌ VULNERÁVEL:
element.innerHTML = userInput;

// ✅ SEGURO:
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

#### **CSRF (Cross-Site Request Forgery)**
```javascript
// ✅ PROTEÇÃO:
// Usar tokens CSRF ou SameSite cookies
fetch('/api/action', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': getCsrfToken(),
    'Content-Type': 'application/json'
  }
});
```

#### **Client-Side Injection**
```javascript
// ❌ PERIGOSO:
eval(userInput);
new Function(userInput)();

// ✅ SEGURO:
// Nunca executar código do usuário
```

### **2. Ataques à Infraestrutura**

#### **DDoS (Distributed Denial of Service)**
- **Proteção:** Rate limiting, CDN, load balancing
- **Monitoramento:** Alertas de tráfego anômalo

#### **DNS Poisoning**
- **Proteção:** DNSSEC, monitoramento de DNS
- **Verificação:** Múltiplos resolvers DNS

#### **Supply Chain Attacks**
```bash
# Verificar integridade de dependências
npm audit --audit-level high
npm ls --depth=0
```

### **3. Ataques Específicos ao Projeto**

#### **EmailJS Exploitation**
```javascript
// ❌ VULNERÁVEL:
const config = {
  serviceId: 'service_123', // Hardcoded
  templateId: 'template_456'
};

// ✅ SEGURO:
const config = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID
};
```

#### **Form Spam/Abuse**
- **Rate limiting:** 3 tentativas / 5 minutos
- **Email validation:** Detectar temporários
- **Honeypot:** Campo invisível para bots
- **Sanitização:** Remover scripts maliciosos

---

## 🛡️ **IMPLEMENTAÇÃO DE SEGURANÇA** {#implementacao}

### **Camada 1: Headers de Segurança**

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.emailjs.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://i.imgur.com data:; connect-src 'self' https://api.emailjs.com;"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### **Camada 2: Environment Variables**

```bash
# .env.local (NUNCA COMMITAR)
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxx
```

```javascript
// src/config/emailjs.ts
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};
```

### **Camada 3: Rate Limiting**

```typescript
// src/utils/rateLimiter.ts
class RateLimiter {
  private attempts: Map<string, RateLimitAttempt> = new Map();
  
  constructor(
    private maxAttempts: number = 3,
    private timeWindow: number = 300000, // 5 min
    private cooldownPeriod: number = 900000 // 15 min
  ) {}

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) return true;

    if (now - attempt.timestamp > this.cooldownPeriod) {
      this.attempts.delete(identifier);
      return true;
    }

    if (now - attempt.timestamp < this.timeWindow) {
      return attempt.count < this.maxAttempts;
    }

    attempt.count = 0;
    attempt.timestamp = now;
    return true;
  }

  recordAttempt(identifier: string, success: boolean = false): void {
    if (success) {
      this.attempts.delete(identifier);
      return;
    }

    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { timestamp: now, count: 1 });
    } else {
      if (now - attempt.timestamp < this.timeWindow) {
        attempt.count++;
      } else {
        attempt.timestamp = now;
        attempt.count = 1;
      }
    }
  }
}
```

### **Camada 4: Validação Avançada**

```typescript
// src/utils/emailValidator.ts
const TEMPORARY_EMAIL_DOMAINS = [
  'tempmail.org', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwaway.email', 'yopmail.com'
];

const SUSPICIOUS_PATTERNS = [
  /^test\d*@/i,
  /^admin\d*@/i,
  /^user\d*@/i,
  /^fake\d*@/i,
  /^\d+@/,
  /^[a-z]{1,2}@/i
];

export function validateEmail(email: string): EmailValidationResult {
  const result = {
    isValid: false,
    isSuspicious: false,
    isTemporary: false,
    score: 0
  };

  // Validação básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return result;
  }

  const [localPart, domain] = email.toLowerCase().split('@');

  // Verificar domínio temporário
  if (TEMPORARY_EMAIL_DOMAINS.includes(domain)) {
    result.isTemporary = true;
    result.isSuspicious = true;
    result.score = 10;
    return result;
  }

  // Verificar padrões suspeitos
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(email)) {
      result.isSuspicious = true;
      result.score = 20;
      break;
    }
  }

  result.isValid = true;
  result.score = result.isSuspicious ? 20 : 80;
  
  return result;
}
```

### **Camada 5: Sanitização**

```typescript
// src/utils/emailValidator.ts
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .substring(0, 1000);
}

export function isBot(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0;
}
```

---

## 🔧 **SCRIPTS E FERRAMENTAS** {#scripts}

### **Script de Backup Automatizado**

```bash
#!/bin/bash
# scripts/backup.sh

REPO_URL="https://github.com/user/projeto.git"
BACKUP_DIR="$HOME/backups/projeto"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE"

mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

# Clone completo
git clone --mirror "$REPO_URL" "$BACKUP_NAME.git"

# Metadados
cat > "$BACKUP_NAME.info" << EOF
Data: $(date '+%Y-%m-%d %H:%M:%S')
Repositório: $REPO_URL
Tamanho: $(du -sh "$BACKUP_NAME.git" | cut -f1)
Hash: $(cd "$BACKUP_NAME.git" && git rev-parse HEAD)
EOF

# Comprimir
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME.git" "$BACKUP_NAME.info"
rm -rf "$BACKUP_NAME.git" "$BACKUP_NAME.info"

# Limpeza (manter 30 backups)
ls -1t backup_*.tar.gz | tail -n +31 | xargs rm -f

echo "✅ Backup criado: $BACKUP_NAME.tar.gz"
```

### **Script de Auditoria de Segurança**

```bash
#!/bin/bash
# scripts/security-audit.sh

REPORT_FILE="security-reports/audit-$(date +%Y%m%d_%H%M%S).md"
mkdir -p security-reports

echo "# 🛡️ Relatório de Auditoria de Segurança" > "$REPORT_FILE"
echo "**Data:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"

# 1. NPM Audit
echo "## 📦 Dependências" >> "$REPORT_FILE"
if npm audit --audit-level=moderate >> "$REPORT_FILE" 2>&1; then
  echo "✅ Sem vulnerabilidades críticas" >> "$REPORT_FILE"
else
  echo "⚠️ Vulnerabilidades encontradas" >> "$REPORT_FILE"
fi

# 2. Arquivos sensíveis
echo "## 🔐 Arquivos Sensíveis" >> "$REPORT_FILE"
SENSITIVE_FILES=(".env" ".env.local" "*.key" "*.pem")
FOUND_SENSITIVE=false

for pattern in "${SENSITIVE_FILES[@]}"; do
  if find . -name "$pattern" -not -path "./node_modules/*" | grep -q .; then
    echo "⚠️ Encontrado: $pattern" >> "$REPORT_FILE"
    FOUND_SENSITIVE=true
  fi
done

if [ "$FOUND_SENSITIVE" = false ]; then
  echo "✅ Nenhum arquivo sensível no repositório" >> "$REPORT_FILE"
fi

# 3. Headers de segurança
echo "## 🛡️ Headers de Segurança" >> "$REPORT_FILE"
if [ -f "vercel.json" ]; then
  REQUIRED_HEADERS=("Content-Security-Policy" "X-Frame-Options")
  for header in "${REQUIRED_HEADERS[@]}"; do
    if grep -q "$header" vercel.json; then
      echo "✅ $header configurado" >> "$REPORT_FILE"
    else
      echo "❌ $header faltando" >> "$REPORT_FILE"
    fi
  done
fi

echo "📄 Relatório salvo: $REPORT_FILE"
```

### **GitHub Actions - Backup Automático**

```yaml
# .github/workflows/backup.yml
name: Automated Backup

on:
  schedule:
    - cron: '0 2 * * 0' # Todo domingo às 2h UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Create backup
      run: |
        BACKUP_NAME="projeto-backup-$(date +%Y%m%d_%H%M%S)"
        
        # Arquivo tar
        tar -czf "${BACKUP_NAME}.tar.gz" \
          --exclude='.git' \
          --exclude='node_modules' \
          .
          
        # Bundle Git
        git bundle create "${BACKUP_NAME}-git.bundle" --all
        
        echo "BACKUP_NAME=${BACKUP_NAME}" >> $GITHUB_ENV
        
    - name: Upload artifacts
      uses: actions/upload-artifact@v4
      with:
        name: ${{ env.BACKUP_NAME }}
        path: |
          ${{ env.BACKUP_NAME }}.tar.gz
          ${{ env.BACKUP_NAME }}-git.bundle
        retention-days: 90
```

### **GitHub Actions - Security Scan**

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: NPM Audit
      run: npm audit --audit-level high
      
    - name: Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        
    - name: CodeQL Analysis
      uses: github/codeql-action/analyze@v3
```

---

## ✅ **CHECKLIST DE SEGURANÇA** {#checklist}

### **Frontend Security**
- [ ] Headers de segurança configurados (CSP, X-Frame-Options, etc.)
- [ ] Environment variables para chaves API
- [ ] Sanitização de inputs do usuário
- [ ] Validação client-side E server-side
- [ ] Rate limiting implementado
- [ ] Honeypot para detectar bots
- [ ] HTTPS forçado
- [ ] Dependências atualizadas

### **GitHub Security**
- [ ] Branch protection rules ativadas
- [ ] Dependabot configurado
- [ ] Security scanning (CodeQL, Snyk)
- [ ] Secrets management
- [ ] .gitignore protegendo arquivos sensíveis
- [ ] SECURITY.md criado

### **Infrastructure Security**
- [ ] Backup automatizado configurado
- [ ] Monitoramento de logs
- [ ] Alertas de segurança
- [ ] Plano de resposta a incidentes
- [ ] Auditoria regular de segurança

### **Deployment Security**
- [ ] Environment variables no Vercel
- [ ] Custom domain com HTTPS
- [ ] Headers de segurança aplicados
- [ ] CDN configurado corretamente
- [ ] Logs de acesso monitorados

---

## 📊 **MONITORAMENTO CONTÍNUO** {#monitoramento}

### **Métricas de Segurança**
```javascript
// Exemplo de monitoramento
const securityMetrics = {
  rateLimitHits: 0,
  suspiciousEmails: 0,
  botAttempts: 0,
  failedValidations: 0
};

// Registrar eventos
function logSecurityEvent(type, details) {
  console.log(`[SECURITY] ${type}:`, details);
  securityMetrics[type]++;
  
  // Enviar para serviço de monitoramento
  if (typeof analytics !== 'undefined') {
    analytics.track('Security Event', {
      type,
      details,
      timestamp: new Date().toISOString()
    });
  }
}
```

### **Alertas Automáticos**
- **Rate limit excedido:** > 10 tentativas/hora
- **Emails suspeitos:** > 5 tentativas/dia
- **Bots detectados:** > 3 tentativas/hora
- **Vulnerabilidades:** Dependências críticas

### **Relatórios Semanais**
```bash
# Cron job para relatório semanal
0 9 * * 1 /path/to/scripts/security-audit.sh
```

---

## 🚨 **PLANO DE RESPOSTA A INCIDENTES** {#resposta}

### **Classificação de Incidentes**

#### **Nível 1 - Baixo**
- Tentativas de spam bloqueadas
- Rate limiting ativado
- **Ação:** Monitorar

#### **Nível 2 - Médio**
- Múltiplas tentativas de bypass
- Padrões de ataque identificados
- **Ação:** Investigar e fortalecer defesas

#### **Nível 3 - Alto**
- Possível comprometimento
- Dados sensíveis expostos
- **Ação:** Resposta imediata

#### **Nível 4 - Crítico**
- Sistema comprometido
- Perda de dados
- **Ação:** Plano de emergência

### **Procedimentos de Resposta**

#### **Detecção**
1. Monitoramento automático detecta anomalia
2. Alertas enviados para equipe
3. Análise inicial em 15 minutos

#### **Contenção**
1. Isolar sistema afetado
2. Preservar evidências
3. Implementar medidas temporárias

#### **Erradicação**
1. Identificar causa raiz
2. Remover ameaça
3. Aplicar patches/correções

#### **Recuperação**
1. Restaurar sistemas
2. Monitorar atividade
3. Validar integridade

#### **Lições Aprendidas**
1. Documentar incidente
2. Atualizar procedimentos
3. Treinar equipe

### **Contatos de Emergência**
```
Desenvolvedor Principal: [email]
Administrador Sistema: [email]
Provedor Hosting: [suporte]
Registrar Domínio: [suporte]
```

### **Backup de Emergência**
```bash
# Restauração rápida
cd ~/backups/projeto
ls -lt backup_*.tar.gz | head -1
tar -xzf [backup-mais-recente].tar.gz
cd projeto-restaurado
npm install
npm run build
```

---

## 📚 **RECURSOS ADICIONAIS**

### **Ferramentas Recomendadas**
- **OWASP ZAP:** Scanner de vulnerabilidades
- **Burp Suite:** Teste de penetração
- **Snyk:** Análise de dependências
- **SecurityHeaders.com:** Teste de headers
- **SSL Labs:** Teste de SSL/TLS

### **Documentação**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Vercel Security](https://vercel.com/docs/security)
- [GitHub Security](https://docs.github.com/en/code-security)

### **Treinamento**
- Curso de segurança web
- Certificações em cybersecurity
- Workshops de ethical hacking
- Simulações de incidentes

---

## 🎯 **CONCLUSÃO**

Este guia fornece uma base sólida para implementar segurança em projetos web. A segurança é um processo contínuo que requer:

1. **Implementação em camadas**
2. **Monitoramento constante**
3. **Atualizações regulares**
4. **Treinamento da equipe**
5. **Planos de resposta**

**Score de Segurança Alvo:** 85-95/100

**Revisão:** Trimestral ou após incidentes

---

*Documento criado baseado na implementação real do projeto MBdaReconciliação - Use como template para todos os projetos web.*