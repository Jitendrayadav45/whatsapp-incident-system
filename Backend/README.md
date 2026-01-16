# WhatsApp Ticket Management - Backend API

A robust, production-ready Node.js backend API for WhatsApp-based ticket management system with real-time webhook integration, AI-powered content moderation, media handling, and comprehensive admin management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [WhatsApp Integration](#whatsapp-integration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Monitoring & Logging](#monitoring--logging)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- 🎫 **Ticket Management** - Complete CRUD operations with status tracking
- 📱 **WhatsApp Integration** - Real-time webhook handling and message processing
- 🤖 **AI Content Moderation** - Google Generative AI & OpenRouter integration for safety checks
- 🖼️ **Media Handling** - Cloudinary integration for image uploads and processing
- 👥 **Admin Management** - Role-based access control (Super Admin, Site Manager, Reporter)
- 🏢 **Site Management** - Multi-site and sub-site support with IOGP validation
- 📊 **Statistics & Reports** - Comprehensive ticket analytics and reporting
- 🔐 **Authentication** - JWT-based secure authentication system

### Technical Features
- ⚡ Express.js 5.2.1 for high performance
- 🗄️ MongoDB with Mongoose ODM
- 🔒 Bcrypt password hashing
- 🌐 CORS configuration for cross-origin requests
- 📦 Session caching for optimization
- 🔄 Webhook retry mechanism
- 📝 QR code generation for WhatsApp linking
- 🛡️ Input validation and sanitization

## 🛠 Tech Stack

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 7.0.0 with Mongoose 9.0.2
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **AI Integration**: 
  - Google Generative AI 0.24.1
  - OpenRouter SDK 0.3.11
- **Media Storage**: Cloudinary 1.41.0
- **QR Generation**: qrcode 1.5.4
- **HTTP Client**: Axios 1.13.2
- **Environment**: dotenv 17.2.3
- **Dev Tools**: nodemon 3.1.11

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **MongoDB** >= 6.0 (Atlas or local installation)
- **Git**

### External Services Required

- **MongoDB Atlas** account or local MongoDB instance
- **Cloudinary** account for media storage
- **Google AI** API key for content moderation
- **OpenRouter** API key (optional, for additional AI features)
- **WhatsApp Business API** access (for production)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-ticket-backend/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Configuration](#environment-configuration))

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## ⚙️ Environment Configuration

Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp-tickets?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Services
GOOGLE_API_KEY=your-google-ai-api-key
OPENROUTER_API_KEY=your-openrouter-api-key

# WhatsApp Configuration
WHATSAPP_API_URL=https://api.whatsapp.com/v1
WHATSAPP_API_TOKEN=your-whatsapp-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WEBHOOK_VERIFY_TOKEN=your-webhook-verify-token

# Application Settings
MAX_FILE_SIZE=10485760
TICKET_ID_PREFIX=TKT
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=SecurePassword123!
```

### Environment Variables Description

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | Yes | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | 7d |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | Yes | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `GOOGLE_API_KEY` | Google AI API key | Yes | - |
| `OPENROUTER_API_KEY` | OpenRouter API key | No | - |
| `WHATSAPP_API_TOKEN` | WhatsApp API token | Yes | - |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID | Yes | - |
| `WEBHOOK_VERIFY_TOKEN` | Webhook verification token | Yes | - |

## 🗄️ Database Setup

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas account** at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a new cluster**
   - Choose your preferred cloud provider and region
   - Select a tier (M0 free tier for development)

3. **Create a database user**
   - Go to Database Access
   - Add a new user with read/write permissions
   - Save the username and password

4. **Whitelist IP addresses**
   - Go to Network Access
   - Add your IP address or allow access from anywhere (0.0.0.0/0) for development

5. **Get connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and update `MONGODB_URI` in `.env`

### Local MongoDB Setup

```bash
# Install MongoDB locally (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/whatsapp-tickets
```

### Database Seeding

Run the seed script to populate the database with initial data:

```bash
npm run seed
```

This will create:
- Default admin user
- Sample sites and sub-sites
- Test tickets for development

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` with auto-reload on file changes.

### Start Production Server

```bash
npm start
```

### Run Database Seed

```bash
npm run seed
```

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000
Production: https://your-api-domain.com
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication

```
POST   /admin/auth/login              - Admin login
POST   /admin/auth/register           - Register new admin (superadmin only)
POST   /admin/auth/logout             - Logout
GET    /admin/auth/me                 - Get current admin details
```

#### Admin Management

```
GET    /admin/admins                  - Get all admins (superadmin only)
POST   /admin/admins                  - Create new admin (superadmin only)
GET    /admin/admins/:id              - Get admin by ID
PUT    /admin/admins/:id              - Update admin
DELETE /admin/admins/:id              - Delete admin (superadmin only)
```

#### Ticket Management

```
GET    /admin/tickets                 - Get all tickets (with filters)
GET    /admin/tickets/:id             - Get ticket by ID
POST   /admin/tickets                 - Create new ticket
PUT    /admin/tickets/:id             - Update ticket
DELETE /admin/tickets/:id             - Delete ticket
PATCH  /admin/tickets/:id/status      - Update ticket status
GET    /admin/tickets/stats           - Get ticket statistics
```

#### Site Management

```
GET    /admin/sites                   - Get all sites
GET    /admin/sites/:id               - Get site by ID
POST   /admin/sites                   - Create new site
PUT    /admin/sites/:id               - Update site
DELETE /admin/sites/:id               - Delete site
GET    /admin/sites/:id/subsites      - Get sub-sites for a site
POST   /admin/sites/:id/subsites      - Create sub-site
```

#### QR Code Management

```
GET    /admin/qr/:siteId              - Get QR code for site
POST   /admin/qr/generate             - Generate new QR code
```

#### Statistics & Reports

```
GET    /admin/stats/dashboard         - Get dashboard statistics
GET    /admin/stats/tickets           - Get ticket analytics
GET    /admin/reports/tickets         - Get detailed ticket reports
GET    /admin/reports/export          - Export reports (CSV/PDF)
```

#### WhatsApp Webhook

```
GET    /webhook                       - Webhook verification
POST   /webhook                       - Receive WhatsApp messages
```

### API Response Format

#### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 📁 Project Structure

```
Backend/
├── scripts/
│   └── seed.js                    # Database seeding script
│
├── src/
│   ├── cache/
│   │   └── siteSession.cache.js   # Session caching for optimization
│   │
│   ├── config/
│   │   └── db.js                  # MongoDB connection configuration
│   │
│   ├── constants/
│   │   └── iogpRules.js           # IOGP validation rules
│   │
│   ├── controllers/
│   │   ├── adminAuth.controller.js        # Authentication logic
│   │   ├── adminManagement.controller.js  # Admin CRUD operations
│   │   ├── adminQR.controller.js          # QR code generation
│   │   ├── adminSites.controller.js       # Site management
│   │   ├── adminSubSites.controller.js    # Sub-site management
│   │   ├── adminStats.controller.js       # Statistics
│   │   ├── adminTicketReports.controller.js # Reporting
│   │   ├── adminTickets.controller.js     # Ticket operations
│   │   ├── adminTicketStatus.controller.js # Status management
│   │   └── webhook.controller.js          # WhatsApp webhook handler
│   │
│   ├── messages/
│   │   └── whatsappMessages.js    # WhatsApp message templates
│   │
│   ├── middlewares/
│   │   └── adminAuth.middleware.js # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── admin.model.js         # Admin schema
│   │   ├── site.model.js          # Site schema
│   │   ├── subSite.model.js       # Sub-site schema
│   │   ├── ticket.model.js        # Ticket schema
│   │   └── ticketReport.model.js  # Report schema
│   │
│   ├── routes/
│   │   ├── admin.routes.js        # Admin API routes
│   │   └── webhook.routes.js      # Webhook routes
│   │
│   ├── services/
│   │   ├── adminAuth.service.js      # Authentication service
│   │   ├── cloudinary.service.js     # Cloudinary integration
│   │   ├── safetyAI.service.js       # AI content moderation
│   │   ├── siteValidation.service.js # Site validation
│   │   ├── ticket.service.js         # Ticket business logic
│   │   ├── whatsapp.service.js       # WhatsApp API integration
│   │   └── whatsappMedia.service.js  # Media handling
│   │
│   └── utils/
│       ├── hash.util.js           # Password hashing utilities
│       ├── qr.generator.js        # QR code generation
│       ├── roleGuard.js           # Role-based access control
│       ├── site.parser.js         # Site data parsing
│       └── ticketId.generator.js  # Unique ticket ID generation
│
├── test-ticket.js                 # Ticket creation test script
├── test-webhook.js                # Webhook testing script
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── README.md                      # This file
└── server.js                      # Application entry point
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Role-Based Access Control**: Three-tier permission system
- **Token Expiration**: Configurable token lifetime

### Data Protection
- **Input Validation**: Sanitization of all user inputs
- **CORS Configuration**: Whitelist-based origin control
- **Environment Variables**: Sensitive data protection
- **SQL Injection Prevention**: Mongoose parameterized queries

### AI Content Moderation
- **Automatic Image Scanning**: Google AI for safety checks
- **Profanity Detection**: Text content moderation
- **Inappropriate Content Blocking**: Multi-level safety filters

### Rate Limiting
Implement rate limiting for production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📱 WhatsApp Integration

### Webhook Setup

1. **Configure WhatsApp Business API**
   - Get your Phone Number ID
   - Generate access token
   - Set webhook URL: `https://your-domain.com/webhook`

2. **Webhook Verification**
   ```bash
   GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
   ```

3. **Message Handling**
   - Receives incoming messages
   - Processes images and text
   - Creates tickets automatically
   - Sends acknowledgment messages

### Message Flow

1. User sends message to WhatsApp Business number
2. WhatsApp webhook forwards message to `/webhook`
3. Backend validates and processes message
4. AI checks content for safety
5. Ticket created in database
6. Confirmation sent back to user

### Supported Message Types

- ✅ Text messages
- ✅ Image attachments
- ✅ Location data
- ⏳ Document files (coming soon)
- ⏳ Audio messages (coming soon)

## 🚀 Deployment

### Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure production MongoDB URI
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Implement rate limiting
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CDN for media (Cloudinary)

### Deployment Options

#### 1. Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### 2. AWS EC2

```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Clone repository
git clone <repository-url>
cd whatsapp-ticket-backend/Backend

# Install dependencies
npm install --production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "whatsapp-api"
pm2 startup
pm2 save
```

#### 3. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t whatsapp-api .
docker run -p 5000:5000 --env-file .env whatsapp-api
```

#### 4. DigitalOcean App Platform

1. Connect your GitHub repository
2. Select Backend directory
3. Add environment variables
4. Deploy with one click

### Reverse Proxy with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Configuration

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 🧪 Testing

### Manual Testing Scripts

Test ticket creation:
```bash
node test-ticket.js
```

Test webhook:
```bash
node test-webhook.js
```

### API Testing with cURL

```bash
# Login
curl -X POST http://localhost:5000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get tickets
curl -X GET http://localhost:5000/admin/tickets \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create ticket
curl -X POST http://localhost:5000/admin/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test ticket"}'
```

### Automated Testing (TODO)

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📊 Monitoring & Logging

### Console Logging

The application uses structured console logging:

```javascript
console.log('✅ Success message');
console.error('❌ Error message');
console.warn('⚠️  Warning message');
console.info('ℹ️  Info message');
```

### Production Logging

Recommended tools:
- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring

Example Winston setup:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check Endpoint

Add a health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards

- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Handle errors properly with try-catch
- Use async/await over callbacks
- Write descriptive commit messages

### Commit Message Convention

```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore, security

**Example**:
```
feat(tickets): add bulk status update endpoint

- Implemented new route for bulk updates
- Added validation for status transitions
- Updated controller and service layer

Closes #456
```

### Pull Request Guidelines

- Update README if needed
- Add tests for new features
- Ensure all tests pass
- Update API documentation
- Follow existing code style
- Keep PRs focused and atomic

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

**Note**: The license and license text may be updated in the future.

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check connection string
# Ensure IP is whitelisted in MongoDB Atlas
# Verify network connectivity
```

**JWT Token Invalid**
```bash
# Check JWT_SECRET is set correctly
# Verify token expiration time
# Clear old tokens from client
```

**Webhook Not Receiving Messages**
```bash
# Verify webhook URL is publicly accessible
# Check WEBHOOK_VERIFY_TOKEN matches WhatsApp settings
# Review webhook logs
```

**Cloudinary Upload Failed**
```bash
# Verify API credentials
# Check file size limits
# Ensure proper permissions
```

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- WhatsApp Business API team
- Google AI and OpenRouter for AI services
- Cloudinary for media management
- All contributors to this project

## 📈 Roadmap

- [ ] Add automated tests (Jest, Supertest)
- [ ] Implement WebSocket for real-time updates
- [ ] Add Redis caching layer
- [ ] Create admin notification system
- [ ] Add email notification service
- [ ] Implement advanced analytics
- [ ] Add bulk operations API
- [ ] Create backup and restore functionality
- [ ] Add API versioning
- [ ] Implement GraphQL endpoint

---

**Built with ❤️ for efficient incident management**

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Node.js**: >= 18.0.0  
**License**: Proprietary
