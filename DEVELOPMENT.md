# Development Guide

This guide provides detailed instructions for setting up and developing the Matchmaking Platform.

## 🛠️ Development Environment Setup

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL 15+ with PGVector extension
- Redis 7+
- Docker & Docker Compose (recommended)
- OpenAI API key (for AI features)

### Local Development Setup

1. **Clone and Setup**
```bash
git clone https://github.com/finyacht/Matchmaking.git
cd Matchmaking
cp env.example .env
```

2. **Database Setup**
```bash
# Using Docker (recommended)
docker-compose up postgres redis -d

# Or install locally
# PostgreSQL with pgvector extension
# Redis server
```

3. **Backend Setup**
```bash
# Install dependencies
npm install

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

4. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

## 🏗️ Architecture Deep Dive

### Backend Architecture

#### Module Structure
```
src/
├── modules/
│   ├── auth/           # Authentication & authorization
│   ├── users/          # User management & profiles
│   ├── matching/       # Matching algorithm & swipes
│   ├── messaging/      # Real-time messaging
│   └── ai/             # AI services & embeddings
├── common/
│   ├── enums/          # Shared enumerations
│   ├── guards/         # Security guards
│   └── decorators/     # Custom decorators
├── config/             # Configuration management
└── database/           # Database setup & migrations
```

#### Core Services

**MatchingService**: Core business logic
- Compatibility scoring algorithm
- Feed generation with personalization
- Swipe limit enforcement
- Mutual match detection

**AiService**: AI-powered features
- OpenAI integration for text processing
- Embedding generation for semantic search
- Pitch deck parsing and summarization
- Profile enhancement suggestions

**UsersService**: Profile management
- User CRUD operations
- Profile validation and enrichment
- Relationship management

### Frontend Architecture

#### Component Structure
```
src/
├── components/         # Reusable UI components
├── pages/             # Route-level components
├── contexts/          # React contexts for state
├── hooks/             # Custom React hooks
├── services/          # API communication
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

#### State Management
- **React Context**: Authentication and global state
- **Local State**: Component-specific state with hooks
- **Form State**: React Hook Form for complex forms
- **Server State**: React Query for API caching (planned)

## 🔄 Development Workflow

### Code Standards

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

#### ESLint Rules
- Strict TypeScript checking
- Import organization
- Consistent naming conventions
- React best practices

#### Prettier Configuration
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

### Git Workflow

#### Branch Naming
- `feature/user-authentication`
- `bugfix/matching-algorithm-score`
- `hotfix/security-vulnerability`
- `refactor/database-optimization`

#### Commit Messages
```
feat: add semantic similarity matching
fix: resolve swipe limit bypass issue
docs: update API documentation
test: add unit tests for matching service
refactor: optimize database queries
```

#### Pull Request Process
1. Feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Create PR with descriptive title
5. Code review and approval
6. Squash and merge

### Testing Strategy

#### Backend Testing
```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Coverage reports
npm run test:cov
```

#### Test Structure
```typescript
describe('MatchingService', () => {
  describe('calculateCompatibilityScore', () => {
    it('should return high score for perfect match', async () => {
      // Arrange
      const startup = createMockStartup();
      const investor = createMockInvestor();
      
      // Act
      const score = await service.calculateCompatibilityScore(startup, investor);
      
      // Assert
      expect(score).toBeGreaterThan(80);
    });
  });
});
```

#### Frontend Testing
```bash
cd frontend
npm test
```

#### E2E Testing (Planned)
- Cypress for critical user journeys
- Authentication flow testing
- Swipe and match workflows
- Real-time messaging tests

## 🗃️ Database Development

### Migration Management
```bash
# Generate new migration
npm run migration:generate src/database/migrations/add-user-preferences

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Entity Relationships
```typescript
// One-to-One: User -> Profile
@OneToOne(() => StartupProfile)
startupProfile: StartupProfile;

// One-to-Many: User -> Swipes
@OneToMany(() => Swipe, swipe => swipe.user)
swipes: Swipe[];

