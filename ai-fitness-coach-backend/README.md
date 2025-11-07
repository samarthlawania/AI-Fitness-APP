# AI Fitness Coach Backend

Production-ready Node.js backend for the AI Fitness Coach application with Express, PostgreSQL, Redis, and LLM integration.

## Features

- 🔐 **Authentication**: JWT-based auth with refresh tokens and password reset
- 🤖 **AI Integration**: Pluggable LLM adapters (OpenAI, Anthropic, Google AI)
- 🎵 **Text-to-Speech**: Generate audio summaries of fitness plans
- 🖼️ **Image Generation**: AI-generated images for exercises and meals
- 📄 **PDF Export**: Generate downloadable fitness plan PDFs
- 🔄 **Background Jobs**: BullMQ + Redis for async processing
- 📊 **Admin Dashboard**: Job monitoring and system statistics
- 🛡️ **Security**: Rate limiting, CORS, helmet, input validation
- 📚 **API Documentation**: Auto-generated OpenAPI/Swagger docs
- 🧪 **Testing**: Jest + Supertest with CI/CD pipeline

## Tech Stack

- **Runtime**: Node.js 22.x (ESM)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis + BullMQ
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Storage**: S3-compatible (AWS S3, Supabase Storage)
- **Logging**: Pino
- **Testing**: Jest + Supertest
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites

- Node.js 22.x or higher
- Docker and Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Local Development

1. **Clone and install dependencies**:
   ```bash
   cd ai-fitness-coach-backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker**:
   ```bash
   npm run local-dev
   ```
   This starts PostgreSQL, Redis, the API server, and background workers.

4. **Set up database**:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Access the application**:
   - API: http://localhost:3001
   - API Docs: http://localhost:3001/api-docs
   - Health Check: http://localhost:3001/healthz

### Manual Setup (without Docker)

1. **Start PostgreSQL and Redis** locally

2. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Start the worker process** (in another terminal):
   ```bash
   npm run worker
   ```

## Environment Variables

Copy `.env.example` to `.env` and configure:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_fitness_coach"

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Redis
REDIS_URL="redis://localhost:6379"

# AI API Keys (Server-side only)
OPENAI_API_KEY="sk-your-openai-key"
```

### Optional Variables

```env
# AWS S3 Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
S3_BUCKET_NAME="ai-fitness-coach-uploads"

# Email (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot` - Request password reset
- `POST /api/auth/reset` - Reset password

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile

### Plans
- `POST /api/plans/generate` - Generate fitness plan (async)
- `GET /api/plans/status/:jobId` - Check generation status
- `GET /api/plans` - List user's plans
- `GET /api/plans/:id` - Get specific plan
- `POST /api/plans/:id/regenerate` - Regenerate plan

### AI Services
- `POST /api/ai/tts` - Generate text-to-speech audio
- `POST /api/ai/images` - Generate exercise/meal images

### Export
- `POST /api/export/pdf` - Generate plan PDF

### Admin (Admin users only)
- `GET /api/admin/jobs` - Job queue status
- `GET /api/admin/stats` - System statistics

### Health
- `GET /healthz` - Health check
- `GET /ready` - Readiness check

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models:

- **User**: User accounts with profile data
- **Plan**: Generated fitness plans with workout/diet data
- **RefreshToken**: JWT refresh token management
- **PasswordResetToken**: Password reset tokens
- **Job**: Background job tracking

Run migrations:
```bash
npx prisma migrate dev
npx prisma db seed  # Creates admin and test users
```

## Background Jobs

The application uses BullMQ for background processing:

- **Plan Generation**: LLM-powered fitness plan creation
- **TTS Generation**: Text-to-speech audio creation
- **Image Generation**: AI-generated exercise/meal images
- **PDF Generation**: Fitness plan PDF creation

Start the worker process:
```bash
npm run worker
```

## Testing

Run the test suite:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

Tests include:
- Authentication flow tests
- Plan generation with mocked LLM responses
- API endpoint integration tests
- Database operations

## Deployment

### Environment Setup

1. **Production Environment Variables**:
   - Set strong JWT secrets
   - Configure production database URL
   - Set up S3 storage credentials
   - Configure SMTP for emails
   - Add AI API keys

2. **Database Migration**:
   ```bash
   npx prisma migrate deploy
   ```

### Deployment Options

#### Render
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main

#### Vercel (API only)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Set up environment variables in Vercel dashboard

#### Heroku
1. Create Heroku app: `heroku create your-app-name`
2. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
3. Add Redis: `heroku addons:create heroku-redis:mini`
4. Set environment variables: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

#### Docker
```bash
docker build -t ai-fitness-backend .
docker run -p 3001:3001 ai-fitness-backend
```

## Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **Password Hashing**: bcrypt with configurable rounds
- **JWT Security**: Access + refresh token rotation
- **Content Security Policy**: XSS protection
- **Request Size Limits**: Prevents large payload attacks

## Monitoring

- **Health Checks**: `/healthz` and `/ready` endpoints
- **Logging**: Structured logging with Pino
- **Request Tracking**: Unique request IDs
- **Job Monitoring**: Admin dashboard for queue status
- **Error Handling**: Centralized error middleware

## Development

### Code Quality
```bash
npm run lint          # ESLint
npm run lint:fix      # Fix linting issues
npm run format        # Prettier formatting
```

### Database
```bash
npx prisma studio     # Database GUI
npx prisma generate   # Regenerate Prisma client
npx prisma db push    # Push schema changes
```

### Adding New AI Providers

1. Create adapter in `src/adapters/`
2. Implement the provider interface
3. Add provider configuration to environment
4. Update the adapter factory

## Troubleshooting

### Common Issues

1. **Database Connection**: Check DATABASE_URL and ensure PostgreSQL is running
2. **Redis Connection**: Verify REDIS_URL and Redis service
3. **AI API Errors**: Validate API keys and rate limits
4. **Job Processing**: Ensure worker process is running
5. **File Uploads**: Check S3 credentials and bucket permissions

### Logs

Check application logs for detailed error information:
```bash
# Development
npm run dev

# Production
docker logs <container-id>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run linting and tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation at `/api-docs`
- Check application logs
- Create an issue in the repository