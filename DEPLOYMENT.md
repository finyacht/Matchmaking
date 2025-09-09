# Deployment Guide

Complete guide for deploying the Matchmaking Platform in different environments.

## 🚀 Quick Deploy

### Using Docker Compose (Recommended)
```bash
# Clone repository
git clone https://github.com/finyacht/Matchmaking.git
cd Matchmaking

# Setup environment
cp env.example .env
# Edit .env with your configuration

# Deploy all services
docker-compose up -d

# Check status
docker-compose ps
```

## 🏗️ Infrastructure Requirements

### Minimum Requirements (Development)
- **CPU**: 2 cores
- **Memory**: 4GB RAM
- **Storage**: 20GB SSD
- **Network**: 10 Mbps

### Recommended Requirements (Production)
- **CPU**: 4+ cores
- **Memory**: 8GB+ RAM
- **Storage**: 100GB+ SSD
- **Network**: 100 Mbps+
- **Load Balancer**: Nginx/HAProxy
- **Monitoring**: Prometheus + Grafana

### Cloud Provider Specifications

#### AWS
```yaml
# Application Server
Instance Type: t3.large (2 vCPU, 8GB RAM)
# Database
RDS: db.t3.medium (PostgreSQL 15)
# Cache
ElastiCache: cache.t3.micro (Redis)
# Storage
S3: Standard class for file uploads
# CDN
CloudFront: Global distribution
```

#### Google Cloud Platform
```yaml
# Application Server
Compute Engine: e2-standard-2 (2 vCPU, 8GB RAM)
# Database
Cloud SQL: db-custom-2-7680 (PostgreSQL 15)
# Cache
Memorystore: Basic tier, 1GB
# Storage
Cloud Storage: Standard class
# CDN
Cloud CDN: Global distribution
```

#### Azure
```yaml
# Application Server
Virtual Machine: Standard_B2s (2 vCPU, 4GB RAM)
# Database
Azure Database: GP_Gen5_2 (PostgreSQL 15)
# Cache
Azure Cache for Redis: Basic C1
# Storage
Blob Storage: Hot tier
# CDN
Azure CDN: Standard Microsoft
```

## 🐳 Docker Deployment

### Production Docker Compose
Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    restart: unless-stopped
    networks:
      - matchmaking-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - matchmaking-network

  app:
    image: matchmaking-platform:latest
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_HOST=postgres
      - REDIS_HOST=redis
      - PORT=3000
    env_file:
      - .env
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - matchmaking-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - static_files:/var/www/static
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - matchmaking-network

volumes:
  postgres_data:
  redis_data:
  static_files:

networks:
  matchmaking-network:
    driver: bridge
```

### Deploy to Production
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Scale application (multiple instances)
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

## ☸️ Kubernetes Deployment

### Namespace
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: matchmaking-platform
```

### ConfigMap
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: matchmaking-platform
data:
  NODE_ENV: "production"
  PORT: "3000"
  API_PREFIX: "api/v1"
  DATABASE_HOST: "postgres-service"
  REDIS_HOST: "redis-service"
```

### Secrets
```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: matchmaking-platform
type: Opaque
data:
  DATABASE_PASSWORD: <base64-encoded-password>
  JWT_SECRET: <base64-encoded-secret>
  OPENAI_API_KEY: <base64-encoded-key>
```

### PostgreSQL Deployment
```yaml
# postgres.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: matchmaking-platform
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: pgvector/pgvector:pg15
        env:
        - name: POSTGRES_DB
          value: "matchmaking_db"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DATABASE_PASSWORD
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: matchmaking-platform
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### Application Deployment
```yaml
# app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: matchmaking-app
  namespace: matchmaking-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: matchmaking-app
  template:
    metadata:
      labels:
        app: matchmaking-app
    spec:
      containers:
      - name: app
        image: matchmaking-platform:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: 500m
            memory: 1Gi
          requests:
            cpu: 250m
            memory: 512Mi
---
apiVersion: v1
kind: Service
metadata:
  name: app-service
  namespace: matchmaking-platform
spec:
  selector:
    app: matchmaking-app
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

### Ingress
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: matchmaking-ingress
  namespace: matchmaking-platform
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - matchmaking.yourdomain.com
    secretName: matchmaking-tls
  rules:
  - host: matchmaking.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80
```

### Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n matchmaking-platform

# View logs
kubectl logs -f deployment/matchmaking-app -n matchmaking-platform

