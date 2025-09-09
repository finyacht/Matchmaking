# Matchmaking Platform MVP

A comprehensive investor-startup matchmaking platform built with scalable architecture and AI-powered matching algorithms.

## 🚀 Overview

This platform connects startups with investors through intelligent matching based on sector fit, stage alignment, check sizes, traction metrics, and mutual preferences. Built with modern technologies and designed for scalability.

## 📋 Features

### Core Features (MVP)
- ✅ **User Authentication & Profiles**
  - Secure JWT-based authentication
  - Startup and investor profile creation
  - Profile validation and data management

- ✅ **Smart Matching Algorithm**
  - Multi-factor compatibility scoring (100-point scale)
  - Stage fit, sector alignment, check size matching
  - Geography and KPI-based filtering
  - Configurable scoring weights

- ✅ **Swipe Interface**
  - Daily swipe limits (Startups: 20, Investors: 50)
  - Real-time mutual match detection
  - Personalized feed ranking

- ✅ **Messaging System**
  - Real-time chat for matched pairs
  - WebSocket-based communication
  - Message history and read status

- ✅ **AI Integration**
  - Pitch deck parsing with OpenAI GPT
  - Text embeddings for semantic matching
  - Automated profile summaries

### Advanced Features (Planned)
- 🔄 Premium subscriptions and monetization
- 🔄 Advanced analytics and insights
- 🔄 Deal room and document sharing
- 🔄 Calendar integration and scheduling
- 🔄 Success tracking and outcomes

## 🏗️ Architecture

### Tech Stack
- **Backend**: NestJS (TypeScript), PostgreSQL + PGVector, Redis
- **Frontend**: React 18, Material-UI, TypeScript
- **AI/ML**: OpenAI GPT-3.5/4, text-embeddings-ada-002
- **DevOps**: Docker, Docker Compose, Nginx
- **Authentication**: JWT with Passport strategies

### Database Schema
- **Users**: Core user management with role-based access
- **Profiles**: Separate entities for startup and investor profiles
- **Matching**: Swipes, matches, and compatibility scores
- **Messaging**: Conversations and real-time messages
- **Embeddings**: Vector storage for semantic search

### API Structure
```
/api/v1/
├── auth/           # Authentication endpoints
├── users/          # User management and profiles
├── matching/       # Feed, swipes, and matches
├── messaging/      # Chat and conversations
└── ai/             # AI services and embeddings
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/finyacht/Matchmaking.git
cd Matchmaking
```

2. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Install dependencies (for development)**
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

5. **Run database migrations**
```bash
npm run migration:run
```

### Environment Configuration

Create a `.env` file with the following variables:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=matchmaking_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key-here

# Application
PORT=3000
NODE_ENV=development
```

## 📖 API Documentation

### Authentication
```typescript
POST /api/v1/auth/signup
POST /api/v1/auth/login
```

### Profile Management
```typescript
GET  /api/v1/users/profile
POST /api/v1/users/startup-profile
POST /api/v1/users/investor-profile
```

### Matching
```typescript
GET  /api/v1/matching/feed?limit=20&sectors[]=fintech
POST /api/v1/matching/swipe
GET  /api/v1/matching/matches
```

### AI Services
```typescript
POST /api/v1/ai/parse-pitch-deck
POST /api/v1/ai/generate-embedding
POST /api/v1/ai/generate-summary
```

## 🎯 Matching Algorithm

### Scoring Factors (100-point scale)
- **Stage Fit** (20pts): Exact or adjacent stage matching
- **Sector Alignment** (18pts): Tag overlap and semantic similarity
- **Check Size/Valuation** (15pts): Investment range compatibility
- **Geography** (10pts): Location preferences and market focus
- **KPIs/Traction** (12pts): ARR, growth metrics thresholds
- **Value-Add Alignment** (8pts): Startup needs vs investor offerings
- **Cultural Fit** (6pts): Communication style and profile similarity
- **Reputation** (5pts): Track record and references
- **Timing** (6pts): Availability and decision speed

### Feed Algorithm
1. **Hard Filters**: Stage, geography, legal constraints
2. **Scoring**: Calculate compatibility for each candidate
3. **Ranking**: Sort by mutual score with recency boost
4. **Personalization**: Learning from swipe patterns
5. **Exploration**: 10% random injection to avoid filter bubbles

## 💰 Monetization Strategy

### Freemium Model
- **Free Tier**: Basic swipes, limited messaging
- **Premium Startup** ($49/month): Unlimited swipes, priority placement, analytics
- **Premium Investor** ($99/month): Advanced filters, portfolio insights, deal flow

### Success-Based Revenue
- **Intro Fees**: $500 per successful introduction
- **Success Fee**: 0.5% of funding round for closed deals
- **Data Licensing**: Market insights to LPs and service providers

## 🔧 Development

### Running Locally
```bash
# Backend development
npm run start:dev

