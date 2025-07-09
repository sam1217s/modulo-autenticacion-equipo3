# 🔧 Guía de Mantenimiento - Auth App

## 📋 **Información del Documento**
- **Autor**: Franklin - QA & Documentation Specialist
- **Versión**: 1.0.0
- **Fecha**: Sprint 5 - Mantenimiento y Operaciones
- **Estado**: Documentación operacional

---

## 🎯 **Visión General del Mantenimiento**

Esta guía establece los procedimientos y mejores prácticas para el mantenimiento continuo, monitoreo y optimización de Auth App en producción.

### 🔄 **Ciclo de Mantenimiento**

```
🔍 Monitoring → 📊 Analysis → 🔧 Maintenance → ✅ Verification
     ↑                                              ↓
📋 Reporting ← 📈 Optimization ← 🛠️ Updates ← 🧪 Testing
```

---

## 📊 **Monitoreo del Sistema**

### 🔍 **Métricas Clave**

#### **🎯 Application Performance**
| Métrica | Objetivo | Crítico | Acción |
|---------|----------|---------|--------|
| **Response Time** | < 200ms | > 1000ms | Investigar queries lentas |
| **Uptime** | 99.9% | < 99% | Revisar infraestructura |
| **Error Rate** | < 1% | > 5% | Análisis de logs urgente |
| **Memory Usage** | < 80% | > 95% | Restart/Scale aplicación |
| **CPU Usage** | < 70% | > 90% | Optimización/Scale |

#### **🗄️ Database Performance**
```javascript
// MongoDB Performance Monitoring
{
  "connections": "< 80% of max",
  "queryExecutionTime": "< 100ms average",
  "indexUsage": "> 95%",
  "collectionSize": "monitor growth",
  "replicationLag": "< 1 second"
}
```

### 📈 **Scripts de Monitoreo**

#### **Health Check Script**
```bash
#!/bin/bash
# health-check.sh

echo "🔍 Auth App Health Check - $(date)"
echo "=================================="

# 1. API Health
echo "📡 Checking API..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.auth-app.com/api/health)
if [ $API_STATUS -eq 200 ]; then
    echo "✅ API: OK ($API_STATUS)"
else
    echo "❌ API: FAILED ($API_STATUS)"
    # Send alert
    ./send-alert.sh "API Health Check Failed" "Status: $API_STATUS"
fi

# 2. Frontend Check
echo "🌐 Checking Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://auth-app.com)
if [ $FRONTEND_STATUS -eq 200 ]; then
    echo "✅ Frontend: OK ($FRONTEND_STATUS)"
else
    echo "❌ Frontend: FAILED ($FRONTEND_STATUS)"
fi

# 3. Database Connection
echo "🗄️ Checking Database..."
DB_STATUS=$(mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')" --quiet)
if [[ $DB_STATUS == *"ok"* ]]; then
    echo "✅ Database: Connected"
else
    echo "❌ Database: Connection Failed"
fi

# 4. SSL Certificate
echo "🔐 Checking SSL Certificate..."
SSL_EXPIRY=$(echo | openssl s_client -servername auth-app.com -connect auth-app.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
SSL_DAYS=$(( ($(date -d "$SSL_EXPIRY" +%s) - $(date +%s)) / 86400 ))
if [ $SSL_DAYS -gt 30 ]; then
    echo "✅ SSL: Valid for $SSL_DAYS days"
else
    echo "⚠️ SSL: Expires in $SSL_DAYS days - RENEW SOON"
fi

echo "=================================="
echo "Health check completed: $(date)"
```

