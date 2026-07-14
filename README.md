# QueryMind 🚀

An AI-powered intelligent chat application that enables users to ask questions and receive real-time, contextually aware responses with internet search capabilities. Built with a modern full-stack architecture, QueryMind combines LLM technology with real-time communication for seamless user interactions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Real-time Features](#real-time-features)
- [Authentication](#authentication)
- [Database Models](#database-models)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

QueryMind is a full-stack web application that leverages AI models (Gemini & Mistral) through LangChain to provide intelligent responses. The platform includes:

- **Real-time Chat**: WebSocket-based messaging for instant communication
- **Internet Search Integration**: Access to current information via Tavily search API
- **AI-Powered Responses**: Multiple LLM options with context awareness
- **User Authentication**: Email verification and JWT-based auth
- **Email Notifications**: Nodemailer integration for account verification
- **Modern UI**: React-based frontend with Tailwind CSS and Redux state management

---

## Features

### 🤖 AI & Intelligence
- **Multiple LLM Support**: Gemini 1.5 Flash and Mistral small models
- **Context-Aware Responses**: Maintains conversation history for better context
- **Internet Search Integration**: Real-time web search using Tavily API
- **Intelligent Tool Usage**: Automatic tool selection for search and response generation

### 💬 Chat & Communication
- **Real-time Messaging**: WebSocket support via Socket.IO
- **Message History**: Persistent chat storage with MongoDB
- **Multi-user Support**: Isolated chats per user
- **Conversation Context**: Maintains up to 14 recent messages for context

### 🔐 Security & Authentication
- **Email Verification**: Two-step signup process with email confirmation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Middleware-based endpoint protection
- **CORS Configuration**: Flexible CORS setup for multiple origins

### 📧 User Management
- **User Registration**: Unique username and email validation
- **Email Verification**: Verification emails with JWT tokens
- **Email Resend**: Option to resend verification emails
- **Account Profile**: User profile management and retrieval

### 🎨 Frontend Features
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **State Management**: Redux Toolkit for predictable state management
- **Protected Routes**: Route guards for authenticated users
- **Real-time Socket Connection**: Live chat updates
- **Auth Persistence**: Automatic login state management

---

## Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js & Express** | REST API server and request handling |
| **MongoDB & Mongoose** | Database and ODM for data persistence |
| **Socket.IO** | Real-time bidirectional communication |
| **LangChain** | LLM orchestration and agent framework |
| **Gemini & Mistral API** | AI model providers |
| **Tavily** | Internet search API |
| **JWT & bcryptjs** | Authentication and password hashing |
| **Nodemailer** | Email sending service |
| **Express Validator & Zod** | Request validation |
| **CORS & Morgan** | Middleware for security and logging |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library and component framework |
| **Vite** | Fast build tool and dev server |
| **Redux Toolkit** | State management |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Socket.IO Client** | Real-time communication client |
| **Tailwind CSS** | Utility-first CSS framework |
| **ESLint** | Code quality and linting |

---

## Project Structure

```
QueryMind/
├── Backend/                          # Node.js Express Server
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Authentication logic
│   │   │   └── chat.controller.js   # Chat operations
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js   # JWT verification middleware
│   │   ├── modules/                 # MongoDB Models
│   │   │   ├── user.model.js        # User schema & methods
│   │   │   ├── chat.model.js        # Chat/conversation schema
│   │   │   └── message.model.js     # Message schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Auth endpoints
│   │   │   └── chat.route.js        # Chat endpoints
│   │   ├── services/
│   │   │   ├── ai.service.js        # LLM & agent logic
│   │   │   ├── internet.service.js  # Web search functionality
│   │   │   └── mail.service.js      # Email sending logic
│   │   ├── sockets/
│   │   │   └── server.socket.js     # Socket.IO event handlers
│   │   └── validators/
│   │       └── auth.validator.js    # Request validation schemas
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── Frontend/                         # React + Vite Application
│   ├── src/
│   │   ├── main.jsx                 # React entry point
│   │   ├── app/
│   │   │   ├── App.jsx              # Root component
│   │   │   ├── auth.routes.jsx      # Route definitions
│   │   │   ├── app.store.jsx        # Redux store setup
│   │   │   └── index.css            # Global styles & Tailwind
│   │   └── features/
│   │       ├── auth/                # Authentication feature
│   │       │   ├── auth.slice.js    # Auth Redux reducer
│   │       │   ├── hook/
│   │       │   │   └── useAuth.js   # Custom auth hook
│   │       │   ├── pages/
│   │       │   │   ├── Login.jsx
│   │       │   │   ├── Register.jsx
│   │       │   │   ├── Home.jsx
│   │       │   │   └── VerifyPending.jsx
│   │       │   ├── service/
│   │       │   │   └── auth.api.js
│   │       │   └── Components/
│   │       │       └── Protected.jsx # Route protection component
│   │       └── chat/                # Chat feature
│   │           ├── api/
│   │           │   └── chat.api.js
│   │           ├── hooks/
│   │           │   └── useChat.js
│   │           ├── model/
│   │           │   └── chat.mapper.js
│   │           ├── pages/
│   │           │   └── Dashboard.jsx
│   │           ├── service/
│   │           │   └── chat.socket.js
│   │           └── state/
│   │               ├── chat.slice.js
│   │               └── useChatState.js
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── package.json                     # Root package (CORS dependency)
```

---

## Prerequisites

- **Node.js** v16+ and **npm/yarn**
- **MongoDB** instance (local or cloud-based like MongoDB Atlas)
- **API Keys** for:
  - Google Gemini API
  - Mistral API
  - Tavily Search API
  - Gmail OAuth (for email sending)
- **Git** for version control

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd QueryMind
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### 4. Configure Environment Variables

Create `.env` file in the `Backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT
JWT_SECRET=your-secret-key-here

# API Keys
GEMINI_API_KEY=your-gemini-api-key
MISTRAL_API_KEY=your-mistral-api-key
TAVILY_API_KEY=your-tavily-api-key

# Email Configuration (Gmail OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_USER=your-email@gmail.com

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | Any random string |
| `GEMINI_API_KEY` | Google Gemini API key | From Google AI Studio |
| `MISTRAL_API_KEY` | Mistral AI API key | From Mistral platform |
| `TAVILY_API_KEY` | Tavily search API key | From Tavily dashboard |
| `GOOGLE_CLIENT_ID` | Gmail OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Gmail OAuth secret | From Google Cloud Console |
| `GOOGLE_REFRESH_TOKEN` | Gmail refresh token | Generated via OAuth flow |
| `GOOGLE_USER` | Gmail account email | `your-email@gmail.com` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

---

## Running the Application

### Backend

```bash
cd Backend

# Development (with nodemon for auto-reload)
npm run dev

# Production
npm start
```

**Backend runs on:** `http://localhost:3000`

### Frontend

```bash
cd Frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

**Frontend runs on:** `http://localhost:5173`

### Running Both Concurrently

From root directory (if you have a root script), or open two terminals:

**Terminal 1 - Backend:**
```bash
cd Backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend && npm run dev
```

---

## API Endpoints

### Authentication Endpoints

All auth endpoints are prefixed with `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|------------------|
| POST | `/register` | Register a new user | ❌ |
| GET | `/verify-email` | Verify email with token | ❌ |
| POST | `/login` | Login and receive JWT | ❌ |
| POST | `/resend-email` | Resend verification email | ❌ |
| GET | `/me` | Get current user profile | ✅ |

### Chat Endpoints

All chat endpoints are prefixed with `/api/chat`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|------------------|
| POST | `/` | Create new chat | ✅ |
| GET | `/` | Get all user chats | ✅ |
| GET | `/:chatId` | Get chat details | ✅ |
| POST | `/:chatId/message` | Send message to chat | ✅ |
| GET | `/:chatId/messages` | Get chat messages | ✅ |

### Request/Response Examples

**Register:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Login:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Send Message:**
```json
{
  "content": "What is the capital of France?"
}
```

---

## Real-time Features

### WebSocket Events (Socket.IO)

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `{ chatId, content }` | Send a new message |
| `typing` | `{ chatId }` | Indicate user is typing |
| `join_chat` | `{ chatId }` | Join a chat room |
| `leave_chat` | `{ chatId }` | Leave a chat room |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `{ _id, content, role, timestamp }` | Receive new message |
| `ai_response` | `{ _id, content, role, timestamp }` | AI generates response |
| `typing` | `{ userId }` | User is typing |
| `error` | `{ message }` | Error occurred |

### Socket Connection Setup (Frontend)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

---

## Authentication

### Authentication Flow

1. **Registration**
   - User submits username, email, and password
   - Password is hashed using bcryptjs
   - User is created with `verified: false`
   - Verification email is sent with JWT token

2. **Email Verification**
   - User clicks verification link with JWT token
   - Token is verified using JWT_SECRET
   - User account is marked as `verified: true`

3. **Login**
   - User submits email and password
   - Password is compared with stored hash
   - JWT token is issued and stored in httpOnly cookie
   - User is redirected to dashboard

4. **Protected Routes**
   - Every protected request includes JWT in cookie
   - Middleware verifies JWT before processing
   - Invalid/expired tokens return 401 Unauthorized

### JWT Structure

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## Database Models

### User Model

```javascript
{
  username: String (required, unique),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  verified: Boolean (default: false),
  lastEmailSentAt: Date (null),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Chat Model

```javascript
{
  userId: ObjectId (reference to User),
  title: String,
  description: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Message Model

```javascript
{
  chatId: ObjectId (reference to Chat),
  role: String (enum: "user", "ai"),
  content: String (required),
  timestamp: Date (auto),
  createdAt: Date (auto)
}
```

---

## Key Features Explained

### AI Service Architecture

The AI service (`ai.service.js`) implements:

- **LangChain Integration**: Agent-based approach for tool calling
- **Multiple Models**: Gemini for responses, Mistral for agent orchestration
- **Internet Search Tool**: Automatically searches web when needed
- **Context Window**: Maintains last 14 messages for context awareness
- **System Prompt**: Instructs AI to use tools for current information

### Email Service

The mail service (`mail.service.js`) provides:

- **Gmail OAuth**: Secure authentication with Google
- **Template Support**: Customizable email templates
- **Error Handling**: Graceful failure with detailed logging
- **Rate Limiting**: Prevents email spam

### Socket.IO Implementation

Real-time features through Socket.IO:

- **Room-based Isolation**: Each chat is a separate room
- **Event Broadcasting**: Messages broadcast to chat participants
- **Connection Management**: Automatic reconnection handling
- **Typing Indicators**: Real-time typing status

---

## Troubleshooting

### Backend Issues

#### Server won't start - EADDRINUSE

**Problem**: Port 3000 is already in use

**Solution:**
```bash
# Option 1: Kill existing process
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use different port
PORT=3001 npm run dev
```

#### MongoDB Connection Error

**Problem**: Cannot connect to MongoDB

**Checklist:**
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB is running (local) or accessible (Atlas)
- Verify IP whitelist if using MongoDB Atlas
- Check network connectivity

#### Email verification emails not sending

**Problem**: Verification emails not received

**Solution:**
- Verify `GOOGLE_*` env variables have no leading/trailing whitespace
- Check Gmail app-specific password is generated
- Ensure 2FA is enabled on Gmail account
- Check spam/junk folders

#### AI API errors

**Problem**: Gemini/Mistral API errors

**Solution:**
- Verify API keys are correct and active
- Check API quota/billing status
- Ensure API key has appropriate permissions
- Verify request format and rate limits

### Frontend Issues

#### Blank page on load

**Problem**: Frontend won't load

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### WebSocket connection fails

**Problem**: Real-time features not working

**Solution:**
- Verify `CORS_ORIGIN` includes frontend URL
- Check backend is running on correct port
- Verify firewall allows WebSocket connections
- Check browser console for specific errors

#### Redux state not persisting

**Problem**: Auth state lost on refresh

**Solution:**
- Verify Redux store is properly configured
- Check localStorage/sessionStorage is enabled
- Verify Redux middleware setup

### General Debugging

**Enable detailed logging:**
```bash
# Backend
DEBUG=* npm run dev

# Frontend (in console)
localStorage.debug = 'socket.io-client:*'
```

**Check network requests:**
- Open browser DevTools (F12)
- Go to Network tab
- Check API calls and WebSocket connections
- Review Response status and headers

---

## Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes and test thoroughly
3. Commit with clear messages: `git commit -m "feat: add feature-name"`
4. Push to branch: `git push origin feature/feature-name`
5. Submit a Pull Request

### Code Standards

- Use ES6+ syntax
- Follow existing code structure and naming conventions
- Add comments for complex logic
- Test features before submitting
- Keep commits atomic and well-documented

### Testing

```bash
# Backend (when tests are set up)
npm test

# Frontend linting
npm run lint
```

---

## Performance Optimization

### Frontend
- **Code Splitting**: React Router enables route-based code splitting
- **State Management**: Redux prevents unnecessary re-renders
- **Asset Optimization**: Vite handles asset bundling efficiently
- **CSS Framework**: Tailwind CSS is tree-shaked for minimal bundle size

### Backend
- **Database Indexing**: Optimize MongoDB queries with proper indexes
- **Caching**: Consider implementing Redis for session/message caching
- **API Rate Limiting**: Implement rate limiting to prevent abuse
- **Connection Pooling**: MongoDB connection pool configured automatically

---

## Security Best Practices

✅ Implemented:
- Password hashing with bcryptjs
- JWT-based authentication
- CORS protection
- Environment variable security
- Input validation with Zod
- Email verification requirement

🔒 Recommended:
- Enable HTTPS in production
- Implement rate limiting on APIs
- Use secure cookies with httpOnly flag
- Implement CSRF protection
- Add request logging and monitoring
- Regular security audits

---

## Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in deployment platform
2. Ensure MongoDB Atlas access is configured
3. Update `CORS_ORIGIN` to production frontend URL
4. Deploy main branch

### Frontend Deployment (Vercel/Netlify)

1. Update API endpoint to production backend
2. Build: `npm run build`
3. Deploy `dist` folder
4. Configure environment variables if needed

---

## Support & Resources

- **LangChain Docs**: https://js.langchain.com/
- **Socket.IO Docs**: https://socket.io/docs/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/

---

## License

ISC

---

## Author

QueryMind Development Team

---

**Last Updated**: 2024
**Version**: 1.0.0
