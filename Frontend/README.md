# WhatsApp Ticket Management - Frontend

A modern, production-ready React admin dashboard for managing WhatsApp-based ticketing system with real-time statistics, comprehensive ticket management, and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- 🎫 **Ticket Management** - Complete CRUD operations for ticket handling
- 📊 **Real-time Analytics** - Interactive charts and statistics dashboard
- 🏢 **Site Management** - Manage sites and sub-sites with validation
- 👥 **Admin Management** - Role-based admin user management
- 📱 **WhatsApp Integration** - QR code generation and WhatsApp connectivity
- 📈 **Ticket Reports** - Detailed reporting with filtering and export capabilities
- 🔐 **Authentication** - Secure JWT-based authentication system
- 🎨 **Modern UI/UX** - Clean, responsive interface with custom theming

### Technical Features
- ⚡ Fast development with Vite
- 🔄 Hot Module Replacement (HMR)
- 📱 Fully responsive design
- 🎯 Role-based route protection
- 🔍 Advanced filtering and search
- 📊 Data visualization with Recharts
- 🚀 Optimized production builds
- 🌐 Vercel deployment ready

## 🛠 Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 6.30.2
- **HTTP Client**: Axios 1.13.2
- **Charts**: Recharts 3.6.0
- **Linting**: ESLint 9.39.1
- **Deployment**: Vercel

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-ticket-backend/Frontend
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

## ⚙️ Environment Configuration

Create a `.env` file in the root of the Frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Environment
VITE_APP_ENV=development

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

### Environment Variables Description

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes | - |
| `VITE_APP_ENV` | Application environment | No | development |
| `VITE_ANALYTICS_ID` | Analytics tracking ID | No | - |

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Linting

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## 🏗 Build & Deployment

### Production Build

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

### Deployment to Vercel

The project is pre-configured for Vercel deployment:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

Or connect your repository to Vercel for automatic deployments.

### Manual Deployment

After building, deploy the `dist` folder to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service modules
│   │   ├── axios.js       # Axios configuration
│   │   ├── auth.api.js    # Authentication APIs
│   │   ├── admins.api.js  # Admin management APIs
│   │   ├── tickets.api.js # Ticket management APIs
│   │   ├── sites.api.js   # Site management APIs
│   │   └── stats.api.js   # Statistics APIs
│   │
│   ├── auth/              # Authentication context
│   │   ├── AuthContext.jsx
│   │   └── useAuth.js
│   │
│   ├── components/        # Reusable components
│   │   ├── admins/        # Admin-related components
│   │   ├── charts/        # Chart components
│   │   ├── common/        # Shared components (Button, Loader, etc.)
│   │   ├── layout/        # Layout components
│   │   ├── sites/         # Site management components
│   │   └── tickets/       # Ticket components
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useSites.js
│   │   ├── useStats.js
│   │   ├── useTickets.js
│   │   └── useTicketReports.js
│   │
│   ├── layouts/           # Page layouts
│   │   ├── AdminLayout.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── pages/             # Application pages
│   │   ├── auth/          # Login/Register pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── admins/        # Admin management pages
│   │   ├── tickets/       # Ticket management pages
│   │   ├── sites/         # Site management pages
│   │   ├── reports/       # Reporting pages
│   │   └── notFound/      # 404 page
│   │
│   ├── routes/            # Routing configuration
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleRoute.jsx
│   │
│   ├── styles/            # Global styles
│   │   ├── globals.css
│   │   └── theme.css
│   │
│   ├── utils/             # Utility functions
│   │   ├── constants.js
│   │   ├── formatAging.js
│   │   ├── formatDate.js
│   │   ├── roleUtils.js
│   │   ├── sidebarConfig.js
│   │   └── statusFlow.js
│   │
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Base styles
│
├── .env                   # Environment variables
├── .eslintrc.js          # ESLint configuration
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel configuration
└── vite.config.js        # Vite configuration
```

## 🎯 Key Features

### Dashboard
- Real-time ticket statistics
- Interactive pie and bar charts
- Quick action buttons
- Status overview

### Ticket Management
- Create, view, update, and track tickets
- Status flow management (Open → In Progress → Closed)
- Ticket aging and priority tracking
- Image attachment support
- Detailed ticket history
- Advanced filtering and search

### Site Management
- Site and sub-site hierarchy
- IOGP rule validation
- QR code generation for WhatsApp integration
- Site status management

### Admin Management
- User creation and management
- Role-based access control (Super Admin, Site Manager, Reporter)
- Permission management

### Reports & Analytics
- Comprehensive ticket reports
- Export functionality
- Date range filtering
- Status-based analytics

## 🔌 API Integration

The application integrates with the backend API through Axios. All API calls are centralized in the `src/api/` directory.

### API Configuration

Base API configuration is in [src/api/axios.js](src/api/axios.js):

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Available API Modules

- **auth.api.js** - Login, logout, token refresh
- **admins.api.js** - Admin CRUD operations
- **tickets.api.js** - Ticket operations
- **sites.api.js** - Site and sub-site management
- **stats.api.js** - Dashboard statistics
- **ticketReports.api.js** - Reporting data

## 🔐 Authentication & Authorization

### Authentication Flow

1. User logs in via [/login](src/pages/auth/LoginPage.jsx)
2. Backend returns JWT token
3. Token stored in localStorage
4. Token attached to all API requests via interceptor
5. Protected routes check authentication status

### Role-Based Access Control

The application supports three user roles:

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full system access, admin management |
| **Site Manager** | Site and ticket management |
| **Reporter** | View-only access, generate reports |

### Route Protection

Routes are protected using two mechanisms:

1. **ProtectedRoute** - Requires authentication
2. **RoleRoute** - Requires specific role

Example:
```jsx
<Route element={<ProtectedRoute />}>
  <Route element={<RoleRoute allowedRoles={['superadmin']} />}>
    <Route path="/admins" element={<AdminsPage />} />
  </Route>
</Route>
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

- Follow the existing code style
- Run ESLint before committing: `npm run lint`
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

### Commit Message Convention

```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(tickets): add bulk status update feature

- Added checkbox selection
- Implemented bulk update API call
- Updated UI for better UX

Closes #123
```

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## 📞 Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for blazing fast development experience
- Recharts for beautiful visualizations
- All contributors to this project

---

**Built with ❤️ by [Jitendra Yadav] https://github.com/Jitendrayadav45 **
