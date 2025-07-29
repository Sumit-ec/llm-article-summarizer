# AI-Powered Knowledge Hub

A modern web application for creating, managing, and summarizing articles with AI-powered content analysis. Built with a full-stack architecture featuring role-based authentication, responsive design, and intelligent content processing.

## 🚀 Features

### Core Functionality
- **Article Management**: Create, edit, view, and delete articles with rich text content
- **AI-Powered Summarization**: Generate intelligent summaries using OpenAI GPT-3.5
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **PDF Export**: Export articles as formatted PDF documents
- **Pagination**: Efficient article browsing with smart pagination controls

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Real-time Updates**: Dynamic UI updates based on authentication state
- **Theme Switching**: Light and dark mode support
- **Error Handling**: Comprehensive error handling and user feedback
- **Docker Support**: Containerized deployment with Docker Compose

## 🏗️ Architecture

### Technology Stack
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Next.js (React) with modern JavaScript
- **Authentication**: JWT with role-based access control
- **AI Integration**: OpenAI GPT-3.5 for content summarization
- **Styling**: CSS with CSS variables for theming
- **Deployment**: Docker with Docker Compose

### Project Structure
```
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication & authorization
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic (LLM integration)
│   │   └── utils/           # Utility functions
│   └── Dockerfile
├── frontend/                # Next.js React application
│   ├── components/          # Reusable UI components
│   ├── pages/               # Next.js pages
│   ├── styles/              # Global CSS styles
│   ├── utils/               # Client-side utilities
│   └── Dockerfile
└── docker-compose.yml       # Multi-container setup
```

## 🛠️ Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (handled by Docker)

### 1. Environment Configuration

#### Backend Environment
Create `backend/.env`:
```env
# Database Configuration
MONGODB_URI=mongodb://mongo:27017/knowledge_hub

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# LLM Provider Configuration
LLM_PROVIDER=openai  # or 'mock' for development
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend Environment
Create `frontend/.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Knowledge Hub
```

### 2. LLM Provider Setup

#### Option A: OpenAI (Production)
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set `LLM_PROVIDER=openai` and add your API key
3. Features: Real AI summaries, production-ready

#### Option B: Mock (Development)
1. Set `LLM_PROVIDER=mock` in backend environment
2. Features: No API costs, suitable for development/testing

### 3. Docker Deployment

#### Quick Start
```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

#### Development Mode
```bash
# Start with volume mounts for live reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Authenticate user and get JWT token

### Article Management
- `POST /articles` - Create new article (requires auth)
- `GET /articles` - List articles with pagination (requires auth)
- `GET /articles/:id` - Get specific article (requires auth)
- `PUT /articles/:id` - Update article (owner or admin only)
- `DELETE /articles/:id` - Delete article (admin only)
- `POST /articles/:id/summarize` - Generate AI summary (requires auth)

### User Management
- `GET /users` - List all users (admin only)

### Request/Response Examples

#### Create Article
```json
POST /articles
Authorization: Bearer <jwt_token>
{
  "title": "Article Title",
  "content": "Article content...",
  "tags": ["tag1", "tag2"]
}
```

#### Get Articles with Pagination
```json
GET /articles?page=1&limit=5
Authorization: Bearer <jwt_token>

Response:
{
  "articles": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalArticles": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can create, edit own articles, view all articles
- **Admin**: Full access including user management and article deletion

### JWT Token Structure
```json
{
  "id": "user_id",
  "username": "username",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234654321
}
```

### Protected Routes
- All article endpoints require valid JWT token
- Admin-only endpoints check role in middleware
- Owner-based permissions for article editing

## 🎨 User Interface

### Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Theme Support**: Light and dark mode with persistent preference
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: User-friendly error messages and validation
- **Accessibility**: Semantic HTML and keyboard navigation

### Components
- **NavBar**: Main navigation with theme toggle and user menu
- **ProtectedRoute**: Authentication wrapper for protected pages
- **Dashboard**: Article management with pagination and actions
- **Article Forms**: Create and edit article interfaces

## 🤖 AI Integration

### Summarization Features
- **OpenAI Integration**: Uses GPT-3.5-turbo for intelligent summaries
- **Configurable**: Easy to switch between providers via environment
- **Error Handling**: Graceful fallbacks for API failures
- **Caching**: Summaries are stored with articles for performance

### Usage
1. Create or view an article
2. Click "Generate Summary" button
3. AI processes content and generates concise summary
4. Summary is saved with the article for future reference

## 📦 Development

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Code Structure
- **Controllers**: Handle HTTP requests and responses
- **Middleware**: Authentication and authorization logic
- **Models**: MongoDB schema definitions
- **Services**: Business logic (LLM integration)
- **Utils**: Helper functions and utilities

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Production Setup
1. Configure environment variables for production
2. Set up MongoDB connection string
3. Configure OpenAI API key
4. Build and deploy with Docker

### Environment Variables
- `NODE_ENV=production`
- `MONGODB_URI`: Production MongoDB connection
- `JWT_SECRET`: Strong secret for JWT signing
- `OPENAI_API_KEY`: Valid OpenAI API key

## 📝 Notes

### Security Considerations
- JWT tokens expire after 24 hours
- Passwords are hashed using bcrypt
- Role-based access control on all endpoints
- Input validation and sanitization

### Performance
- Pagination for large article lists
- Efficient database queries with indexing
- Client-side caching for theme preferences
- Optimized bundle sizes with Next.js

### Scalability
- Containerized architecture for easy scaling
- Stateless API design
- Database connection pooling
- Modular code structure for easy maintenance

---

**Built with ❤️ using modern web technologies** 