#### **Performance Monitoring**
```bash
#!/bin/bash
# performance-monitor.sh

# System Resources
echo "📊 System Performance Report"
echo "============================"

# CPU Usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
echo "🔥 CPU Usage: ${CPU_USAGE}%"

# Memory Usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f", ($3/$2) * 100.0)}')
echo "💾 Memory Usage: ${MEMORY_USAGE}%"

# Disk Usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
echo "💿 Disk Usage: ${DISK_USAGE}%"

# Active Connections
CONNECTIONS=$(netstat -an | grep :4000 | grep ESTABLISHED | wc -l)
echo "🔗 Active Connections: $CONNECTIONS"

# PM2 Process Status
echo "⚡ PM2 Processes:"
pm2 jlist | jq -r '.[] | "  \(.name): \(.pm2_env.status) (CPU: \(.pm2_env.monit.cpu)%, Memory: \(.pm2_env.monit.memory/1024/1024 | floor)MB)"'

# Log last errors
echo "📋 Recent Errors (last 10):"
tail -10 /var/log/auth-app/production.log | grep ERROR || echo "  No recent errors found"
```

---

## 🔄 **Tareas de Mantenimiento Rutinario**

### 📅 **Calendario de Mantenimiento**

#### **🌅 Diario (Automatizado)**
```bash
#!/bin/bash
# daily-maintenance.sh

echo "🌅 Daily Maintenance - $(date)"

# 1. Health Check
./health-check.sh

# 2. Log Rotation
sudo logrotate /etc/logrotate.d/auth-app

# 3. Database Backup
./backup-database.sh

# 4. Clean temporary files
find /tmp -name "auth-app-*" -mtime +1 -delete

# 5. Update dependency security
npm audit --audit-level=critical

# 6. Performance Report
./performance-monitor.sh >> /var/log/auth-app/daily-reports.log
```

#### **📅 Semanal (Semi-automático)**
```bash
#!/bin/bash
# weekly-maintenance.sh

echo "📅 Weekly Maintenance - $(date)"

# 1. Full System Backup
./full-backup.sh

# 2. Database Index Analysis
mongosh "$MONGODB_URI" --eval "
  db.users.getIndexes();
  db.stats();
  db.users.stats();
"

# 3. Log Analysis
echo "📊 Weekly Log Analysis:"
zcat /var/log/auth-app/production.log.*.gz | \
  grep -E "(ERROR|WARN)" | \
  sort | uniq -c | sort -nr | head -20

# 4. Security Scan
npm audit --fix

# 5. Performance Trending
./generate-performance-report.sh weekly

# 6. SSL Certificate Check
openssl x509 -in /etc/letsencrypt/live/auth-app.com/fullchain.pem -text -noout | grep "Not After"
```

#### **🗓️ Mensual (Manual)**
```bash
#!/bin/bash
# monthly-maintenance.sh

echo "🗓️ Monthly Maintenance - $(date)"

# 1. Dependency Updates Review
npm outdated
npm update

# 2. Database Optimization
mongosh "$MONGODB_URI" --eval "
  db.runCommand({compact: 'users'});
  db.users.reIndex();
"

# 3. Archive Old Logs
find /var/log/auth-app -name "*.log.*" -mtime +30 -exec gzip {} \;
find /var/log/auth-app -name "*.gz" -mtime +90 -delete

# 4. Security Review
./security-audit.sh

# 5. Performance Analysis
./generate-performance-report.sh monthly

# 6. Documentation Review
# Manual task: Review and update documentation
```

---

## 💾 **Gestión de Backups**

### 🔄 **Estrategia de Backup**

```
📊 Backup Strategy (3-2-1 Rule):
├── 3 copies of data
├── 2 different storage types  
└── 1 offsite backup
```

#### **🗄️ Database Backup**
```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="authapp_backup_$DATE"

echo "💾 Starting database backup: $BACKUP_NAME"

# 1. Create backup directory
mkdir -p $BACKUP_DIR

# 2. MongoDB dump
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$BACKUP_NAME"

# 3. Compress backup
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
rm -rf "$BACKUP_DIR/$BACKUP_NAME"

# 4. Upload to cloud storage (S3)
aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" s3://auth-app-backups/database/

# 5. Verify backup integrity
tar -tzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backup completed and verified: $BACKUP_NAME.tar.gz"
else
    echo "❌ Backup verification failed!"
    ./send-alert.sh "Backup Failed" "Database backup verification failed for $BACKUP_NAME"
fi

# 6. Cleanup old local backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "💾 Database backup completed: $(date)"
```

