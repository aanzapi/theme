#!/bin/bash

# =============================================
# AZX PANEL DEPLOYER - Update Script
# =============================================
# Fungsi: Mengupdate script deployer dari GitHub
# Author: AZX Team
# Version: 1.0.0
# =============================================

set -e
trap 'echo -e "\n❌ ERROR: Update gagal!"; exit 1' ERR

# =============================================
# KONFIGURASI
# =============================================

GITHUB_USER="azx-team"
REPOSITORY="azx-panel-deployer"
BRANCH="main"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP_DIR="/tmp/azx-update-$$"

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
    echo -e "${CYAN}        AZX PANEL UPDATER${NC}"
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

# Cek koneksi internet
show_info "Memeriksa koneksi internet..."
if ! ping -c 1 github.com &> /dev/null; then
    show_error "Tidak dapat terhubung ke GitHub. Cek koneksi internet."
fi
show_success "Koneksi internet OK"

# Download repository terbaru
show_info "Mengunduh repository terbaru..."
git clone --depth 1 --branch $BRANCH "https://github.com/$GITHUB_USER/$REPOSITORY.git" "$TEMP_DIR" 2>/dev/null || {
    show_error "Gagal clone repository. Cek repository URL."
}
show_success "Repository berhasil diunduh"

# Backup script saat ini
show_info "Membackup script lama..."
BACKUP_DIR="$SCRIPT_DIR/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "$SCRIPT_DIR"/*.sh "$BACKUP_DIR"/ 2>/dev/null || true
show_success "Backup script disimpan di $BACKUP_DIR"

# Update script
show_info "Mengupdate script..."
cd "$TEMP_DIR"

# Copy semua file script
for file in deploy.sh rollback.sh install.sh update.sh README.md version; do
    if [ -f "$file" ]; then
        cp "$file" "$SCRIPT_DIR/" 2>/dev/null || {
            show_error "Gagal menyalin $file"
        }
        chmod +x "$SCRIPT_DIR/$file" 2>/dev/null || true
        show_success "$file berhasil diupdate"
    fi
done

# Cleanup
rm -rf "$TEMP_DIR"

# Selesai
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}   UPDATE FINISHED SUCCESSFULLY${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${BLUE}📦 Backup script: $BACKUP_DIR${NC}"
echo -e "${PURPLE}🔄 Script deployer telah diupdate!${NC}\n"
