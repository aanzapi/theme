#!/bin/bash

# =============================================
# AZX PANEL DEPLOYER - Deploy Script
# =============================================
# Fungsi: Mengupdate UI Pterodactyl Panel
# Author: AZX Team
# Version: 1.0.0
# =============================================

set -e  # Exit on error
trap 'echo -e "\n❌ ERROR: Deployment gagal! Silakan periksa log."; exit 1' ERR

# =============================================
# KONFIGURASI
# =============================================

# Repository GitHub (ubah sesuai kebutuhan)
GITHUB_USER="aanzapi"
REPOSITORY="theme"
BRANCH="main"

# Lokasi Panel Pterodactyl
PANEL_DIR="/var/www/pterodactyl"

# Warna Terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# =============================================
# FUNGSI
# =============================================

# Fungsi untuk menampilkan banner
show_banner() {
    clear
    echo -e "${PURPLE}=====================================${NC}"
    echo -e "${CYAN}        AZX PANEL DEPLOYER${NC}"
    echo -e "${PURPLE}=====================================${NC}"
    echo -e "${WHITE}Version: $(cat version 2>/dev/null || echo '1.0.0')${NC}"
    echo -e "${PURPLE}=====================================${NC}\n"
}

# Fungsi untuk menampilkan progress
show_progress() {
    echo -e "${YELLOW}⏳ $1...${NC}"
    echo -ne "${CYAN}"
    for i in {1..20}; do
        echo -n "█"
        sleep 0.1
    done
    echo -e " ${GREEN}Done!${NC}\n"
}

# Fungsi untuk menampilkan pesan sukses
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fungsi untuk menampilkan pesan error
show_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Fungsi untuk menampilkan pesan info
show_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Fungsi untuk mengecek command
check_command() {
    if ! command -v $1 &> /dev/null; then
        show_error "$1 tidak ditemukan. Mohon install terlebih dahulu."
    fi
}

# Fungsi untuk mendeteksi PHP-FPM service
detect_php_service() {
    PHP_SERVICE=""
    for version in 8.3 8.2 8.1; do
        if systemctl is-active --quiet php$version-fpm 2>/dev/null; then
            PHP_SERVICE="php$version-fpm"
            break
        fi
    done
    
    if [ -z "$PHP_SERVICE" ]; then
        show_error "Tidak dapat mendeteksi PHP-FPM service yang aktif"
    fi
    show_info "Mendeteksi PHP-FPM: $PHP_SERVICE"
}

# =============================================
# MAIN SCRIPT
# =============================================

# Step 1: Tampilkan banner
show_banner

# Step 2: Deteksi lokasi panel
show_info "Mendeteksi lokasi panel Pterodactyl..."
if [ ! -d "$PANEL_DIR" ]; then
    show_error "Panel tidak ditemukan di $PANEL_DIR"
fi
show_success "Panel ditemukan di $PANEL_DIR"

# Step 3: Backup resources
show_progress "Backing Up"
BACKUP_DIR="$PANEL_DIR/backup"
mkdir -p "$BACKUP_DIR"
BACKUP_NAME="resources-$(date +%Y%m%d-%H%M%S).tar.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

if [ -d "$PANEL_DIR/resources" ]; then
    show_info "Membuat backup: $BACKUP_NAME"
    tar -czf "$BACKUP_PATH" -C "$PANEL_DIR" resources/ 2>/dev/null || {
        show_error "Gagal membuat backup"
    }
    show_success "Backup berhasil dibuat: $BACKUP_NAME"
else
    show_error "Folder resources tidak ditemukan di $PANEL_DIR"
fi

# Step 4: Hapus folder resources tertentu
show_progress "Menghapus resources lama"
cd "$PANEL_DIR"
rm -rf resources/scripts 2>/dev/null || true
rm -rf resources/views 2>/dev/null || true
rm -rf resources/lang 2>/dev/null || true
show_success "Folder lama berhasil dihapus"

# Step 5: Download repository
show_progress "Downloading repository"
TEMP_DIR="/tmp/azx-deploy-$$"
git clone --depth 1 --branch $BRANCH "https://github.com/$GITHUB_USER/$REPOSITORY.git" "$TEMP_DIR" 2>/dev/null || {
    show_error "Gagal clone repository. Cek koneksi internet atau repository."
}
show_success "Repository berhasil di-download"

# Step 6: Copy resources
show_progress "Copying resources"
if [ -d "$TEMP_DIR/resources" ]; then
    cp -r "$TEMP_DIR/resources"/* "$PANEL_DIR/resources/" 2>/dev/null || {
        show_error "Gagal menyalin resources"
    }
    show_success "Resources berhasil disalin"
else
    show_error "Folder resources tidak ditemukan di repository"
fi

# Cleanup temp
rm -rf "$TEMP_DIR"

# Step 7: Masuk ke folder panel
cd "$PANEL_DIR"

# Step 8: Install dependencies
show_progress "Installing dependencies"
if command -v yarn &> /dev/null; then
    yarn install --production=false --non-interactive 2>/dev/null || {
        show_error "Gagal install dependency menggunakan yarn"
    }
elif command -v npm &> /dev/null; then
    npm install --production=false 2>/dev/null || {
        show_error "Gagal install dependency menggunakan npm"
    }
else
    show_error "Yarn atau npm tidak ditemukan"
fi
show_success "Dependencies berhasil diinstall"

# Step 9: Build assets
show_progress "Building assets"
if command -v yarn &> /dev/null; then
    if yarn build:production 2>/dev/null; then
        show_success "Build berhasil (yarn build:production)"
    elif yarn build 2>/dev/null; then
        show_success "Build berhasil (yarn build)"
    else
        show_error "Gagal build menggunakan yarn"
    fi
elif command -v npm &> /dev/null; then
    if npm run build 2>/dev/null; then
        show_success "Build berhasil (npm run build)"
    else
        show_error "Gagal build menggunakan npm"
    fi
else
    show_error "Tidak ada package manager yang ditemukan"
fi

# Step 10: Clear cache
show_progress "Clearing cache"
php artisan optimize:clear 2>/dev/null || {
    show_error "Gagal clear cache Laravel"
}
show_success "Cache berhasil dibersihkan"

# Step 11: Restart services
show_progress "Restarting services"
detect_php_service

# Restart Nginx
if systemctl restart nginx 2>/dev/null; then
    show_success "Nginx berhasil direstart"
else
    show_error "Gagal restart Nginx"
fi

# Restart PHP-FPM
if systemctl restart $PHP_SERVICE 2>/dev/null; then
    show_success "$PHP_SERVICE berhasil direstart"
else
    show_error "Gagal restart $PHP_SERVICE"
fi

# Step 12: Selesai
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}   DEPLOYMENT FINISHED SUCCESSFULLY${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${BLUE}📦 Backup: $BACKUP_PATH${NC}"
echo -e "${PURPLE}🚀 Panel telah diupdate!${NC}\n"