# Scale application
kubectl scale deployment matchmaking-app --replicas=5 -n matchmaking-platform
```

## 🌐 Nginx Configuration

### Production Nginx Config
```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
        # For multiple instances:
        # server app_1:3000;
        # server app_2:3000;
        # server app_3:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    server {
        listen 80;
        server_name matchmaking.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name matchmaking.yourdomain.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/json
            application/javascript
            application/xml+rss
            application/atom+xml
            image/svg+xml;

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # Auth routes with stricter limits
        location /api/v1/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support for real-time messaging
        location /socket.io/ {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /static/ {
            alias /var/www/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Frontend application
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Handle client-side routing
            try_files $uri $uri/ @fallback;
        }

        location @fallback {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://app/health;
            access_log off;
        }
    }
}
```

## 🔐 SSL/TLS Configuration

### Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d matchmaking.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Setup
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# For production, use certificates from your CA
# Copy your certificates:
# cp /path/to/your/fullchain.pem nginx/ssl/
# cp /path/to/your/privkey.pem nginx/ssl/
```

## 📊 Monitoring & Logging

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'matchmaking-app'
    static_configs:
      - targets: ['app:3000']
    scrape_interval: 5s
    metrics_path: /metrics

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "Matchmaking Platform",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(active_users_total)"
          }
        ]
      },
      {
        "title": "Match Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(matches_created_total[5m])"
          }
        ]
      }
    ]
  }
}
```

### ELK Stack (Elasticsearch, Logstash, Kibana)
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    volumes:
      - ./logstash/config:/usr/share/logstash/pipeline
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

## 🚨 Backup & Recovery

### Database Backup Script
```bash
#!/bin/bash
# backup.sh

# Configuration
DB_NAME="matchmaking_db"
DB_USER="postgres"
DB_HOST="localhost"
BACKUP_DIR="/backups"
S3_BUCKET="matchmaking-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | \
  gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz \
  s3://$S3_BUCKET/database/

# Redis backup
redis-cli --rdb $BACKUP_DIR/redis_backup_$DATE.rdb
aws s3 cp $BACKUP_DIR/redis_backup_$DATE.rdb \
  s3://$S3_BUCKET/redis/

# File uploads backup
aws s3 sync /app/uploads s3://$S3_BUCKET/uploads/

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Automated Backup with Cron
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### Recovery Procedure
```bash
# Database recovery
gunzip -c db_backup_20231201_020000.sql.gz | \
  psql -h localhost -U postgres -d matchmaking_db

# Redis recovery
redis-cli FLUSHALL
redis-cli --rdb redis_backup_20231201_020000.rdb

# File uploads recovery
aws s3 sync s3://matchmaking-backups/uploads/ /app/uploads/
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### Application Won't Start
```bash
# Check logs
docker-compose logs app

# Common issues:
# 1. Database connection failure
# 2. Missing environment variables
# 3. Port conflicts
# 4. Insufficient memory

# Debug steps:
docker-compose exec app npm run health-check
docker-compose exec postgres pg_isready
```

#### High Memory Usage
```bash
# Monitor container resources
docker stats

# Check for memory leaks
docker-compose exec app node --inspect=0.0.0.0:9229 dist/main.js

# Optimize memory settings
docker-compose exec app node --max-old-space-size=2048 dist/main.js
```

#### Database Performance Issues
```sql
-- Check slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check cache hit ratio
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

### Performance Tuning

#### PostgreSQL Optimization
```sql
-- postgresql.conf settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

#### Redis Optimization
```conf
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

#### Nginx Optimization
```nginx
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
client_max_body_size 10M;
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
```

## 📈 Scaling Strategies

### Horizontal Scaling
```bash
# Scale application containers
docker-compose up -d --scale app=5

# Use container orchestration
kubectl scale deployment matchmaking-app --replicas=10
```

### Database Scaling
```yaml
# Read replicas
version: '3.8'
services:
  postgres-primary:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_REPLICATION_MODE: master
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: replicator_password

  postgres-replica:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_REPLICATION_MODE: slave
      POSTGRES_MASTER_HOST: postgres-primary
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: replicator_password
```

### CDN Integration
```javascript
// Configure CDN for static assets
const CDN_URL = process.env.CDN_URL || '';

// Serve static files from CDN
app.use('/static', express.static('public', {
  setHeaders: (res, path) => {
    if (CDN_URL) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));
```

This deployment guide provides comprehensive instructions for deploying the Matchmaking Platform across different environments and scaling strategies.
