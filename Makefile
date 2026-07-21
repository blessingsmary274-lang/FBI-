.PHONY: help up down logs ps build rebuild clean init test dev stop restart

help:
	@echo "Available commands:"
	@echo "  make up              - Start all services"
	@echo "  make down            - Stop all services"
	@echo "  make logs            - View logs for all services"
	@echo "  make logs-service    - View logs for specific service (e.g., make logs-service SERVICE=user-service)"
	@echo "  make ps              - List running containers"
	@echo "  make build           - Build all Docker images"
	@echo "  make rebuild         - Rebuild all Docker images from scratch"
	@echo "  make clean           - Remove all containers and volumes"
	@echo "  make init            - Initialize the project (setup, build, and start)"
	@echo "  make stop            - Stop all services without removing them"
	@echo "  make restart         - Restart all services"
	@echo "  make seed-db         - Seed databases with sample data"
	@echo "  make test            - Run tests in all services"

up:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "Services started!"
	@echo ""
	@echo "Available endpoints:"
	@echo "  API Gateway:      http://localhost (or https://localhost for HTTPS)"
	@echo "  User Service:     http://localhost:3001"
	@echo "  Product Service:  http://localhost:3002"
	@echo "  Order Service:    http://localhost:3003"
	@echo "  Payment Service:  http://localhost:3004"
	@echo "  Grafana:          http://localhost:3000 (admin/admin)"
	@echo "  Prometheus:       http://localhost:9090"
	@echo "  Kibana:           http://localhost:5601"
	@echo "  RabbitMQ:         http://localhost:15672 (guest/guest)"

down:
	@echo "Stopping all services..."
	docker-compose down
	@echo "Services stopped!"

logs:
	docker-compose logs -f

logs-service:
	docker-compose logs -f $(SERVICE)

ps:
	docker-compose ps

build:
	@echo "Building Docker images..."
	docker-compose build
	@echo "Build complete!"

rebuild:
	@echo "Rebuilding Docker images from scratch..."
	docker-compose build --no-cache
	@echo "Rebuild complete!"

clean:
	@echo "Cleaning up containers and volumes..."
	docker-compose down -v
	@echo "Cleanup complete!"

init: build up
	@echo "Project initialized!"

stop:
	@echo "Stopping all services..."
	docker-compose stop
	@echo "Services stopped!"

restart: stop up
	@echo "Services restarted!"

seed-db:
	@echo "Seeding databases..."
	docker-compose exec postgres psql -U postgres < init-scripts/init.sql
	@echo "Databases seeded!"

test:
	@echo "Running tests in all services..."
	docker-compose run --rm user-service npm test
	docker-compose run --rm product-service npm test
	docker-compose run --rm order-service npm test
	docker-compose run --rm payment-service npm test
	@echo "All tests complete!"