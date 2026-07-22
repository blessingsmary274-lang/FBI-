# Setup Guide

This guide will help you get the microservices architecture up and running locally using Docker Compose.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v1.29+)
- Make (optional, but recommended)
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/blessingsmary274-lang/FBI-.git
cd FBI-
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env if needed (default values work for local development)
```

### 3. Initialize and Start Services
Using Make (recommended):
```bash
make init
```

Or using Docker Compose directly:
```bash
docker-compose build
docker-compose up -d
```

### 4. Verify Services are Running
```bash
make ps
# or
docker-compose ps
```

You should see all services with status "Up".

## Accessing Services

Once everything is running, you can access:

| Service | URL | Credentials |
|---------|-----|-------------|  
| API Gateway | http://localhost | - |
| User Service | http://localhost:3001 | - |
| Product Service | http://localhost:3002 | - |
| Order Service | http://localhost:3003 | - |
| Payment Service | http://localhost:3004 | - |
| Grafana | http://localhost:3000 | admin / admin |
| Prometheus | http://localhost:9090 | - |
| Kibana | http://localhost:5601 | - |
| RabbitMQ | http://localhost:15672 | guest / guest |
| PostgreSQL | localhost:5432 | postgres / postgres |
| MongoDB | localhost:27017 | - |
| Redis | localhost:6379 | - |

## Useful Commands

### View Logs
```bash
# All services
make logs

# Specific service
make logs-service SERVICE=user-service
```

### Stop Services
```bash
make stop      # Stop but keep containers
make down      # Stop and remove containers
make clean     # Stop, remove containers AND volumes
```

### Restart Services
```bash
make restart
```

### Run Tests
```bash
make test
```

### Rebuild Images
```bash
make rebuild
```

## API Gateway Configuration

The NGINX API Gateway is configured to:
- Route `/api/users` → User Service
- Route `/api/auth` → User Service
- Route `/api/products` → Product Service
- Route `/api/categories` → Product Service
- Route `/api/orders` → Order Service
- Route `/api/payments` → Payment Service

Rate limiting is applied:
- General endpoints: 10 requests/second
- Auth/Payment endpoints: 5 requests/second

## Database Initialization

### PostgreSQL
- Default database: `postgres`
- User: `postgres`
- Password: `postgres`
- Databases created for: users, orders, payments

### MongoDB
- Default database: `product_db`
- No authentication in development

To seed databases with initial data:
```bash
make seed-db
```

## Monitoring & Observability

### Prometheus
- Scrapes metrics from all services every 15 seconds
- Access dashboards at http://localhost:9090

### Grafana
- Pre-configured Prometheus data source
- Create custom dashboards for visualization
- Default login: admin / admin

### Kibana & Elasticsearch
- Centralized logging for all services
- Access at http://localhost:5601

### RabbitMQ
- Message broker for async communication
- Management console at http://localhost:15672
- Default credentials: guest / guest

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Find the process using the port
lsof -i :PORT_NUMBER

# Kill the process
kill -9 PID
```

### Services Not Starting
Check logs to identify the issue:
```bash
make logs
```

Common issues:
- Not enough disk space for Docker volumes
- Docker daemon not running
- Previous containers not cleaned up

### Database Connection Issues
Ensure database containers are healthy:
```bash
docker-compose ps
```

All services should show "Up" status. If not, check logs:
```bash
make logs-service SERVICE=postgres
```

### Memory Issues
Docker Compose might need more resources. Increase Docker's memory limit in preferences.

## Development Workflow

1. **Create a new branch for your feature:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes in the relevant service directory:**
   ```bash
   services/user-service/
   services/product-service/
   # etc.
   ```

3. **Services auto-reload with docker-compose.override.yml (if volumes are mounted)**

4. **Test your changes:**
   ```bash
   make test
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

## Production Deployment

For production deployment:
1. Replace `docker-compose.yml` with proper production configuration
2. Use environment-specific values in `.env`
3. Enable SSL/TLS certificates (not self-signed)
4. Scale services using Kubernetes or Docker Swarm
5. Setup proper monitoring and alerting
6. Implement CI/CD pipeline

See `ARCHITECTURE.md` for production deployment recommendations.

## Performance Tuning

### Increase Resource Limits
Edit `docker-compose.yml` and add resource limits:
```yaml
services:
  user-service:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Enable Response Compression
Compression is configured in NGINX for faster responses.

### Optimize Database Queries
Use Kibana and Prometheus to identify slow queries and optimize them.

## Next Steps

1. **Implement microservices** - See service directories for implementation guidelines
2. **Configure CI/CD** - Setup GitHub Actions for automated testing and deployment
3. **Add API documentation** - Use Swagger/OpenAPI for API documentation
4. **Security hardening** - Implement WAF, authentication, encryption
5. **Load testing** - Use tools like Apache JMeter or k6 for performance testing

## Support

For issues or questions:
- Check existing GitHub issues
- Review logs using `make logs`
- Consult ARCHITECTURE.md for system design
- Contact DevOps team for infrastructure issues