#### **📁 Application Backup**
```bash
#!/bin/bash
# backup-application.sh

BACKUP_DIR="/var/backups/application"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/auth-app"

echo "📁 Starting application backup: $DATE"

# 1. Create backup
tar -czf "$BACKUP_DIR/auth-app_$DATE.tar.gz" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="logs" \
    -C "$(dirname $APP_DIR)" "$(basename $APP_DIR)"

# 2. Upload to cloud
aws s3 cp "$BACKUP_DIR/auth-app_$DATE.tar.gz" s3://auth-app-backups/application/

# 3. Cleanup old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "✅ Application backup completed"
```

### 🔄 **Restauración de Backups**

#### **📖 Procedimiento de Restauración**
```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE=$1
RESTORE_DB="authapp_restored"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore-database.sh backup_file.tar.gz"
    exit 1
fi

echo "🔄 Starting database restore from: $BACKUP_FILE"

# 1. Download backup if from cloud
if [[ $BACKUP_FILE == s3://* ]]; then
    aws s3 cp "$BACKUP_FILE" ./temp_backup.tar.gz
    BACKUP_FILE="./temp_backup.tar.gz"
fi

# 2. Extract backup
tar -xzf "$BACKUP_FILE" -C /tmp/

# 3. Restore to temporary database
BACKUP_DIR=$(tar -tzf "$BACKUP_FILE" | head -1 | cut -f1 -d"/")
mongorestore --uri="$MONGODB_URI" --db="$RESTORE_DB" "/tmp/$BACKUP_DIR/authapp"

# 4. Verify restore
RESTORED_COUNT=$(mongosh "$MONGODB_URI/$RESTORE_DB" --eval "db.users.countDocuments()" --quiet)
echo "📊 Restored $RESTORED_COUNT user documents"

# 5. Switch databases (manual step)
echo "⚠️ Manual step required:"
echo "   1. Stop application: pm2 stop auth-app-production"
echo "   2. Rename databases in MongoDB"
echo "   3. Update configuration if needed"
echo "   4. Start application: pm2 start auth-app-production"

# 6. Cleanup
rm -rf "/tmp/$BACKUP_DIR"
[ -f "./temp_backup.tar.gz" ] && rm "./temp_backup.tar.gz"

echo "✅ Database restore prepared. Complete manual steps above."
```

---

## 📋 **Gestión de Logs**

### 📊 **Configuración de Logging**

#### **📝 Logrotate Configuration**
```bash
# /etc/logrotate.d/auth-app
/var/log/auth-app/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        systemctl reload nginx
        pm2 reload auth-app-production
    endscript
}
```

#### **🔍 Log Analysis Scripts**
```bash
#!/bin/bash
# analyze-logs.sh

LOG_FILE="/var/log/auth-app/production.log"
REPORT_FILE="/var/log/auth-app/daily-analysis-$(date +%Y%m%d).txt"

echo "📊 Daily Log Analysis - $(date)" > $REPORT_FILE
echo "========================================" >> $REPORT_FILE

# 1. Error Summary
echo "🚨 Errors (last 24h):" >> $REPORT_FILE
grep "ERROR" $LOG_FILE | grep "$(date +%Y-%m-%d)" | \
  awk '{print $4}' | sort | uniq -c | sort -nr >> $REPORT_FILE

# 2. Warning Summary  
echo -e "\n⚠️ Warnings (last 24h):" >> $REPORT_FILE
grep "WARN" $LOG_FILE | grep "$(date +%Y-%m-%d)" | \
  awk '{print $4}' | sort | uniq -c | sort -nr >> $REPORT_FILE

# 3. API Endpoint Usage
echo -e "\n📡 API Endpoints (most used):" >> $REPORT_FILE
grep "$(date +%Y-%m-%d)" $LOG_FILE | grep -E "(POST|GET|PUT|DELETE)" | \
  awk '{print $6}' | sort | uniq -c | sort -nr | head -10 >> $REPORT_FILE

# 4. Authentication Events
echo -e "\n🔐 Authentication Events:" >> $REPORT_FILE
grep "$(date +%Y-%m-%d)" $LOG_FILE | grep -E "(login|register|logout)" | \
  awk '{print $4}' | sort | uniq -c >> $REPORT_FILE

# 5. Performance Issues
echo -e "\n🐌 Slow Requests (>1s):" >> $REPORT_FILE
grep "$(date +%Y-%m-%d)" $LOG_FILE | grep "slow" | \
  awk '{print $0}' >> $REPORT_FILE

echo "📋 Log analysis completed: $REPORT_FILE"
```

