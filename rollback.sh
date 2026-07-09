#!/bin/bash

# =============================================
# AZX PANEL DEPLOYER - Rollback Script
# =============================================
# Fungsi: Mengembalikan resources dari backup
# Author: AZX Team
# Version: 1.0.0
# =============================================

set -e  # Exit on error
trap 'echo -e "\n❌ ERROR: Rollback gagal!"; exit 1' ERR

# =============================================
# KONFIGURASI
# =============================================

PANEL_DIR="/var/www/pterodactyl"
BACKUP_DIR="$PANEL_DIR/backup"

# Warna Terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

# =============================================
# FUNGSI
# =============================================

show_banner() {
    clear
    echo -e "${PURPLE}=====================================${NC}"
    echo -e "${CYAN}        AZX PANEL ROLLBACK${NC}"
    echo -e "${PURPLE}=====================================${NC}\n"
}

show_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

detect_php_service() {
    PHP_SERVICE=""
    for version in 8.3 8.2 8.1; do
        if systemctl is-active --quiet php$version-fpm 2>/dev/null; then
            PHP_SERVICE="php$version-fpm"
            break
        fi
    done
    
    if [ -z "$PHP_SERVICE" ]; then
        show_error "Tidak dapat mendeteksi PHP-FPM service"
    fi
    show_info "Mendeteksi PHP-FPM: $PHP_SERVICE"
}

# =============================================
# MAIN SCRIPT
# =============================================

show_banner

# Cek backup folder
if [ ! -d "$BACKUP_DIR" ]; then
    show_error "Folder backup tidak ditemukan di $BACKUP_DIR"
fi

# Daftar backup
BACKUPS=($(ls -t "$BACKUP_DIR"/resources-*.tar.gz 2>/dev/null || true))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    show_error "Tidak ada backup yang tersedia"
fi

# Tampilkan daftar backup
echo -e "${WHITE}Daftar Backup:${NC}\n"
for i in "${!BACKUPS[@]}"; do
    echo -e "${CYAN}$((i+1)).${NC} $(basename ${BACKUPS[$i]})"
done

echo -e "\n${YELLOW}Pilih nomor backup yang ingin dikembalikan:${NC}"
read -p "Masukkan nomor: " choice

# Validasi input
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#BACKUPS[@]} ]; then
    show_error "Pilihan tidak valid"
fi

SELECTED_BACKUP="${BACKUPS[$((choice-1))]}"
BACKUP_NAME=$(basename "$SELECTED_BACKUP")

echo -e "\n${YELLOW}Mengembalikan backup: $BACKUP_NAME${NC}\n"

# Konfirmasi
read -p "Lanjutkan rollback? (y/n): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Rollback dibatalkan."
    exit 0
fi

# Hapus resources sekarang
show_info "Menghapus resources saat ini..."
if [ -d "$PANEL_DIR/resources" ]; then
    rm -rf "$PANEL_DIR/resources"/* 2>/dev/null || {
        show_error "Gagal menghapus resources saat ini"
    }
fi
show_success "Resources saat ini dihapus"

# Restore backup
show_info "Mengembalikan backup..."
cd "$PANEL_DIR"
tar -xzf "$SELECTED_BACKUP" 2>/dev/null || {
    show_error "Gagal mengembalikan backup"
}
show_success "Backup berhasil dikembalikan"

# Clear cache
show_info "Clearing cache..."
cd "$PANEL_DIR"
php artisan optimize:clear 2>/dev/null || {
    show_error "Gagal clear cache"
}
show_success "Cache berhasil dibersihkan"

# Restart services
show_info "Restarting services..."
detect_php_service

if systemctl restart nginx 2>/dev/null; then
    show_success "Nginx berhasil direstart"
else
    show_error "Gagal restart Nginx"
fi

if systemctl restart $PHP_SERVICE 2>/dev/null; then
    show_success "$PHP_SERVICE berhasil direstart"
else
    show_error "Gagal restart $PHP_SERVICE"
fi

# Selesai
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}   ROLLBACK FINISHED SUCCESSFULLY${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${BLUE}📦 Dikembalikan dari: $BACKUP_NAME${NC}"
echo -e "${PURPLE}🔄 Panel telah dikembalikan!${NC}\n"
