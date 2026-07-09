# AZX Panel Deployer 🚀

> Simple, fast, and safe deployment tool for updating the **UI/Resources** of **Pterodactyl Panel** without touching the core system.

---

## ✨ Features

- 🔄 Automatic backup before every deployment
- 🎨 Deploy only the `resources/` directory
- ♻️ One-click rollback
- 📊 Progress indicator for every step
- 🔍 Automatic PHP-FPM detection
- 🎨 Colored terminal output
- 🛡️ Safe error handling
- ⚡ Automatic asset build
- 🧹 Laravel cache cleanup
- 🌐 GitHub-based deployment

## Requirements

- Ubuntu 22.04 / Debian 12
- Pterodactyl Panel v1.x
- Nginx
- PHP-FPM (8.1 / 8.2 / 8.3)
- NodeJS
- Yarn
- Git

## Repository Structure

```text
azx-panel-deployer/
├── deploy.sh
├── rollback.sh
├── install.sh
├── update.sh
├── README.md
├── version
└── resources/
    ├── scripts/
    ├── views/
    └── lang/
```

## Installation

```bash
git clone https://github.com/<YOUR_USERNAME>/azx-panel-deployer.git
cd azx-panel-deployer
sudo bash install.sh
```

## Usage

### Deploy

```bash
sudo bash deploy.sh
```

Flow:
1. Verify panel
2. Backup resources
3. Download latest resources
4. Replace resources
5. Install dependencies
6. Build assets
7. Clear cache
8. Restart services

### Rollback

```bash
sudo bash rollback.sh
```

### Update

```bash
sudo bash update.sh
```

## Configuration

```bash
GITHUB_USER="your-github"
REPOSITORY="azx-panel-deployer"
BRANCH="main"
PANEL_DIR="/var/www/pterodactyl"
```

## License

MIT License

## Credits

Developed by **AanX**
Project: **AZX Panel Deployer**