---

## 🔐 **Mantenimiento de Seguridad**

### 🛡️ **Auditoría de Seguridad**

#### **🔍 Security Audit Script**
```bash
#!/bin/bash
# security-audit.sh

echo "🔐 Security Audit - $(date)"
echo "=========================="

# 1. Check for vulnerable dependencies
echo "📦 Checking Node.js dependencies..."
npm audit --audit-level=critical

# 2. SSL Certificate Status
echo "🔒 SSL Certificate Check..."
openssl x509 -in /etc/letsencrypt/live/auth-app.com/fullchain.pem -text -noout | \
  grep -E "(Not Before|Not After)"

# 3. Check for suspicious login attempts
echo "🚨 Suspicious Login Attempts (last 24h)..."
grep "$(date +%Y-%m-%d)" /var/log/auth-app/production.log | \
  grep -i "failed.*login" | wc -l

# 4. Database security check
echo "🗄️ Database Security Check..."
mongosh "$MONGODB_URI" --eval "
  print('Users with admin privileges:');
  db.runCommand({connectionStatus: 1});
"

# 5. File permissions check
echo "📁 Critical File Permissions..."
ls -la /var/www/auth-app/.env
ls -la /etc/ssl/private/

# 6. Network security
echo "🌐 Open Ports Check..."
netstat -tuln | grep -E ":(22|80|443|4000|27017)"

# 7. System updates
echo "🔄 System Updates Available..."
apt list --upgradable 2>/dev/null | grep -v "WARNING" | wc -l

echo "🔐 Security audit completed"
```

### 🔄 **Procedimientos de Actualización**

#### **🛠️ Security Update Procedure**
```bash
#!/bin/bash
# security-update.sh

echo "🛠️ Security Update Procedure"
echo "============================"

# 1. Backup before updates
echo "💾 Creating pre-update backup..."
./backup-application.sh
./backup-database.sh

# 2. Update Node.js dependencies
echo "📦 Updating Node.js dependencies..."
cd /var/www/auth-app/backend
npm audit fix --force

# 3. Update system packages
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 4. Restart services
echo "🔄 Restarting services..."
pm2 reload auth-app-production
sudo systemctl restart nginx

# 5. Verify functionality
echo "✅ Verifying application..."
sleep 10
./health-check.sh

# 6. Security scan post-update
echo "🔐 Post-update security scan..."
npm audit --audit-level=moderate

echo "🛠️ Security update completed"
```

---

## 📈 **Optimización de Performance**

### 🚀 **Database Optimization**

#### **🗄️ MongoDB Maintenance**
```javascript
// mongodb-optimization.js

// 1. Index Analysis
db.users.getIndexes();
db.users.aggregate([
  { $indexStats: {} }
]);

// 2. Query Performance Analysis
db.setProfilingLevel(2, { slowms: 100 });
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty();

// 3. Collection Statistics
db.users.stats();
db.runCommand({ collStats: "users" });

// 4. Compact Collections (offline operation)
db.runCommand({ compact: "users" });

// 5. Re-index Collections
db.users.reIndex();

// 6. Cleanup Old Data (if applicable)
// Example: Remove old sessions older than 30 days
db.sessions.deleteMany({
  lastAccess: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
});
```

