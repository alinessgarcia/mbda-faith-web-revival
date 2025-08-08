#!/bin/bash

# 🔄 Script de Restauração para MBdaReconciliação
# Restaura backups criados pelo script backup.sh

set -e  # Parar em caso de erro

# Configurações
BACKUP_DIR="$HOME/backups/mb-dareconciliacao"
RESTORE_DIR="$HOME/restored/mb-dareconciliacao"

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

# Função para listar backups disponíveis
list_backups() {
    log "📋 Backups disponíveis:"
    if [ ! -d "$BACKUP_DIR" ]; then
        error "Diretório de backup não encontrado: $BACKUP_DIR"
        exit 1
    fi
    
    cd "$BACKUP_DIR"
    if ls backup_*.tar.gz 1> /dev/null 2>&1; then
        ls -lht backup_*.tar.gz | awk '{print NR ". " $9 " (" $5 ", " $6 " " $7 " " $8 ")"}'
    else
        error "Nenhum backup encontrado em $BACKUP_DIR"
        exit 1
    fi
}

# Função para restaurar backup específico
restore_backup() {
    local backup_file="$1"
    local restore_name="restored_$(date +%Y%m%d_%H%M%S)"
    
    log "🔄 Iniciando restauração..."
    log "📦 Backup: $backup_file"
    log "📁 Destino: $RESTORE_DIR/$restore_name"
    
    # Criar diretório de restauração
    mkdir -p "$RESTORE_DIR/$restore_name"
    cd "$RESTORE_DIR/$restore_name"
    
    # Extrair backup
    log "📤 Extraindo backup..."
    if tar -xzf "$BACKUP_DIR/$backup_file"; then
        success "Backup extraído com sucesso"
    else
        error "Falha ao extrair backup"
        exit 1
    fi
    
    # Verificar se é um mirror clone
    if [ -d "*.git" ]; then
        MIRROR_DIR=$(ls -d *.git | head -1)
        log "🔍 Detectado mirror clone: $MIRROR_DIR"
        
        # Converter mirror para repositório normal
        log "🔄 Convertendo para repositório normal..."
        git clone "$MIRROR_DIR" "mb-dareconciliacao"
        
        if [ -d "mb-dareconciliacao" ]; then
            success "Repositório restaurado: $RESTORE_DIR/$restore_name/mb-dareconciliacao"
            
            # Mostrar informações do repositório
            cd "mb-dareconciliacao"
            log "📊 Informações do repositório restaurado:"
            log "   • Branch atual: $(git branch --show-current)"
            log "   • Último commit: $(git log -1 --format='%h - %s (%cr)')"
            log "   • Total de commits: $(git rev-list --count HEAD)"
            log "   • Branches: $(git branch -a | wc -l)"
            
            # Verificar se há mudanças não commitadas
            if [ -n "$(git status --porcelain)" ]; then
                warning "⚠️ Há mudanças não commitadas no backup"
            else
                success "✅ Repositório limpo (sem mudanças pendentes)"
            fi
        else
            error "Falha ao converter mirror clone"
            exit 1
        fi
    else
        error "Formato de backup não reconhecido"
        exit 1
    fi
    
    # Mostrar metadados se disponíveis
    if [ -f "*.info" ]; then
        INFO_FILE=$(ls *.info | head -1)
        log "📋 Metadados do backup:"
        cat "$INFO_FILE" | sed 's/^/   • /'
    fi
    
    success "🎉 Restauração concluída!"
    log "📁 Localização: $RESTORE_DIR/$restore_name/mb-dareconciliacao"
    log "💡 Para usar o repositório restaurado:"
    log "   cd $RESTORE_DIR/$restore_name/mb-dareconciliacao"
    log "   npm install"
    log "   npm run dev"
}

# Menu principal
show_menu() {
    echo
    log "🔄 Script de Restauração - MBdaReconciliação"
    echo
    list_backups
    echo
    echo "Opções:"
    echo "  1-N) Restaurar backup específico (número da lista)"
    echo "  l)   Listar backups novamente"
    echo "  q)   Sair"
    echo
}

# Loop principal
while true; do
    show_menu
    read -p "Escolha uma opção: " choice
    
    case $choice in
        [0-9]*)
            cd "$BACKUP_DIR"
            BACKUP_FILE=$(ls -t backup_*.tar.gz | sed -n "${choice}p")
            if [ -n "$BACKUP_FILE" ]; then
                restore_backup "$BACKUP_FILE"
                break
            else
                error "Backup não encontrado para a opção $choice"
            fi
            ;;
        l|L)
            continue
            ;;
        q|Q)
            log "👋 Saindo..."
            exit 0
            ;;
        *)
            error "Opção inválida: $choice"
            ;;
    esac
done