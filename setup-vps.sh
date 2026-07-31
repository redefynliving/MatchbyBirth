#!/usr/bin/env bash
# setup-vps.sh — Provision script for Oracle ARM Always Free VPS
# Run as root on a fresh Ubuntu 24.04 A1 instance:
#   scp setup-vps.sh ubuntu@<VPS_IP>:/tmp/ && ssh ubuntu@<VPS_IP> 'sudo bash /tmp/setup-vps.sh <YOUR_PUBKEY> <QWEN_API_KEY>'
set -euo pipefail

PUBKEY="${1:?Usage: setup-vps.sh <ssh_pubkey> <qwen_api_key>}"
QWEN_KEY="${2:?Usage: setup-vps.sh <ssh_pubkey> <qwen_api_key>}"
DEPLOY_USER="deploy"

echo "[1/8] System update"
apt-get update -y && apt-get upgrade -y

echo "[2/8] Create deploy user + SSH key"
id -u "$DEPLOY_USER" &>/dev/null || useradd -m -s /bin/bash "$DEPLOY_USER"
mkdir -p /home/$DEPLOY_USER/.ssh
echo "$PUBKEY" >> /home/$DEPLOY_USER/.ssh/authorized_keys
chmod 700 /home/$DEPLOY_USER/.ssh
chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$DEPLOY_USER
usermod -aG sudo $DEPLOY_USER

echo "[3/8] Harden SSH"
sed -i 's/^#\?PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart sshd

echo "[4/8] Firewall + fail2ban"
apt-get install -y ufw fail2ban
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80,443/tcp
ufw --force enable

echo "[5/8] Install Node 20 + tooling"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git postgresql postgresql-contrib
npm install -g @qwen-code/qwen-code

echo "[6/8] Postgres ready (local dev DB, peer auth)"
systemctl enable --now postgresql
sudo -u postgres psql -c "CREATE USER deploy WITH PASSWORD 'devlocal' CREATEDB;" 2>/dev/null || true

echo "[7/8] Qwen Code config for deploy user"
sudo -u $DEPLOY_USER bash -c "mkdir -p /home/$DEPLOY_USER/.config/qwen-code"
cat > /home/$DEPLOY_USER/.config/qwen-code/config.json <<EOF
{
  "model": "qwen3-coder",
  "apiKey": "$QWEN_KEY",
  "baseUrl": "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
}
EOF
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.config

echo "[8/8] Keep-alive cron (defeats Oracle 7-day idle reclamation)"
cat > /etc/cron.d/keepalive <<EOF
*/5 * * * * $DEPLOY_USER curl -s -o /dev/null https://api.ipify.org >/dev/null 2>&1 || true
*/5 * * * * $DEPLOY_USER touch /home/$DEPLOY_USER/.keepalive && echo \$RANDOM >> /home/$DEPLOY_USER/.keepalive
EOF

echo "DONE. SSH as: ssh $DEPLOY_USER@<VPS_IP>"
echo "Test Qwen Code: ssh $DEPLOY_USER@<VPS_IP> 'qwen-code -p \"say OK\"'"