#### **⚡ Application Performance**
```bash
#!/bin/bash
# optimize-performance.sh

echo "⚡ Performance Optimization"
echo "=========================="

# 1. PM2 Process Optimization
echo "🔄 Optimizing PM2 processes..."
pm2 reload auth-app-production --update-env

# 2. Clear Node.js cache
echo "🧹 Clearing Node.js cache..."
npm cache clean --force

# 3. Optimize database
echo "🗄️ Database optimization..."
mongosh "$MONGODB_URI" --eval "
  db.runCommand({compact: 'users'});
  db.users.reIndex();
"

# 4. Nginx optimization
echo "🌐 Nginx cache clear..."
sudo nginx -s reload

# 5. Monitor memory usage
echo "💾 Memory usage after optimization:"
free -h

# 6. Generate performance report
./generate-performance-report.sh optimization

echo "⚡ Performance optimization completed"
```

---

## 🚨 **Procedimientos de Emergencia**

### 🆘 **Incident Response**

#### **🔥 Emergency Response Plan**
```bash
#!/bin/bash
# emergency-response.sh

INCIDENT_TYPE=$1
SEVERITY=$2

echo "🚨 EMERGENCY RESPONSE ACTIVATED"
echo "Type: $INCIDENT_TYPE | Severity: $SEVERITY"
echo "Time: $(date)"
echo "======================================"

case $INCIDENT_TYPE in
  "database_down")
    echo "🗄️ Database Emergency Protocol"
    # 1. Check database connection
    mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')" || {
      # 2. Try backup database
      export MONGODB_URI="$MONGODB_BACKUP_URI"
      # 3. Restart application with backup
      pm2 restart auth-app-production --update-env
    }
    ;;
    
  "high_cpu")
    echo "🔥 High CPU Emergency Protocol"
    # 1. Scale down non-critical processes
    pm2 scale auth-app-production 1
    # 2. Clear caches
    npm cache clean --force
    # 3. Restart with resource limits
    pm2 restart auth-app-production
    ;;
    
  "memory_leak")
    echo "💾 Memory Leak Emergency Protocol"
    # 1. Immediate restart
    pm2 restart auth-app-production
    # 2. Enable memory monitoring
    pm2 monit
    # 3. Schedule frequent restarts
    pm2 restart auth-app-production --cron-restart="0 */4 * * *"
    ;;
    
  "security_breach")
    echo "🔐 Security Breach Emergency Protocol"
    # 1. Immediately revoke all JWT tokens (change secret)
    NEW_JWT_SECRET=$(openssl rand -hex 32)
    pm2 restart auth-app-production --update-env JWT_SECRET="$NEW_JWT_SECRET"
    # 2. Force all users to re-login
    # 3. Enable additional logging
    pm2 restart auth-app-production --update-env LOG_LEVEL="debug"
    # 4. Alert security team
    ./send-alert.sh "SECURITY BREACH" "Immediate attention required"
    ;;
esac

# Universal emergency actions
echo "📞 Notifying team..."
./send-alert.sh "Emergency: $INCIDENT_TYPE" "Severity: $SEVERITY - Response activated"

echo "📋 Generating incident report..."
./generate-incident-report.sh "$INCIDENT_TYPE" "$SEVERITY"

echo "🚨 Emergency response completed. Monitor closely."
```

### 📞 **Alert System**
```bash
#!/bin/bash
# send-alert.sh

SUBJECT=$1
MESSAGE=$2
PRIORITY=${3:-"high"}

# 1. Slack notification
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
         --data "{\"text\":\"🚨 AUTH APP ALERT\\n*Subject:* $SUBJECT\\n*Message:* $MESSAGE\\n*Time:* $(date)\"}" \
         "$SLACK_WEBHOOK_URL"
fi

# 2. Email notification
if [ ! -z "$ALERT_EMAIL" ]; then
    echo -e "Subject: [AUTH APP] $SUBJECT\n\n$MESSAGE\n\nTime: $(date)\nServer: $(hostname)" | \
    sendmail "$ALERT_EMAIL"
fi

# 3. SMS notification (for critical alerts)
if [ "$PRIORITY" = "critical" ] && [ ! -z "$SMS_API_KEY" ]; then
    curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" \
         -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
         -d "From=$TWILIO_PHONE" \
         -d "To=$ALERT_PHONE" \
         -d "Body=AUTH APP CRITICAL: $SUBJECT - $MESSAGE"
fi

echo "📞 Alert sent: $SUBJECT"
```