// Many-to-Many: Startup <-> Investor (through Matches)
@ManyToOne(() => User)
startup: User;
```

### Query Optimization
```typescript
// Efficient feed generation with pagination
const candidates = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.startupProfile', 'profile')
  .where('user.userType = :type', { type: 'investor' })
  .andWhere('user.id NOT IN (:...excludeIds)', { excludeIds })
  .orderBy('profile.lastRoundSize', 'DESC')
  .limit(50)
  .getMany();
```

### Vector Operations (PGVector)
```sql
-- Semantic similarity search
SELECT *, (pitch_embedding <-> :queryEmbedding) AS distance
FROM startup_profiles
WHERE (pitch_embedding <-> :queryEmbedding) < 0.5
ORDER BY distance
LIMIT 20;
```

## 🎨 UI/UX Development

### Design System

#### Color Palette
```typescript
const theme = {
  primary: '#1976d2',      // Blue - trust, professionalism
  secondary: '#dc004e',    // Pink - energy, innovation
  success: '#2e7d32',      // Green - positive actions
  warning: '#ed6c02',      // Orange - caution
  error: '#d32f2f',        // Red - errors, rejections
};
```

#### Typography Scale
```typescript
const typography = {
  h1: { fontSize: '2.5rem', fontWeight: 700 },    // Page titles
  h2: { fontSize: '2rem', fontWeight: 600 },      // Section headers
  h3: { fontSize: '1.5rem', fontWeight: 600 },    // Card titles
  body1: { fontSize: '1rem', fontWeight: 400 },   // Body text
  caption: { fontSize: '0.75rem', fontWeight: 400 }, // Labels
};
```

#### Component Guidelines
- **Cards**: 12px border radius, subtle shadows
- **Buttons**: 8px border radius, medium font weight
- **Forms**: Consistent spacing, clear validation
- **Loading States**: Skeleton screens for better UX

### Responsive Design
```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

### Accessibility (a11y)
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- Color contrast validation
- Focus management

## 🔧 API Development

### Endpoint Design Principles
```typescript
// RESTful resource naming
GET    /api/v1/users/{id}/profile
POST   /api/v1/matching/swipe
GET    /api/v1/matching/feed?limit=20&sectors[]=fintech
PATCH  /api/v1/users/{id}/preferences
DELETE /api/v1/matches/{id}
```

### Request/Response Standards
```typescript
// Standard response format
interface ApiResponse<T> {
  data: T;
  message?: string;
  metadata?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Error response format
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}
```

### Validation & Serialization
```typescript
// DTO with validation
export class CreateStartupProfileDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEnum(StartupStage)
  stage: StartupStage;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  sectors: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  valuation?: number;
}
```

### Rate Limiting
```typescript
// Different limits by user type
const RATE_LIMITS = {
  startup: {
    swipes: 20,    // per day
    api: 1000,     // per hour
  },
  investor: {
    swipes: 50,    // per day
    api: 2000,     // per hour
  },
};
```

## 🤖 AI Integration Development

### OpenAI Integration
```typescript
// Embedding generation
const embedding = await openai.embeddings.create({
  model: 'text-embedding-ada-002',
  input: profileText,
});

// Text completion for summaries
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.3,
  max_tokens: 150,
});
```

### Semantic Search Implementation
```typescript
// Calculate semantic similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

### AI Service Architecture
```typescript
interface AiService {
  generateEmbedding(text: string): Promise<number[]>;
  parsePitchDeck(content: string): Promise<PitchDeckData>;
  generateSummary(profile: UserProfile): Promise<string>;
  classifyIndustry(description: string): Promise<string[]>;
  extractMetrics(text: string): Promise<FinancialMetrics>;
}
```

## 📊 Analytics & Monitoring

### Application Metrics
```typescript
// Custom metrics tracking
const metrics = {
  // Business metrics
  userSignups: counter('user_signups_total'),
  swipesDaily: counter('swipes_daily_total'),
  matchesCreated: counter('matches_created_total'),
  messagesExchanged: counter('messages_exchanged_total'),
  
  // Technical metrics
  apiResponseTime: histogram('api_response_time_seconds'),
  databaseQueryTime: histogram('db_query_time_seconds'),
  aiServiceLatency: histogram('ai_service_latency_seconds'),
};
```

### Error Tracking
```typescript
// Structured error logging
logger.error('Matching algorithm failed', {
  userId,
  targetId,
  errorCode: 'SCORING_ERROR',
  stack: error.stack,
  metadata: { algorithm: 'v2.1', features: enabledFeatures },
});
```

### Performance Monitoring
```typescript
// Query performance tracking
@Injectable()
export class QueryPerformanceInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        if (duration > 1000) {
          logger.warn('Slow query detected', { duration, endpoint });
        }
      }),
    );
  }
}
```

## 🚀 Deployment & DevOps

### Environment Configuration
```bash
# Development
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_LOGGING=true

