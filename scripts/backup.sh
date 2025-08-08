#!/bin/bash

# 🛡️ Script de Backup Automatizado para MBdaReconciliação
# Cria backups completos do repositório com versionamento

set -e  # Parar em caso de erro

# Configurações
REPO_URL="https://github.com/carlitosdj/mb-dareconciliacao.git"
BACKUP_DIR="$HOME/backups/mb-dareconciliacao"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE"
MAX_BACKUPS=30  # Manter apenas os 30 backups mais recentes

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

log "🚀 Iniciando backup do MBdaReconciliação..."
log "📁 Diretório de backup: $BACKUP_DIR"
log "📦 Nome do backup: $BACKUP_NAME"

# Navegar para o diretório de backup
cd "$BACKUP_DIR"

# Fazer clone completo do repositório
log "📥 Clonando repositório..."
if git clone --mirror "$REPO_URL" "$BACKUP_NAME.git"; then
    success "Repositório clonado com sucesso"
else
    error "Falha ao clonar repositório"
    exit 1
fi

# Criar arquivo de metadados
log "📝 Criando metadados do backup..."
cat > "$BACKUP_NAME.info" << EOF
# Backup do MBdaReconciliação
Data: $(date '+%Y-%m-%d %H:%M:%S')
Repositório: $REPO_URL
Tipo: Mirror Clone (completo)
Tamanho: $(du -sh "$BACKUP_NAME.git" | cut -f1)
Hash: $(cd "$BACKUP_NAME.git" && git rev-parse HEAD 2>/dev/null || echo "N/A")
Branch: $(cd "$BACKUP_NAME.git" && git symbolic-ref HEAD 2>/dev/null | sed 's/refs\/heads\///' || echo "N/A")
Sistema: $(uname -a)
Usuário: $(whoami)
EOF

# Comprimir backup
log "🗜️ Comprimindo backup..."
if tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME.git" "$BACKUP_NAME.info"; then
    success "Backup comprimido: $BACKUP_NAME.tar.gz"
    
    # Remover arquivos temporários
    rm -rf "$BACKUP_NAME.git" "$BACKUP_NAME.info"
else
    error "Falha ao comprimir backup"
    exit 1
fi

# Verificar integridade do backup
log "🔍 Verificando integridade..."
if tar -tzf "$BACKUP_NAME.tar.gz" > /dev/null; then
    success "Integridade do backup verificada"
else
    error "Backup corrompido!"
    exit 1
fi

# Limpar backups antigos
log "🧹 Limpando backups antigos (mantendo $MAX_BACKUPS)..."
BACKUP_COUNT=$(ls -1 backup_*.tar.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
    EXCESS=$((BACKUP_COUNT - MAX_BACKUPS))
    ls -1t backup_*.tar.gz | tail -n "$EXCESS" | xargs rm -f
    warning "Removidos $EXCESS backups antigos"
fi

# Estatísticas finais
BACKUP_SIZE=$(du -sh "$BACKUP_NAME.tar.gz" | cut -f1)
TOTAL_SIZE=$(du -sh . | cut -f1)
BACKUP_COUNT=$(ls -1 backup_*.tar.gz 2>/dev/null | wc -l)

success "✅ Backup concluído com sucesso!"
log "📊 Estatísticas:"
log "   • Tamanho do backup: $BACKUP_SIZE"
log "   • Total de backups: $BACKUP_COUNT"
log "   • Espaço total usado: $TOTAL_SIZE"
log "   • Localização: $BACKUP_DIR/$BACKUP_NAME.tar.gz"

# Opcional: Enviar notificação (descomente se quiser)
# echo "Backup do MBdaReconciliação concluído: $BACKUP_NAME.tar.gz ($BACKUP_SIZE)" | mail -s "Backup Concluído" seu-email@dominio.com

log "🎉 Processo de backup finalizado!"