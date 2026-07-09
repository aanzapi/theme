#!/bin/bash

# =============================================
# AZX PANEL DEPLOYER - Install Script
# =============================================
# Fungsi: Setup awal untuk AZX Panel Deployer
# Author: AZX Team
# Version: 1.0.0
# =============================================

set -e
trap 'echo -e "\n❌ ERROR: Installasi gagal!"; exit 1' ERR

# =============================================
# KONFIGURASI
# =============================================

PANEL_DIR="/var/www/pterodactyl"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
    echo -e "${CYAN}        AZX PANEL INSTALLER${NC}"
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

# =============================================
# MAIN SCRIPT
# =============================================

show_banner

# Cek apakah dijalankan sebagai root
if [ "$EUID" -ne 0 ]; then 
    show_error "Script ini harus dijalankan sebagai root (sudo)"
fi

# Cek lokasi panel
show_info "Mendeteksi lokasi panel Pterodactyl..."
if [ ! -d "$PANEL_DIR" ]; then
    show_error "Panel tidak ditemukan di $PANEL_DIR"
fi
show_success "Panel ditemukan di $PANEL_DIR"

# Cek tools yang dibutuhkan
show_info "Memeriksa tools yang dibutuhkan..."
for tool in git curl wget tar gzip php; do
    if ! command -v $tool &> /dev/null; then
        show_error "$tool tidak ditemukan. Mohon install terlebih dahulu."
    fi
done
show_success "Semua tools tersedia"

# Membuat folder backup
show_info "Membuat folder backup..."
BACKUP_DIR="$PANEL_DIR/backup"
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR" || show_error "Gagal membuat folder backup"
    chown -R www-data:www-data "$BACKUP_DIR" || show_error "Gagal mengatur permission"
    chmod 755 "$BACKUP_DIR" || show_error "Gagal mengatur permission"
    show_success "Folder backup berhasil dibuat"
else
    show_info "Folder backup sudah ada"
fi

# Setting permission untuk semua script
show_info "Mengatur permission script..."
cd "$SCRIPT_DIR"
for script in deploy.sh rollback.sh update.sh install.sh; do
    if [ -f "$script" ]; then
        chmod +x "$script" || show_error "Gagal memberikan executable permission untuk $script"
        show_success "$script -> executable"
    fi
done

# Cek dan install dependencies jika diperlukan
show_info "Memeriksa dependencies panel..."

# Cek PHP extensions yang dibutuhkan
PHP_EXTENSIONS="bcmath ctype curl dom fileinfo gd json mbstring openssl pdo_mysql tokenizer xml"
for ext in $PHP_EXTENSIONS; do
    if php -m | grep -qi $ext; then
        show_success "PHP extension $ext: OK"
    else
        show_info "PHP extension $ext: Tidak ditemukan (opsional)"
    fi
done

# Cek NodeJS dan Yarn
show_info "Memeriksa NodeJS dan Yarn..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    show_success "NodeJS ditemukan: $NODE_VERSION"
else
    show_error "NodeJS tidak ditemukan. Install dengan: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
fi

if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    show_success "Yarn ditemukan: $YARN_VERSION"
else
    show_info "Yarn tidak ditemukan. Install dengan: npm install -g yarn"
fi

# Verifikasi struktur panel
show_info "Memverifikasi struktur panel..."
REQUIRED_DIRS="resources config public bootstrap storage"
for dir in $REQUIRED_DIRS; do
    if [ -d "$PANEL_DIR/$dir" ]; then
        show_success "Folder $dir: OK"
    else
        show_error "Folder $dir tidak ditemukan di panel"
    fi
done

# Selesai
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}   INSTALLATION FINISHED SUCCESSFULLY${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${BLUE}📁 Panel: $PANEL_DIR${NC}"
echo -e "${BLUE}📦 Backup: $BACKUP_DIR${NC}"
echo -e "${PURPLE}🚀 Sekarang jalankan: bash deploy.sh${NC}\n"