---

## 📊 **Reportes y Documentación**

### 📈 **Performance Reports**
```bash
#!/bin/bash
# generate-performance-report.sh

REPORT_TYPE=${1:-"daily"}
REPORT_DATE=$(date +%Y%m%d)
REPORT_FILE="/var/log/auth-app/reports/performance_${REPORT_TYPE}_${REPORT_DATE}.md"

mkdir -p /var/log/auth-app/reports

echo "# 📊 Performance Report - $REPORT_TYPE" > $REPORT_FILE
echo "**Date:** $(date)" >> $REPORT_FILE
echo "**Type:** $REPORT_TYPE Report" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# System Metrics
echo "## 🖥️ System Metrics" >> $REPORT_FILE
echo "- **CPU Usage:** $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%" >> $REPORT_FILE
echo "- **Memory Usage:** $(free | grep Mem | awk '{printf("%.1f", ($3/$2) * 100.0)}')%" >> $REPORT_FILE
echo "- **Disk Usage:** $(df -h / | awk 'NR==2 {print $5}')" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Application Metrics
echo "## 📡 Application Metrics" >> $REPORT_FILE
echo "- **Active Connections:** $(netstat -an | grep :4000 | grep ESTABLISHED | wc -l)" >> $REPORT_FILE
echo "- **Uptime:** $(pm2 show auth-app-production | grep "uptime" | awk '{print $3}')" >> $REPORT_FILE
echo "- **Restart Count:** $(pm2 show auth-app-production | grep "restart time" | awk '{print $4}')" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Database Metrics
echo "## 🗄️ Database Metrics" >> $REPORT_FILE
mongosh "$MONGODB_URI" --eval "
  var stats = db.users.stats();
  print('- **Documents:** ' + stats.count);
  print('- **Average Object Size:** ' + Math.round(stats.avgObjSize) + ' bytes');
  print('- **Storage Size:** ' + Math.round(stats.storageSize/1024/1024) + ' MB');
  print('- **Index Size:** ' + Math.round(stats.totalIndexSize/1024/1024) + ' MB');
" --quiet >> $REPORT_FILE

echo "" >> $REPORT_FILE

# Recent Errors
echo "## 🚨 Recent Issues" >> $REPORT_FILE
ERROR_COUNT=$(grep "ERROR" /var/log/auth-app/production.log | grep "$(date +%Y-%m-%d)" | wc -l)
echo "- **Errors Today:** $ERROR_COUNT" >> $REPORT_FILE

if [ $ERROR_COUNT -gt 0 ]; then
    echo "- **Top Errors:**" >> $REPORT_FILE
    grep "ERROR" /var/log/auth-app/production.log | grep "$(date +%Y-%m-%d)" | \
      awk '{print $4}' | sort | uniq -c | sort -nr | head -5 | \
      sed 's/^/  - /' >> $REPORT_FILE
fi

echo "" >> $REPORT_FILE
echo "---" >> $REPORT_FILE
echo "*Report generated by maintenance script at $(date)*" >> $REPORT_FILE

echo "📊 Performance report generated: $REPORT_FILE"
```

