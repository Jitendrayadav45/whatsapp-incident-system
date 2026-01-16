# WhatsApp Incident Management System - Backend

## 📋 Overview
Brief description of your project - WhatsApp-based ticket/incident management system.

## 🚀 Features
- WhatsApp Integration via Webhook
- Admin Dashboard APIs
- Incident/Ticket Management
- Real-time Updates
- Health Monitoring

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **API:** RESTful APIs
- **Integration:** WhatsApp Business API

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- WhatsApp Business API credentials

### Steps
```bash
# Clone repository
git clone <your-repo-url>

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start server
npm start
```

## 🔧 Environment Variables
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.com
WHATSAPP_API_TOKEN=your_token
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Webhook
```
POST /webhook
```

### Admin Routes
```
GET /api/...
POST /api/...
```

## 🏗️ Project Structure
```
├── src/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   └── webhook.routes.js
│   ├── models/
│   ├── controllers/
│   └── utils/
├── server.js
└── package.json
```



# API Documentation

## Base URL
```
Development: http://localhost:3000
Production: https://your-api.com
```

## Authentication
Include details about JWT/API keys if applicable.

## Endpoints

### 1. Health Check
**GET** `/health`

Response:
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2026-01-16T10:00:00.000Z"
}
```

### 2. Webhook
**POST** `/webhook`

## 👨‍💻 Developer
- **Name:** Jitendra Yadav
- **GitHub:** https://github.com/Jitendrayadav45
- **LinkedIn:** https://www.linkedin.com/in/jitendrayadav00