# Frontend development
cd frontend
npm start

# Database operations
npm run migration:generate
npm run migration:run
```

### Testing
```bash
# Backend tests
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# SSL/HTTPS with Nginx
docker-compose -f docker-compose.ssl.yml up -d
```

### Scaling Considerations
- **Horizontal Scaling**: Stateless API design supports multiple instances
- **Database**: Read replicas for feed generation
- **Caching**: Redis for rate limiting and session management
- **CDN**: Static assets and file uploads via S3/CloudFront
- **Monitoring**: Prometheus/Grafana for metrics and alerting

## 📊 Analytics & Metrics

### Key Performance Indicators
- **User Engagement**: Daily active users, swipe rates, match rates
- **Conversion Funnel**: Signup → Profile → Swipe → Match → Message → Intro
- **Business Metrics**: Revenue per user, customer acquisition cost
- **Platform Health**: API response times, error rates, uptime

### A/B Testing Framework
- **Matching Algorithm**: Scoring weight optimization
- **UI/UX**: Swipe interface, profile layouts
- **Monetization**: Premium feature adoption, pricing experiments

## 🔐 Security & Privacy

### Data Protection
- **Encryption**: TLS 1.3 for data in transit, AES-256 for sensitive data
- **Authentication**: JWT with secure httpOnly cookies
- **Authorization**: Role-based access control (RBAC)
- **Privacy**: GDPR compliance, data anonymization

### Security Measures
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive data sanitization
- **SQL Injection**: Parameterized queries with TypeORM
- **XSS Protection**: Content Security Policy (CSP)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code formatting
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality checks

## 📱 Mobile Support

### Progressive Web App (PWA)
- **Responsive Design**: Mobile-first UI components
- **Offline Support**: Service worker for basic functionality
- **Push Notifications**: Match alerts and message notifications
- **App Shell**: Fast loading and app-like experience

## 🌍 Internationalization

### Multi-Language Support
- **i18n Framework**: React-intl for frontend
- **Backend Localization**: NestJS i18n module
- **Supported Languages**: English (primary), Spanish, French, German
- **RTL Support**: Arabic and Hebrew language support

## 📈 Roadmap

### Phase 1: MVP (Complete)
- ✅ Core authentication and profiles
- ✅ Basic matching algorithm
- ✅ Swipe interface and messaging
- ✅ Docker deployment setup

### Phase 2: Enhanced Features (Q1 2024)
- 🔄 Advanced AI recommendations
- 🔄 Deal room and document sharing
- 🔄 Calendar integration
- 🔄 Mobile app (React Native)

### Phase 3: Platform Expansion (Q2 2024)
- 🔄 Enterprise features for VCs
- 🔄 LP portal and reporting
- 🔄 API marketplace for integrations
- 🔄 White-label solutions

### Phase 4: Global Scale (Q3 2024)
- 🔄 Multi-region deployment
- 🔄 Advanced analytics and ML
- 🔄 Blockchain integration for deal verification
- 🔄 AI-powered due diligence assistant

## 📞 Support

### Getting Help
- **Documentation**: Comprehensive API docs at `/docs`
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discord**: Community chat for real-time support
- **Email**: support@matchmaking-platform.com

### Commercial Support
- **Enterprise Support**: 24/7 SLA with dedicated account manager
- **Custom Development**: Feature development and integration services
- **Training**: Platform onboarding and best practices workshops

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: GPT models for AI features
- **NestJS**: Framework for scalable backend architecture
- **Material-UI**: React component library
- **PostgreSQL + pgvector**: Vector database capabilities
- **Community**: Open source contributors and early adopters

---

**Built with ❤️ for the startup ecosystem**

For questions or feedback, reach out to the team or open an issue on GitHub.
