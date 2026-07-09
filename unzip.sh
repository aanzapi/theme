#!/bin/bash

# =============================================
# AZX PANEL DEPLOYER - Unzip Repository Script
# =============================================
# Fungsi: Ekstrak resources.zip menjadi folder resources/
# Lokasi: Di dalam repository GitHub
# Author: AZX Team
# Version: 1.0.0
# =============================================

set -e  # Exit on error
trap 'echo -e "\n❌ ERROR: Proses gagal!"; exit 1' ERR

# =============================================
# KONFIGURASI
# =============================================

# GitHub Configuration
GITHUB_USER="aanzapi"
REPOSITORY="theme"
BRANCH="main"  # atau "master"

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
    echo -e "${CYAN}        AZX REPO UNZIPPER${NC}"
    echo -e "${PURPLE}=====================================${NC}"
    echo -e "${WHITE}Repository: $GITHUB_USER/$REPOSITORY${NC}"
    echo -e "${WHITE}Branch: $BRANCH${NC}"
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

show_progress() {
    echo -e "${YELLOW}⏳ $1...${NC}"
    echo -ne "${CYAN}"
    for i in {1..20}; do
        echo -n "█"
        sleep 0.05
    done
    echo -e " ${GREEN}Done!${NC}\n"
}

# =============================================
# MAIN SCRIPT
# =============================================

show_banner

# Cek apakah dijalankan di root repository
show_info "Memeriksa lokasi script..."
if [ ! -f "README.md" ] && [ ! -d ".git" ]; then
    show_error "Script harus dijalankan di root directory repository!"
fi
show_success "Directory repository terdeteksi"

# Cek tools yang dibutuhkan
show_info "Memeriksa tools yang dibutuhkan..."
for tool in unzip zip curl git; do
    if ! command -v $tool &> /dev/null; then
        show_error "$tool tidak ditemukan. Install dengan: apt-get install $tool -y"
    fi
done
show_success "Semua tools tersedia"

# Minta GitHub Token
echo -e "${YELLOW}Masukkan GitHub Personal Access Token (PAT):${NC}"
echo -e "${BLUE}(Token akan disembunyikan saat mengetik)${NC}"
read -s GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    show_error "Token tidak boleh kosong!"
fi

# Validasi token
show_info "Memvalidasi token GitHub..."
if ! curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/user" | grep -q "login"; then
    show_error "Token GitHub tidak valid atau expired!"
fi
show_success "Token GitHub valid"

# Download resources.zip dari GitHub menggunakan token
show_info "Mengunduh resources.zip dari GitHub..."
DOWNLOAD_URL="https://raw.githubusercontent.com/$GITHUB_USER/$REPOSITORY/$BRANCH/resources.zip"

# Download dengan token
if curl -L -H "Authorization: token $GITHUB_TOKEN" -o resources.zip "$DOWNLOAD_URL" 2>/dev/null; then
    if [ -f "resources.zip" ] && [ -s "resources.zip" ]; then
        show_success "resources.zip berhasil didownload"
    else
        show_error "File resources.zip kosong atau tidak ditemukan!"
    fi
else
    show_error "Gagal mendownload resources.zip.\nCek:\n- URL: $DOWNLOAD_URL\n- Branch: $BRANCH\n- File resources.zip ada di repository\n- Token memiliki akses ke repository"
fi

# Cek apakah file zip valid
show_info "Memeriksa integritas resources.zip..."
if ! unzip -t resources.zip >/dev/null 2>&1; then
    show_error "File resources.zip corrupt atau tidak valid!"
fi
show_success "File zip valid"

# Cek apakah folder resources sudah ada
if [ -d "resources" ]; then
    show_info "Folder resources sudah ada, akan dihapus..."
    read -p "Lanjutkan? (y/n): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Dibatalkan."
        rm -f resources.zip
        exit 0
    fi
    rm -rf resources
    show_success "Folder resources lama dihapus"
