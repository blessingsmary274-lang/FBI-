# User Service

Microservice for user management and authentication.

## Features

- User registration and authentication
- JWT-based authorization
- User profile management
- Password hashing with bcryptjs
- Redis caching
- Event publishing via RabbitMQ

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/verify` - Verify JWT token

### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

## Environment Variables

See `.env.example` for required variables.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```
