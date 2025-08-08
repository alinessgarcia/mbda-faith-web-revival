#!/bin/bash

# 🔍 Script de Auditoria de Segurança para MBdaReconciliação
# Executa verificações automáticas de segurança

set -e  # Parar em caso de erro

# Configurações
PROJECT_DIR="$(pwd)"
REPORT_DIR="$PROJECT_DIR/security-reports"
DATE=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/security-audit-$DATE.md"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Criar diretório de relatórios
mkdir -p "$REPORT_DIR"

# Inicializar relatório
cat > "$REPORT_FILE" << EOF
# 🛡️ Relatório de Auditoria de Segurança - MBdaReconciliação

**Data:** $(date '+%Y-%m-%d %H:%M:%S')  
**Projeto:** Ministério Bíblico da Reconciliação  
**Versão:** $(git describe --tags --always 2>/dev/null || echo "N/A")  
**Branch:** $(git branch --show-current 2>/dev/null || echo "N/A")  

---

EOF

log "🔍 Iniciando auditoria de segurança..."

# 1. Verificar dependências vulneráveis
log "📦 Verificando dependências..."
echo "## 📦 Análise de Dependências" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if command -v npm &> /dev/null; then
    echo "### NPM Audit" >> "$REPORT_FILE"
    echo "\`\`\`" >> "$REPORT_FILE"
    if npm audit --audit-level=moderate >> "$REPORT_FILE" 2>&1; then
        success "NPM audit passou sem vulnerabilidades críticas"
        echo "✅ **Status:** Sem vulnerabilidades críticas encontradas" >> "$REPORT_FILE"
    else
        warning "NPM audit encontrou vulnerabilidades"
        echo "⚠️ **Status:** Vulnerabilidades encontradas (veja detalhes acima)" >> "$REPORT_FILE"
    fi
    echo "\`\`\`" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
else
    error "NPM não encontrado"
    echo "❌ **Erro:** NPM não encontrado" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

# 2. Verificar arquivos sensíveis
log "🔐 Verificando arquivos sensíveis..."
echo "## 🔐 Arquivos Sensíveis" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

SENSITIVE_FILES=(".env" ".env.local" ".env.production" "config/secrets.js" "*.key" "*.pem")
FOUND_SENSITIVE=false

for pattern in "${SENSITIVE_FILES[@]}"; do
    if find . -name "$pattern" -not -path "./node_modules/*" -not -path "./.git/*" | grep -q .; then
        echo "⚠️ Encontrado: $pattern" >> "$REPORT_FILE"
        FOUND_SENSITIVE=true
    fi
done

if [ "$FOUND_SENSITIVE" = false ]; then
    success "Nenhum arquivo sensível encontrado no repositório"
    echo "✅ **Status:** Nenhum arquivo sensível encontrado no repositório" >> "$REPORT_FILE"
else
    warning "Arquivos sensíveis encontrados"
    echo "⚠️ **Status:** Arquivos sensíveis encontrados (verifique se estão no .gitignore)" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# 3. Verificar .gitignore