fi

# Backup jika diperlukan
show_progress "Membuat backup resources.zip"
BACKUP_NAME="resources.backup.$(date +%Y%m%d-%H%M%S).zip"
cp resources.zip "$BACKUP_NAME"
show_success "Backup dibuat: $BACKUP_NAME"

# Ekstrak resources.zip
show_progress "Mengekstrak resources.zip"
unzip -q resources.zip -d ./ 2>/dev/null || {
    show_error "Gagal mengekstrak resources.zip"
}
show_success "resources.zip berhasil diekstrak"

# Cek apakah folder resources berhasil diekstrak
if [ ! -d "resources" ]; then
    show_error "Folder resources tidak ditemukan setelah ekstraksi!"
fi

# Tampilkan struktur folder
show_info "Struktur folder resources:"
ls -la resources/ | head -20

# Hitung jumlah file
FILE_COUNT=$(find resources -type f | wc -l)
DIR_COUNT=$(find resources -type d | wc -l)
show_success "Total: $FILE_COUNT files, $DIR_COUNT directories"

# Verifikasi folder penting
show_progress "Memverifikasi struktur folder"
REQUIRED_FOLDERS="scripts views lang"
for folder in $REQUIRED_FOLDERS; do
    if [ -d "resources/$folder" ]; then
        show_success "resources/$folder: OK"
    else
        show_info "resources/$folder: Tidak ditemukan (opsional)"
    fi
done

# Tanya apakah mau hapus zip
echo -e "\n${YELLOW}Hapus resources.zip? (y/n):${NC}"
read -p "> " delete_zip
if [[ "$delete_zip" =~ ^[Yy]$ ]]; then
    rm resources.zip
    show_success "resources.zip dihapus"
else
    show_info "resources.zip disimpan"
fi

# Tanya apakah mau commit ke git
echo -e "\n${YELLOW}Commit perubahan ke Git? (y/n):${NC}"
read -p "> " commit_git

if [[ "$commit_git" =~ ^[Yy]$ ]]; then
    show_progress "Menambahkan ke Git"
    git add resources/
    git status --short
    
    echo -e "\n${YELLOW}Masukkan pesan commit:${NC}"
    read -p "> " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Extract resources folder from zip"
    fi
    
    git commit -m "$commit_message"
    show_success "Commit berhasil: $commit_message"
    
    echo -e "\n${YELLOW}Push ke GitHub? (y/n):${NC}"
    read -p "> " push_git
    
    if [[ "$push_git" =~ ^[Yy]$ ]]; then
        # Push dengan menggunakan token untuk auth
        REMOTE_URL=$(git remote get-url origin)
        if [[ $REMOTE_URL == https://* ]]; then
            # Ubah URL untuk include token
            REMOTE_URL_WITH_TOKEN=$(echo $REMOTE_URL | sed "s|https://|https://$GITHUB_TOKEN@|")
            git push $REMOTE_URL_WITH_TOKEN $BRANCH 2>/dev/null || {
                show_error "Gagal push ke GitHub. Cek branch dan koneksi."
            }
        else
            # Jika menggunakan SSH
            git push origin $BRANCH 2>/dev/null || {
                show_error "Gagal push ke GitHub"
            }
        fi
        show_success "Push ke GitHub berhasil!"
    else
        show_info "Perubahan belum di-push. Jalankan: git push"
    fi
else
    show_info "Perubahan belum di-commit. Jalankan: git add resources/ && git commit -m 'message'"
fi

# Selesai
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}   UNZIP FINISHED SUCCESSFULLY${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${BLUE}📁 Folder: $(pwd)/resources/${NC}"
echo -e "${BLUE}📦 Total Files: $FILE_COUNT${NC}"
echo -e "${BLUE}📦 Backup: $BACKUP_NAME${NC}"
echo -e "${PURPLE}🚀 Repository siap digunakan!${NC}\n"
