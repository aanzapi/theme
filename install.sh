#!/bin/bash

# =============================================
# AZX PANEL DEPLOYER - Install Script
# =============================================
# Fungsi: Setup awal untuk AZX Panel Deployer
# Author: AZX Team
# Version: 2.0.0
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
    echo -e "${PURPLE}=====================================${NC}"
    echo -e "${WHITE}Version: $(cat version 2>/dev/null || echo '2.0.0')${NC}"
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

check_and_install_nodejs() {
    show_info "Memeriksa Node.js..."
    
    # Cek apakah Node.js terinstall
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | sed 's/v//')
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
        
        if [ "$NODE_MAJOR" -ge 22 ]; then
            show_success "Node.js v$NODE_VERSION sudah terinstall (>= v22)"
            return 0
        else
            show_info "Node.js v$NODE_VERSION terinstall (lebih rendah dari v22)"
            show_info "Meng-upgrade ke Node.js v22..."
        fi
    else
        show_info "Node.js tidak ditemukan, akan menginstall..."
    fi
    
    # Install Node.js v22
    show_progress "Menginstall Node.js v22"
    
    # Download dan run setup script
    echo -e "${YELLOW}Menambahkan repository NodeSource...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - || {
        show_error "Gagal menambahkan repository NodeSource"
    }
    
    # Install Node.js
    echo -e "${YELLOW}Menginstall Node.js...${NC}"
    apt-get install -y nodejs || {
        show_error "Gagal menginstall Node.js"
    }
    
    # Verifikasi instalasi
    if command -v node &> /dev/null; then
        NEW_VERSION=$(node --version)
        show_success "Node.js $NEW_VERSION berhasil diinstall"
    else
        show_error "Gagal verifikasi instalasi Node.js"
    fi
}

check_and_install_yarn() {
    show_info "Memeriksa Yarn..."
    
    # Cek apakah Yarn terinstall
    if command -v yarn &> /dev/null; then
        YARN_VERSION=$(yarn --version)
        show_success "Yarn v$YARN_VERSION sudah terinstall"
        return 0
    fi
    
    # Install Yarn
    show_progress "Menginstall Yarn"
    
    # Install Yarn melalui npm (setelah Node.js terinstall)
    if command -v npm &> /dev/null; then
        echo -e "${YELLOW}Menginstall Yarn melalui npm...${NC}"
        npm install -g yarn || {
            # Jika npm gagal, coba install melalui apt
            echo -e "${YELLOW}Mencoba install Yarn melalui apt...${NC}"
            curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null
            echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
            apt-get update && apt-get install -y yarn || {
                show_error "Gagal menginstall Yarn"
            }
        }
    else
        # Install melalui apt jika npm tidak ada
        echo -e "${YELLOW}Menginstall Yarn melalui apt...${NC}"
        curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null
        echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
        apt-get update && apt-get install -y yarn || {
            show_error "Gagal menginstall Yarn"
        }
    fi
    
    # Verifikasi instalasi
    if command -v yarn &> /dev/null; then
        YARN_VERSION=$(yarn --version)
        show_success "Yarn v$YARN_VERSION berhasil diinstall"
    else
        show_error "Gagal verifikasi instalasi Yarn"
    fi
}

# =============================================
# MAIN SCRIPT
# =============================================

show_banner

# Cek apakah dijalankan sebagai root
if [ "$EUID" -ne 0 ]; then 
    show_error "Script ini harus dijalankan sebagai root (sudo)"
fi

# Update package list
show_progress "Mengupdate package list"
apt-get update || {
    show_error "Gagal update package list"
}
show_success "Package list berhasil diupdate"

# Install tools dasar
show_progress "Menginstall tools dasar"
for tool in git curl wget tar gzip unzip; do
    if ! command -v $tool &> /dev/null; then
        echo -e "${YELLOW}Menginstall $tool...${NC}"
        apt-get install -y $tool || {
            show_error "Gagal menginstall $tool"
        }
    fi
done
show_success "Semua tools dasar tersedia"

# Install dan cek Node.js v22
check_and_install_nodejs

# Install dan cek Yarn
check_and_install_yarn

# Tampilkan versi
echo -e "\n${WHITE}Versi Tools Terinstall:${NC}"
echo -e "${BLUE}Node.js: $(node --version 2>/dev/null || echo 'Tidak terdeteksi')${NC}"
echo -e "${BLUE}NPM: $(npm --version 2>/dev/null || echo 'Tidak terdeteksi')${NC}"
echo -e "${BLUE}Yarn: $(yarn --version 2>/dev/null || echo 'Tidak terdeteksi')${NC}"
echo -e "${BLUE}Git: $(git --version 2>/dev/null | awk '{print $3}' || echo 'Tidak terdeteksi')${NC}"

# Cek lokasi panel
show_info "Mendeteksi lokasi panel Pterodactyl..."
if [ ! -d "$PANEL_DIR" ]; then
    show_error "Panel tidak ditemukan di $PANEL_DIR"
fi
show_success "Panel ditemukan di $PANEL_DIR"

# Cek PHP dan extensions
show_info "Memeriksa PHP dan extensions..."
PHP_VERSION=$(php -v 2>/dev/null | head -1 | awk '{print $2}')
show_success "PHP Version: $PHP_VERSION"

PHP_EXTENSIONS="bcmath ctype curl dom fileinfo gd json mbstring openssl pdo_mysql tokenizer xml"
for ext in $PHP_EXTENSIONS; do
    if php -m 2>/dev/null | grep -qi $ext; then
        show_success "PHP extension $ext: OK"
    else
        show_info "PHP extension $ext: Tidak ditemukan (opsional)"
    fi
done

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
for script in deploy.sh rollback.sh update.sh install.sh unzip.sh; do
    if [ -f "$script" ]; then
        chmod +x "$script" || show_error "Gagal memberikan executable permission untuk $script"
        show_success "$script -> executable"
    fi
done

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

# Install dependencies panel jika ada package.json
if [ -f "$PANEL_DIR/package.json" ]; then
    show_info "Mendeteksi package.json, menginstall dependencies..."
    cd "$PANEL_DIR"
    
    if command -v yarn &> /dev/null; then
        yarn install --production=false --non-interactive 2>/dev/null || {
            show_info "Yarn install gagal, mencoba npm..."
            npm install --production=false 2>/dev/null || {
                show_info "Gagal install dependencies (akan diinstall saat deploy)"
            }
        }
        show_success "Dependencies panel berhasil diinstall"
    fi
fi

# Selesai
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}   INSTALLATION FINISHED SUCCESSFULLY${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${BLUE}📁 Panel: $PANEL_DIR${NC}"
echo -e "${BLUE}📦 Backup: $BACKUP_DIR${NC}"
echo -e "${BLUE}🟢 Node.js: $(node --version)${NC}"
echo -e "${BLUE}🟢 Yarn: $(yarn --version)${NC}"
echo -e "${PURPLE}🚀 Sekarang jalankan: bash deploy.sh${NC}\n"