# Staging
NODE_ENV=staging
LOG_LEVEL=info
DATABASE_LOGGING=false

# Production
NODE_ENV=production
LOG_LEVEL=warn
DATABASE_LOGGING=false
REDIS_CLUSTER=true
```

### Docker Optimization
```dockerfile
# Multi-stage build for smaller images
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
USER nestjs
```

### Health Checks
```typescript
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        ai: await this.checkAiService(),
      },
    };
  }
}
```

### Backup Strategy
```bash
# Database backups
pg_dump matchmaking_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# File uploads backup
aws s3 sync /app/uploads s3://matchmaking-backups/uploads/

# Redis snapshot
redis-cli BGSAVE
```

## 🔍 Debugging & Troubleshooting

### Common Issues

#### High Memory Usage
```typescript
// Memory leak detection
process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    logger.warn('Potential memory leak detected', warning);
  }
});

// Monitor heap usage
setInterval(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
    logger.warn('High memory usage detected', memUsage);
  }
}, 30000);
```

#### Database Connection Issues
```typescript
// Connection pool monitoring
@Injectable()
export class DatabaseHealthService {
  async checkConnection() {
    try {
      await this.connection.query('SELECT 1');
      return { status: 'healthy' };
    } catch (error) {
      logger.error('Database connection failed', error);
      return { status: 'unhealthy', error: error.message };
    }
  }
}
```

#### AI Service Timeouts
```typescript
// Timeout and retry logic
async generateEmbedding(text: string, retries = 3): Promise<number[]> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const result = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      }, { signal: controller.signal });
      
      clearTimeout(timeoutId);
      return result.data[0].embedding;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Debug Commands
```bash
# Backend debugging
npm run start:debug
# Attach debugger to port 9229

# Database queries
npm run typeorm query "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '1 day'"

# Redis inspection
redis-cli MONITOR
redis-cli INFO memory

# Log analysis
tail -f logs/application.log | grep ERROR
```

## 🎯 Performance Optimization

### Database Optimization
```sql
-- Index for feed generation
CREATE INDEX CONCURRENTLY idx_users_type_active 
ON users (user_type, is_active) 
WHERE is_active = true;

-- Partial index for recent swipes
CREATE INDEX CONCURRENTLY idx_swipes_recent 
ON swipes (user_id, created_at) 
WHERE created_at > NOW() - INTERVAL '1 day';

-- Vector similarity index
CREATE INDEX CONCURRENTLY idx_startup_profiles_embedding 
ON startup_profiles USING ivfflat (pitch_embedding vector_cosine_ops) 
WITH (lists = 100);
```

### Caching Strategy
```typescript
// Redis caching for expensive operations
@Injectable()
export class CacheService {
  async getCachedFeed(userId: string): Promise<any[]> {
    const cacheKey = `feed:${userId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const feed = await this.generateFeed(userId);
    await this.redis.setex(cacheKey, 300, JSON.stringify(feed)); // 5min TTL
    
    return feed;
  }
}
```

### Query Optimization
```typescript
// Avoid N+1 queries
const usersWithProfiles = await this.userRepository.find({
  relations: ['startupProfile', 'investorProfile'],
  where: { userType: targetType },
});

// Use pagination for large datasets
const [users, total] = await this.userRepository.findAndCount({
  skip: page * limit,
  take: limit,
  order: { createdAt: 'DESC' },
});
```

This comprehensive development guide should help you understand the codebase structure, development practices, and best practices for contributing to the Matchmaking Platform.