### 📋 **Incident Reports**
```bash
#!/bin/bash
# generate-incident-report.sh

INCIDENT_TYPE=$1
SEVERITY=$2
INCIDENT_ID="INC_$(date +%Y%m%d_%H%M%S)"
REPORT_FILE="/var/log/auth-app/incidents/${INCIDENT_ID}.md"

mkdir -p /var/log/auth-app/incidents

cat > $REPORT_FILE << EOF
# 🚨 Incident Report - $INCIDENT_ID

## 📋 Incident Details
- **ID:** $INCIDENT_ID
- **Type:** $INCIDENT_TYPE
- **Severity:** $SEVERITY
- **Date:** $(date)
- **Reporter:** Automated System

## 📊 System State at Incident Time
### Application Status
\`\`\`
$(pm2 show auth-app-production)
\`\`\`

### System Resources
\`\`\`
CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%
Memory: $(free | grep Mem | awk '{printf("%.1f", ($3/$2) * 100.0)}')%
Disk: $(df -h / | awk 'NR==2 {print $5}')
\`\`\`

### Recent Logs
\`\`\`
$(tail -20 /var/log/auth-app/production.log)
\`\`\`

## 🔧 Actions Taken
- Emergency response script executed
- Team notification sent
- System monitoring increased

## 📈 Follow-up Required
- [ ] Root cause analysis
- [ ] Implement preventive measures
- [ ] Update monitoring thresholds
- [ ] Team retrospective

---
*Incident report generated automatically*
EOF

echo "📋 Incident report created: $REPORT_FILE"
```

---

## 🔧 **Automation y Scripts**

### ⚙️ **Crontab Configuration**
```bash
# /etc/crontab - Auth App Maintenance

# Health checks every 5 minutes
*/5 * * * * root /var/www/auth-app/scripts/health-check.sh

# Daily maintenance at 2 AM
0 2 * * * root /var/www/auth-app/scripts/daily-maintenance.sh

# Weekly maintenance on Sundays at 3 AM
0 3 * * 0 root /var/www/auth-app/scripts/weekly-maintenance.sh

# Monthly maintenance on 1st day at 4 AM
0 4 1 * * root /var/www/auth-app/scripts/monthly-maintenance.sh

# Database backup every 6 hours
0 */6 * * * root /var/www/auth-app/scripts/backup-database.sh

# Log analysis daily at 1 AM
0 1 * * * root /var/www/auth-app/scripts/analyze-logs.sh

# Performance monitoring every hour
0 * * * * root /var/www/auth-app/scripts/performance-monitor.sh

# SSL certificate check daily
0 6 * * * root /var/www/auth-app/scripts/check-ssl.sh
```

### 🔄 **PM2 Ecosystem File**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'auth-app-production',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    
    // Resource limits
    max_memory_restart: '1G',
    max_restarts: 10,
    min_uptime: '10s',
    
    // Environment
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    
    // Monitoring
    monitoring: true,
    
    // Auto restart on file changes (disabled in production)
    watch: false,
    
    // Logs
    log_file: '/var/log/auth-app/combined.log',
    out_file: '/var/log/auth-app/out.log',
    error_file: '/var/log/auth-app/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    
    // Graceful shutdown
    kill_timeout: 5000,
    
    // Health check
    health_check_url: 'http://localhost:4000/api/health',
    health_check_grace_period: 3000
  }]
};
```

---

## 📚 **Recursos y Referencias**

### 🔗 **Documentación Útil**
- [PM2 Process Management](https://pm2.keymetrics.io/docs/)
- [MongoDB Operations](https://docs.mongodb.com/manual/administration/)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Nginx Performance Tuning](https://nginx.org/en/docs/http/ngx_http_core_module.html)

### 🛠️ **Herramientas Recomendadas**
- **Monitoring**: Prometheus + Grafana, New Relic
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Alerting**: PagerDuty, Slack integrations
- **Backup**: AWS S3, Google Cloud Storage
- **Security**: Snyk, OWASP ZAP

### 📞 **Contactos de Emergencia**
```
🚨 EMERGENCY CONTACTS
===================

Primary On-Call: +1-xxx-xxx-xxxx
Secondary On-Call: +1-xxx-xxx-xxxx
Team Lead: team-lead@company.com
DevOps Team: devops@company.com

Slack Channels:
- #auth-app-alerts
- #infrastructure
- #security-incidents

External Vendors:
- MongoDB Support: xxx-xxx-xxxx
- AWS Support: xxx-xxx-xxxx
- SSL Provider: xxx-xxx-xxxx
```

---

<div align="center">

**🔧 Documentado por Franklin - QA & Documentation Specialist**

*Mantenimiento proactivo para alta disponibilidad*

</div>