log "📝 Verificando .gitignore..."
echo "## 📝 Configuração .gitignore" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ -f ".gitignore" ]; then
    REQUIRED_PATTERNS=("*.local" ".env" "node_modules" "dist")
    MISSING_PATTERNS=()
    
    for pattern in "${REQUIRED_PATTERNS[@]}"; do
        if ! grep -q "$pattern" .gitignore; then
            MISSING_PATTERNS+=("$pattern")
        fi
    done
    
    if [ ${#MISSING_PATTERNS[@]} -eq 0 ]; then
        success ".gitignore configurado corretamente"
        echo "✅ **Status:** .gitignore configurado corretamente" >> "$REPORT_FILE"
    else
        warning "Padrões faltando no .gitignore: ${MISSING_PATTERNS[*]}"
        echo "⚠️ **Status:** Padrões faltando no .gitignore:" >> "$REPORT_FILE"
        for pattern in "${MISSING_PATTERNS[@]}"; do
            echo "   - $pattern" >> "$REPORT_FILE"
        done
    fi
else
    error ".gitignore não encontrado"
    echo "❌ **Status:** .gitignore não encontrado" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# 4. Verificar headers de segurança
log "🛡️ Verificando headers de segurança..."
echo "## 🛡️ Headers de Segurança" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ -f "vercel.json" ]; then
    REQUIRED_HEADERS=("Content-Security-Policy" "X-Frame-Options" "X-Content-Type-Options")
    MISSING_HEADERS=()
    
    for header in "${REQUIRED_HEADERS[@]}"; do
        if ! grep -q "$header" vercel.json; then
            MISSING_HEADERS+=("$header")
        fi
    done
    
    if [ ${#MISSING_HEADERS[@]} -eq 0 ]; then
        success "Headers de segurança configurados"
        echo "✅ **Status:** Headers de segurança configurados no vercel.json" >> "$REPORT_FILE"
    else
        warning "Headers faltando: ${MISSING_HEADERS[*]}"
        echo "⚠️ **Status:** Headers de segurança faltando:" >> "$REPORT_FILE"
        for header in "${MISSING_HEADERS[@]}"; do
            echo "   - $header" >> "$REPORT_FILE"
        done
    fi
else
    warning "vercel.json não encontrado"
    echo "⚠️ **Status:** vercel.json não encontrado" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# 5. Verificar chaves API hardcoded
log "🔑 Procurando chaves API hardcoded..."
echo "## 🔑 Chaves API Hardcoded" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

API_PATTERNS=("service_[a-zA-Z0-9]+" "template_[a-zA-Z0-9]+" "sk-[a-zA-Z0-9]+" "pk_[a-zA-Z0-9]+")
FOUND_KEYS=false

for pattern in "${API_PATTERNS[@]}"; do
    if grep -r -E "$pattern" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.git . | grep -v "import.meta.env" | grep -q .; then
        echo "⚠️ Possível chave API encontrada: $pattern" >> "$REPORT_FILE"
        FOUND_KEYS=true
    fi
done

if [ "$FOUND_KEYS" = false ]; then
    success "Nenhuma chave API hardcoded encontrada"
    echo "✅ **Status:** Nenhuma chave API hardcoded encontrada" >> "$REPORT_FILE"
else
    warning "Possíveis chaves API hardcoded encontradas"
    echo "⚠️ **Status:** Possíveis chaves API hardcoded encontradas (verifique manualmente)" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# 6. Verificar configurações de segurança do GitHub
log "🐙 Verificando configurações do GitHub..."
echo "## 🐙 Configurações GitHub" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

GITHUB_FILES=(".github/workflows/security.yml" ".github/dependabot.yml" "SECURITY.md")
MISSING_FILES=()

for file in "${GITHUB_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    success "Configurações de segurança do GitHub presentes"
    echo "✅ **Status:** Configurações de segurança do GitHub presentes" >> "$REPORT_FILE"
else
    warning "Arquivos de configuração faltando: ${MISSING_FILES[*]}"
    echo "⚠️ **Status:** Arquivos de configuração faltando:" >> "$REPORT_FILE"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file" >> "$REPORT_FILE"
    done
fi
echo "" >> "$REPORT_FILE"

# 7. Resumo final
echo "## 📊 Resumo da Auditoria" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**Data da auditoria:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "**Duração:** Aproximadamente 30 segundos" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Contar issues
TOTAL_WARNINGS=$(grep -c "⚠️" "$REPORT_FILE" || echo "0")
TOTAL_ERRORS=$(grep -c "❌" "$REPORT_FILE" || echo "0")
TOTAL_SUCCESS=$(grep -c "✅" "$REPORT_FILE" || echo "0")

echo "### Estatísticas:" >> "$REPORT_FILE"
echo "- ✅ **Verificações aprovadas:** $TOTAL_SUCCESS" >> "$REPORT_FILE"
echo "- ⚠️ **Avisos:** $TOTAL_WARNINGS" >> "$REPORT_FILE"
echo "- ❌ **Erros:** $TOTAL_ERRORS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ "$TOTAL_ERRORS" -eq 0 ] && [ "$TOTAL_WARNINGS" -eq 0 ]; then
    echo "🎉 **Status Geral:** EXCELENTE - Nenhum problema de segurança encontrado!" >> "$REPORT_FILE"
    success "🎉 Auditoria concluída - Status: EXCELENTE"
elif [ "$TOTAL_ERRORS" -eq 0 ]; then
    echo "👍 **Status Geral:** BOM - Apenas avisos menores encontrados" >> "$REPORT_FILE"
    success "👍 Auditoria concluída - Status: BOM"
else
    echo "⚠️ **Status Geral:** ATENÇÃO NECESSÁRIA - Problemas de segurança encontrados" >> "$REPORT_FILE"
    warning "⚠️ Auditoria concluída - Status: ATENÇÃO NECESSÁRIA"
fi

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "*Relatório gerado automaticamente pelo script de auditoria de segurança*" >> "$REPORT_FILE"

success "📄 Relatório salvo em: $REPORT_FILE"
log "🔍 Auditoria de segurança concluída!"

# Mostrar resumo no terminal
echo
info "📊 RESUMO DA AUDITORIA:"
info "   ✅ Aprovadas: $TOTAL_SUCCESS"
info "   ⚠️ Avisos: $TOTAL_WARNINGS"  
info "   ❌ Erros: $TOTAL_ERRORS"
info "   📄 Relatório: $REPORT_FILE"