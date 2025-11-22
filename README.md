# 🎯 QR Card Dating App - Complete System Documentation

> A full-stack QR code-based dating application with React frontend, NestJS backend, and comprehensive admin management system.

## 📖 Table of Contents

- [🌟 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔄 System Flow](#-system-flow)
- [🔐 Authentication System](#-authentication-system)
- [🎯 User Journey](#-user-journey)
- [👨‍💼 Admin Dashboard](#-admin-dashboard)
- [💳 Payment System](#-payment-system)
- [🔗 QR Code System](#-qr-code-system)
- [📱 Frontend Routes](#-frontend-routes)
- [🔌 API Endpoints](#-api-endpoints)
- [🗄️ Database Schema](#️-database-schema)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing](#-testing)
- [🔧 Development](#-development)
- [📦 Deployment](#-deployment)

## 🌟 Project Overview

**QR Card Dating App** is a modern dating platform that uses physical QR cards to facilitate real-world connections. Users create profiles, receive physical QR cards, and share them in person to initiate connections.

### Key Concept

- Users pay a setup fee and create dating profiles
- Admin reviews and approves profiles
- Approved users receive physical QR cards (50 cards per user)
- People scan QR codes to view profiles and express interest
- Mutual interest leads to contact sharing

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  NestJS Backend │    │  PostgreSQL DB  │
│                 │    │                 │    │                 │
│  • Admin Panel  │◄──►│  • REST API     │◄──►│  • Prisma ORM   │
│  • User Portal  │    │  • JWT Auth     │    │  • 9 Core Models│
│  • Public Pages │    │  • Stripe API   │    │  • Relationships│
│  • QR Scanner   │    │  • Email System │    │  • Migrations   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### 🔐 **Authentication & Security**

- JWT-based authentication with role-based access control
- Cookie and Redux state synchronization
- Admin and user separate login flows
- Password reset with email verification
- Protected routes with role guards

### 👤 **Profile Management**

- Multi-step profile creation with photo uploads
- Admin review and approval workflow
- Profile status tracking (draft → pending → approved/rejected)
- Email notifications for status changes

### 🔗 **QR Code System**

- Unique QR code generation (50 cards per user)
- Scan tracking with IP-based limitations (5 scans per IP)
- Real-time scan analytics
- QR code deactivation and management

### 👨‍💼 **Admin Dashboard**

- Comprehensive user management
- Profile review and approval system
- Email template builder with variables
- Analytics and reporting
- Notification system
- Dummy user creation for testing

### 💳 **Payment Integration**

- Stripe payment processing
- $69 setup fee for profile creation
- $13/month or $120/year subscription plans
- Payment history and subscription management

### 📧 **Email System**

- Dynamic email template builder
- Variable substitution system
- Automated notifications (approval, rejection, etc.)
- Test email functionality

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19.1.1 with Vite
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router v6 with role-based guards
- **Styling**: TailwindCSS with custom components
- **UI Components**: Lucide React icons, Custom modals
- **Payment**: Stripe React components
- **QR Generation**: qrcode.react library
- **HTTP Client**: Axios with interceptors

### Backend

- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt password hashing
- **File Upload**: Multer (multipart/form-data)
- **Validation**: class-validator + class-transformer
- **Payment**: Stripe API integration
- **Email**: Nodemailer with template system
- **QR Generation**: qrcode library

## 📁 Project Structure

```
Stuart/
├── api/                           # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                  # 🔐 Authentication & JWT
│   │   ├── admin/                 # 👨‍💼 Admin dashboard & management
│   │   ├── profile/               # 👤 Profile CRUD & photo uploads
│   │   ├── qr-card/              # 🔗 QR generation & scanning
│   │   ├── payment/              # 💳 Stripe integration
│   │   ├── email/                # 📧 Email templates & sending
│   │   ├── contact/              # 📞 Contact request handling
│   │   └── user/                 # 👥 User profile management
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   └── uploads/                  # Photo storage
│
├── cli/                          # Frontend (React)
│   ├── src/
│   │   ├── components/           # 🧩 Reusable UI components
│   │   ├── features/             # 🔄 Redux slices & API calls
│   │   ├── layout/               # 📐 Layout components (Admin, Auth, Main)
│   │   ├── page/                 # 📄 Page components
│   │   │   ├── public/           # 🔓 Public pages (Home, QR scan)
│   │   │   ├── auth/             # 🛂 Authentication pages
│   │   │   └── private/          # 🔒 Protected pages (Admin, User)
│   │   ├── router/               # 🛣️ Route configuration & guards
│   │   ├── config/               # ⚙️ API endpoints & configuration
│   │   └── utils/                # 🔧 Helper functions & utilities
│   └── public/                   # Static assets
```

## 🔄 System Flow

### 1. **User Registration & Setup**

```
📱 Landing Page
    ↓
📧 User Registration (Email + Basic Info)
    ↓
💳 Pay Setup Fee ($69) via Stripe
    ↓
👤 Create Profile (Photos, Bio, Preferences)
    ↓
📤 Submit for Admin Review
```

### 2. **Admin Review Process**

```
👨‍💼 Admin Dashboard
    ↓
👀 Review Pending Profiles
    ↓
✅ Approve → Generate QR Cards + Send Approval Email
    ↓
❌ Reject → Send Feedback Email
```

### 3. **QR Code System**

```
✅ Approved Profile
    ↓
🔗 Generate 50 QR Cards (Physical printing)
    ↓
👥 Share QR Cards in Real World
    ↓
📱 Others Scan QR Code
    ↓
👀 View Profile + Express Interest
    ↓
💕 Mutual Interest → Contact Sharing
```

### 4. **Subscription & Ongoing Usage**

```
🎯 Active User
    ↓
💰 Monthly ($13) or Yearly ($120) Subscription
    ↓
📊 Track QR Scan Analytics
    ↓
💬 Manage Contact Requests
    ↓
🔄 Generate New QR Cards (if needed)
```

## 🔐 Authentication System

### Role-Based Access Control

- **Public**: Home page, QR scanning, profile viewing
- **User**: Profile management, QR analytics, contact requests
- **Admin**: Dashboard, user management, system configuration

### Authentication Flow

1. **Login Attempt**: Try user login first, then admin fallback
2. **JWT Storage**: Store in both Redux state and HTTP-only cookies
3. **Route Protection**: Role guards validate access permissions
4. **Auto-Redirect**: Redirect to appropriate dashboard based on role

### Key Files

- `authFetch.js`: Login actions with cookie storage
- `authSlice.js`: Redux state management with logout
- `authFlow.js`: Helper utilities for role-based redirects
- `RoleGuard.jsx`: Route protection component

## 🎯 User Journey

### 🔓 **Public User Flow**

```
🏠 Home Page → 👀 Browse Public Profiles → 📱 Scan QR Code → 💕 Express Interest
```

### 🙋 **Regular User Flow**

```
🛂 Login → 🏠 Dashboard → 👤 Manage Profile → 📊 View Analytics → 📞 Handle Contacts
```

### 👨‍💼 **Admin Flow**

```
🔐 Admin Login → 📊 Dashboard → 👥 User Management → ✅ Approve Profiles → 📧 Send Emails
```

## 👨‍💼 Admin Dashboard

### Core Features

- **Dashboard Overview**: User statistics, revenue, active subscriptions
- **User Management**: Approve/reject profiles, manage user status
- **Profile Review**: Detailed profile examination with feedback system
- **Email Templates**: Visual email builder with variable system
- **Analytics**: QR scan tracking, user engagement metrics
- **Notifications**: System alerts and admin tasks

### Admin Pages

- `/admin` - Dashboard overview with statistics
- `/admin/user-management` - User approval workflow
- `/admin/all-users` - Complete user listing with filters
- `/admin/email-templates` - Email template management
- `/admin/settings` - System configuration
- `/admin/notifications` - Admin notification center

## 💳 Payment System

### Stripe Integration

- **Setup Fee**: $69 one-time payment for profile creation
- **Subscriptions**:
  - Monthly: $13/month
  - Yearly: $120/year (2 months free)

### Payment Flow

1. User registers and enters payment details
2. Stripe processes payment securely
3. Payment confirmation enables profile creation
4. Subscription management for ongoing access

## 🔗 QR Code System

### QR Card Generation

- **Quantity**: 50 unique QR codes per approved user
- **Format**: Links to profile viewing page
- **Tracking**: Each scan recorded with IP and timestamp
- **Limitations**: 5 scans per unique IP address per card

### QR Code Analytics

- Total scans per card
- Unique IP addresses
- Scan timestamps and locations
- Remaining scan capacity

### Physical Cards

- QR codes printed on physical cards
- Tracking number provided for shipping
- Cards can be deactivated if needed

## 📱 Frontend Routes

### 🔓 Public Routes (No Authentication Required)

```
/                           # Home page
/welcome-scan/:id          # QR code scanning result
/user/:email/profile       # Public profile view
/user/:email/gallery       # Profile photo gallery
/user/:email/lets-connect  # Contact initiation
/auth/login               # Login page
/auth/forgot-password     # Password reset
```

### 👨‍💼 Admin Routes (Admin Role Required)

```
/admin                    # Admin dashboard
/admin/user-management    # User approval workflow
/admin/all-users         # Complete user listing
/admin/email-templates   # Email template builder
/admin/settings          # System settings
/admin/notifications     # Admin notifications
```

### 🙋 User Routes (User Role Required)

```
/user                    # User dashboard
/user/profile           # Profile management
/user/setup-profile     # Initial profile setup
/user/edit-profile/:id  # Profile editing
```

## 🔌 API Endpoints

### 🔐 Authentication

```http
POST /auth/register          # User registration
POST /auth/user/login        # User login
POST /auth/admin/login       # Admin login
POST /auth/forgot-password   # Password reset request
POST /auth/reset-password    # Password reset confirmation
POST /auth/set-password      # Set new password
```

### 👤 Profile Management

```http
POST /profile               # Create profile
GET  /profile               # Get user profile
PUT  /profile               # Update profile
POST /profile/photo         # Upload photos (multipart/form-data)
DELETE /profile/photo/:url  # Delete photo
POST /profile/submit        # Submit for review
```

### 🔗 QR Card System

```http
POST /qr-cards/generate     # Generate QR codes
GET  /qr-cards              # List user's cards
GET  /qr-cards/:id/scans    # Scan analytics
POST /qr-cards/scan/:code   # Process QR scan
PUT  /qr-cards/:id/deactivate # Deactivate card
```

### 💳 Payment System

```http
POST /payment/create-one-time-payment    # Setup fee payment
POST /payment/create-subscription        # Subscription payment
GET  /payment/payments                   # Payment history
GET  /payment/subscription               # Current plan
POST /payment/subscription/cancel        # Cancel subscription
```

### 👨‍💼 Admin Dashboard

```http
GET  /admin/dashboard              # Statistics overview
GET  /admin/profiles/pending       # Profiles awaiting review
GET  /admin/profiles/:id          # Profile details
POST /admin/profiles/:id/approve   # Approve profile
POST /admin/profiles/:id/reject    # Reject profile
GET  /admin/users/all             # All users with pagination
GET  /admin/notifications         # Admin notifications
```

## 🗄️ Database Schema

### Core Models

- **User**: Authentication, payment status, Stripe customer
- **Profile**: Bio, photos, preferences, approval status
- **QRCard**: Generated codes, scan tracking, analytics
- **Scan**: QR scan records with IP tracking
- **Match**: Mutual interest connections
- **Subscription**: Payment plans and billing
- **Payment**: Stripe transaction history
- **Admin**: Administrative access and roles
- **Notification**: System alerts and updates

### Key Relationships

```
User (1) ──── (1) Profile ──── (∞) QRCard ──── (∞) Scan
User (1) ──── (∞) Payment
User (1) ──── (1) Subscription
User (∞) ──── (∞) Match (many-to-many through interest)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Stripe account (test/live keys)

### Backend Setup

```bash
cd api
npm install
cp .env.example .env
# Configure database and Stripe keys in .env
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

### Frontend Setup

```bash
cd cli
npm install
cp .env.example .env.local
# Configure API URL in .env.local
npm run dev
```

### Environment Variables

**Backend (.env):**

```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
STRIPE_SECRET_KEY="sk_test_..."
FRONTEND_URL="http://localhost:5173"
```

**Frontend (.env.local):**

```
VITE_API_BASE_URL="http://localhost:3000"
VITE_STRIPE_PUBLIC_KEY="pk_test_..."
```

## 🧪 Testing

### API Testing

- **Postman Collection**: Import `QR_Card_Dating_App_API.postman_collection.json`
- **Test Accounts**:
  - Admin: `admin@yourapp.com` / `admin123`
  - User: `user@example.com` / `SecurePassword123!`

### Frontend Testing

- **Auth Flow**: Test login, role-based redirects
- **Profile Creation**: Complete user journey
- **Admin Functions**: User approval workflow
- **QR Scanning**: Test QR code generation and scanning

## 🔧 Development

### Backend Commands

```bash
npm run start:dev        # Development server
npm run build           # Production build
npm run test           # Run tests
npx prisma studio      # Database GUI
npx prisma migrate dev # Create migration
```

### Frontend Commands

```bash
npm run dev            # Development server
npm run build          # Production build
npm run preview        # Preview production build
npm run lint          # ESLint checking
```

### Code Structure Guidelines

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route-specific pages in `src/page/`
- **Features**: Redux slices and API calls in `src/features/`
- **Utils**: Helper functions in `src/utils/`
- **Guards**: Route protection in `src/router/guards/`

## 📦 Deployment

### Backend Deployment

- **Docker**: Use `Dockerfile` and `docker-compose.yml`
- **Environment**: Set production environment variables
- **Database**: Run migrations in production
- **Health Check**: `/health` endpoint available

### Frontend Deployment

- **Build**: `npm run build` creates `dist/` folder
- **Static Hosting**: Deploy to Vercel, Netlify, or CDN
- **Environment**: Configure production API URLs

### Production Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Stripe keys (live mode)
- [ ] SSL certificates
- [ ] Error monitoring
- [ ] Backup strategy

---

## 🎯 Key Success Factors

1. **User Experience**: Seamless profile creation and QR sharing
2. **Admin Efficiency**: Quick profile review and approval
3. **Payment Security**: Reliable Stripe integration
4. **Scalability**: Efficient database queries and caching
5. **Mobile Optimization**: Responsive design for QR scanning

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ for modern dating experiences**
