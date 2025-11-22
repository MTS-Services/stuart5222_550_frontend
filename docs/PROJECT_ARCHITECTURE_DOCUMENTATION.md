# Stuart QR Dating App - Project Architecture Documentation 📋

## Project Overview

The Stuart QR Dating App is a comprehensive full-stack application consisting of:

- **Backend API**: NestJS-based RESTful API with PostgreSQL database
- **Frontend CLI**: React-based web application with Redux state management
- **Core Features**: QR-code based dating platform with payment integration, admin dashboard, and user management

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React CLI     │ ←──────────────→│   NestJS API    │
│   Frontend      │                 │   Backend       │
└─────────────────┘                 └─────────────────┘
         │                                    │
         │                                    │
    ┌────────────┐                      ┌────────────┐
    │   Local    │                      │ PostgreSQL │
    │  Storage   │                      │ Database   │
    └────────────┘                      └────────────┘
                                             │
                                      ┌─────────────┐
                                      │   Stripe    │
                                      │   Payment   │
                                      └─────────────┘
```

### Technology Stack

#### Backend (API)

- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Payments**: Stripe API (Live/Mock modes)
- **File Upload**: Multer (multipart/form-data)
- **QR Generation**: qrcode library
- **Email**: Nodemailer
- **Validation**: class-validator + class-transformer

#### Frontend (CLI)

- **Framework**: React 19.1.1 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **UI Components**: Lucide React icons
- **Notifications**: React Toastify
- **Payments**: Stripe.js

---

## 📁 Project Structure Analysis

### Backend Structure (`/api`)

```
api/
├── src/
│   ├── auth/              # 🔐 Authentication & Authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── profile/           # 👤 User Profile Management
│   │   ├── profile.controller.ts
│   │   ├── profile.service.ts
│   │   └── profile.dto.ts
│   ├── qr-card/          # 🔗 QR Code System
│   │   ├── qr-card.controller.ts
│   │   └── qr-card.service.ts
│   ├── admin/            # 👨‍💼 Admin Dashboard
│   │   ├── admin.controller.ts
│   │   └── admin.service.ts
│   ├── payment/          # 💳 Stripe Integration
│   │   ├── payment.controller.ts
│   │   └── payment.service.ts
│   ├── contact/          # 📞 Contact Sharing
│   │   ├── contact.controller.ts
│   │   └── contact.service.ts
│   ├── email/            # 📧 Email Service
│   │   └── email.service.ts
│   └── prisma.service.ts # 🗄️ Database Service
├── prisma/
│   ├── schema.prisma     # Database Schema
│   ├── seed.ts          # Database Seeding
│   └── migrations/      # Database Migrations
└── uploads/profiles/    # File Storage
```

### Frontend Structure (`/cli`)

```
cli/
├── src/
│   ├── page/
│   │   ├── public/           # Public Pages
│   │   │   ├── home/         # Landing Page
│   │   │   ├── signUpPick/   # Registration Flow
│   │   │   ├── welcomeScan/  # QR Scan Welcome
│   │   │   └── connect/      # Contact Sharing
│   │   └── private/          # Protected Pages
│   │       ├── admin/        # Admin Dashboard
│   │       └── user/         # User Dashboard
│   ├── layout/
│   │   ├── main/             # Main App Layout
│   │   └── admin/            # Admin Layout
│   ├── features/             # Redux Features
│   │   ├── auth/             # Authentication State
│   │   ├── admin/            # Admin State
│   │   └── user/             # User State
│   ├── components/           # Reusable Components
│   │   ├── ui/               # UI Components
│   │   └── common/           # Common Components
│   ├── router/               # Routing Configuration
│   ├── config/               # Configuration
│   │   └── api/              # API Configuration
│   └── utils/                # Utility Functions
```

---

## 🗃️ Database Schema & Entities

### Core Entities (9 Tables)

#### 1. **User** - Authentication & Payment Status

```prisma
model User {
  id           Int        @id @default(autoincrement())
  email        String     @unique
  name         String
  phone        String?
  status       UserStatus @default(WAITLIST)
  isApproved   Boolean    @default(false)
  paidSetupFee Boolean    @default(false)
  stripeCustomerId String? @unique
  // Relations to Profile, QRCard, Scan, Match, Subscription
}
```

#### 2. **Profile** - User Profile & Photo Management

```prisma
model Profile {
  id           Int           @id @default(autoincrement())
  userId       Int           @unique
  age          Int?
  height       String?
  bio          String?
  location     String?
  facePhoto    String?       # Required photo
  fullBodyPhoto String?      # Required photo
  thirdPhoto   String?       # Required photo
  additionalPhotos String[]  # Up to 10 additional photos
  status       ProfileStatus @default(DRAFT)
  // Relations to User, Admin, QRCard
}
```

#### 3. **QRCard** - QR Code Generation & Tracking

```prisma
model QRCard {
  id        Int      @id @default(autoincrement())
  profileId Int
  userId    Int
  qrCode    String   @unique
  scanCount Int      @default(0)
  maxScans  Int      @default(5)
  isActive  Boolean  @default(true)
  // Relations to Profile, User, Scan
}
```

#### 4. **Scan** - QR Code Scan Analytics

```prisma
model Scan {
  id        Int      @id @default(autoincrement())
  qrCardId  Int
  viewerId  Int?     # Registered user or null for anonymous
  ipAddress String?
  userAgent String?
  location  String?
  // Relations to QRCard, User (viewer), Match
}
```

#### 5. **Match** - Contact Request & Mutual Interest

```prisma
model Match {
  id             Int       @id @default(autoincrement())
  scanId         Int       @unique
  userId         Int       # Profile owner
  targetId       Int       # Scanner
  isInterested   Boolean   @default(false)
  isMutual       Boolean   @default(false)
  contactShared  Boolean   @default(false)
  status         String    @default("pending")
  requesterEmail String?
  requesterName  String?
  message        String?
  // Relations to Scan, User (both directions)
}
```

#### 6. **Subscription** - Subscription Management

```prisma
model Subscription {
  id                   Int                @id @default(autoincrement())
  userId               Int                @unique
  plan                 SubscriptionPlan   # MONTHLY/YEARLY
  status               SubscriptionStatus # ACTIVE/INACTIVE/CANCELLED
  amount               Decimal
  startDate            DateTime?
  endDate              DateTime?
  stripeSubscriptionId String?
  // Relations to User, Payment
}
```

#### 7. **Payment** - Transaction History

```prisma
model Payment {
  id                    Int      @id @default(autoincrement())
  subscriptionId        Int?
  userId                Int
  amount                Decimal
  type                  String   # "setup_fee", "subscription", "refund"
  status                String   # "pending", "completed", "failed"
  stripePaymentIntentId String?
  // Relations to Subscription
}
```

#### 8. **Admin** - Admin User Management

```prisma
model Admin {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  username  String    @unique
  password  String
  role      String    @default("admin")
  isActive  Boolean   @default(true)
  // Relations to Profile (reviewed profiles)
}
```

#### 9. **Notification** - System Notifications

```prisma
model Notification {
  id        Int      @id @default(autoincrement())
  adminId   Int
  type      String   # "new_signup", "profile_submitted", "payment_received"
  title     String
  message   String
  isRead    Boolean  @default(false)
  data      Json?    # Additional structured data
}
```

---

## 🔄 User Journey Flow

### Complete User Flow

```
1. 📱 Landing Page
   ↓
2. 📧 User Registration (Email + Name)
   ↓
3. 💳 Pay Setup Fee ($69)
   ↓
4. 👤 Create Profile
   ├── Upload 3 Required Photos (Face, Full Body, Third)
   ├── Upload up to 10 Additional Photos
   ├── Fill Bio Information (Age, Height, Location)
   └── Submit for Review
   ↓
5. 👨‍💼 Admin Review Process
   ├── Approve → Generate 50 QR Cards
   └── Reject → User must revise profile
   ↓
6. 🔗 QR Card Distribution
   ├── Physical cards mailed to user
   └── Each card has 5-scan limit
   ↓
7. 👀 QR Code Scanning
   ├── Others scan user's QR codes
   ├── Scanner sees profile information
   └── Scanner can request contact
   ↓
8. 💘 Matching System
   ├── Contact requests sent to profile owner
   ├── Profile owner can approve/reject
   └── Mutual approval = Contact sharing
   ↓
9. 💰 Subscription Management
   ├── Monthly Plan: $13/month
   └── Yearly Plan: $120/year (save $36)
```

---

## 🔌 API Endpoints Overview

### Authentication Endpoints

```http
POST /auth/register          # User registration
POST /auth/login            # User login
POST /auth/admin/login      # Admin login
```

### Profile Management

```http
POST /profile               # Create profile
GET /profile                # Get user profile
PUT /profile                # Update profile
POST /profile/photo         # Upload photos (multipart/form-data)
DELETE /profile/photo/:url  # Delete photo
POST /profile/submit        # Submit for admin review
```

### QR Card System

```http
POST /qr-cards/generate     # Generate 50 QR codes
GET /qr-cards              # List user's QR cards
GET /qr-cards/active       # Get active QR cards only
GET /qr-cards/:id/scans    # View scan analytics
POST /qr-cards/scan/:code  # Scan QR code (public endpoint)
PUT /qr-cards/:id/deactivate # Deactivate QR card
```

### Payment System (Stripe)

```http
POST /payment/setup-fee           # Create setup fee payment intent
POST /payment/confirm-setup-fee   # Confirm setup fee payment
POST /payment/subscription        # Create subscription
GET /payment/payments            # Payment history
GET /payment/subscription        # Current subscription
POST /payment/subscription/cancel # Cancel subscription
```

### Admin Dashboard

```http
GET /admin/dashboard              # Dashboard statistics
GET /admin/profiles/pending       # Profiles awaiting review
GET /admin/profiles/:id          # Profile details
POST /admin/profiles/approve      # Approve profile
POST /admin/profiles/reject       # Reject profile
GET /admin/profiles/verified      # Approved profiles
GET /admin/notifications         # System notifications
PUT /admin/notifications/:id/read # Mark notification as read
```

### Contact Management

```http
POST /contact/request            # Request contact information
POST /contact/approve/:requestId # Approve contact request
POST /contact/reject/:requestId  # Reject contact request
GET /contact/requests           # Get contact requests
```

---

## 🎨 Frontend Architecture

### State Management (Redux)

```javascript
// Store Structure
store/
├── auth/
│   ├── authSlice.js      # Authentication state
│   └── authFetch.js      # Auth API calls
├── admin/
│   ├── dashboardSlice.js # Admin dashboard state
│   └── dashboardFetch.js # Dashboard API calls
└── user/
    ├── userSlice.js      # User profile state
    └── userFetch.js      # User API calls
```

### Routing Architecture

```javascript
// Main Routes
- / (Public)              → Home page
- /sign-up-pick          → Registration flow
- /welcome-scan          → QR scan welcome
- /admin/*               → Admin dashboard (protected)
- /user/*                → User dashboard (protected)

// Admin Routes
- /admin/dashboard       → Admin dashboard
- /admin/admin-user-management → User management
- /admin/user-edit       → User editing
- /admin/notification    → Notifications
```

### Component Structure

```
components/
├── ui/                  # Basic UI components
│   ├── Button.jsx
│   ├── Loading.jsx
│   └── Skeleton.jsx
├── common/              # Common components
└── AllTableResponsiveStyle/ # Table components
```

---

## 🔐 Authentication & Security

### Authentication Flow

1. **JWT-based authentication** with bcrypt password hashing
2. **Cookie-based token storage** with secure options
3. **Route protection** with React Router guards
4. **Role-based access control** (User/Admin)

### Security Features

- **Input validation** with class-validator
- **SQL injection protection** via Prisma ORM
- **File upload validation** for image uploads
- **Rate limiting ready** (implementation pending)
- **CORS configuration** for cross-origin requests

---

## 💳 Payment Integration

### Stripe Integration Features

- **Setup Fee**: $69.00 one-time payment
- **Monthly Plan**: $13.00/month recurring
- **Yearly Plan**: $120.00/year (17% discount)
- **Mock Mode**: Development testing without real payments
- **Webhook Support**: Payment status updates
- **Customer Management**: Stripe customer creation

### Payment Flow

```
1. User initiates payment
2. Create Stripe PaymentIntent
3. Frontend handles payment with Stripe.js
4. Webhook confirms payment
5. Update user status in database
6. Generate QR codes (setup fee) or activate subscription
```

---

## 📊 Complexity Analysis

### High Complexity Areas

#### 1. **QR Code System** (High Complexity)

- **Generation**: 50 unique codes per approved user
- **Scanning**: Public endpoint with anonymous tracking
- **Analytics**: Scan count, viewer tracking, geographic data
- **Lifecycle**: Activation, deactivation, expiration
- **Challenges**:
  - UUID collision prevention
  - Scale with thousands of users
  - Anonymous scan tracking

#### 2. **Admin Approval Workflow** (High Complexity)

- **Profile Review**: Manual approval process
- **Bulk Operations**: Handle multiple profiles
- **Notification System**: Real-time admin alerts
- **State Management**: DRAFT → PENDING → APPROVED/REJECTED
- **Challenges**:
  - Email notification reliability
  - Admin workload management
  - Review criteria standardization

#### 3. **File Upload & Management** (Medium-High Complexity)

- **Multi-photo uploads**: 3 required + 10 optional photos
- **Form-data handling**: Multipart uploads with validation
- **Storage management**: Local file system storage
- **Image processing**: Validation, resizing, format conversion
- **Challenges**:
  - Storage scalability
  - Image optimization
  - CDN integration needed

#### 4. **Payment Processing** (Medium-High Complexity)

- **Dual-mode operation**: Live Stripe + Mock payments
- **Multiple payment types**: Setup fee, subscriptions, refunds
- **Webhook handling**: Asynchronous payment confirmations
- **State synchronization**: Stripe ↔ Database consistency
- **Challenges**:
  - Webhook reliability
  - Failed payment recovery
  - Subscription lifecycle management

#### 5. **Matching & Contact System** (Medium Complexity)

- **Contact requests**: Scanner → Profile owner flow
- **Email notifications**: Automated contact request emails
- **Mutual approval**: Two-way consent required
- **Data privacy**: Controlled information sharing
- **Challenges**:
  - Email deliverability
  - Spam prevention
  - Contact information security

### Medium Complexity Areas

#### 6. **Authentication System** (Medium Complexity)

- **JWT token management**: Secure token generation/validation
- **Role-based access**: User/Admin role separation
- **Password security**: bcrypt hashing
- **Session management**: Cookie-based persistence
- **Challenges**:
  - Token expiration handling
  - Secure cookie configuration
  - Password reset flow (not implemented)

#### 7. **Database Design** (Medium Complexity)

- **9 interconnected entities** with complex relationships
- **Prisma ORM**: Type-safe database operations
- **Migration management**: Schema evolution
- **Data integrity**: Foreign key constraints
- **Challenges**:
  - Query optimization
  - Data migration strategies
  - Backup and recovery

#### 8. **Frontend State Management** (Medium Complexity)

- **Redux Toolkit**: Centralized state management
- **API integration**: Axios-based HTTP client
- **Route protection**: Authentication guards
- **Form handling**: Complex multi-step forms
- **Challenges**:
  - State synchronization
  - Error handling consistency
  - Loading state management

### Lower Complexity Areas

#### 9. **Dashboard Analytics** (Low-Medium Complexity)

- **Statistics aggregation**: Count-based metrics
- **Time-based filtering**: Daily, weekly, monthly, yearly
- **Revenue tracking**: Payment amount summation
- **User status monitoring**: Status-based grouping

#### 10. **Email Service** (Low Complexity)

- **Nodemailer integration**: SMTP email sending
- **Template-based emails**: Approval/rejection notifications
- **Basic error handling**: Email delivery failure logging

---

## 🚀 Upcoming Features & Enhancements

### Phase 1: Core Improvements

#### 1. **Enhanced QR System**

- **Dynamic QR generation**: On-demand code generation
- **QR analytics dashboard**: Detailed scan analytics
- **Batch QR operations**: Bulk activate/deactivate
- **QR code expiration**: Time-based validity

#### 2. **Advanced Matching**

- **Interest categorization**: Dating preferences, interests
- **Location-based matching**: Geographic proximity
- **Compatibility scoring**: Algorithm-based matching
- **Chat system**: In-app messaging before contact sharing

#### 3. **Mobile Application**

- **React Native app**: iOS/Android mobile apps
- **Camera QR scanning**: Native QR code scanner
- **Push notifications**: Real-time alerts
- **Offline capabilities**: Limited offline functionality

### Phase 2: Business Features

#### 4. **Enhanced Admin Dashboard**

- **Advanced analytics**: User behavior insights
- **Bulk operations**: Mass approve/reject profiles
- **Admin reporting**: Revenue, user growth reports
- **User management**: Advanced user search/filtering

#### 5. **Payment Enhancements**

- **Multiple payment methods**: PayPal, Apple Pay, Google Pay
- **Promotional codes**: Discount code system
- **Subscription management**: Pause, upgrade, downgrade
- **Revenue optimization**: Dynamic pricing, A/B testing

#### 6. **Content Management**

- **Profile verification**: Enhanced verification system
- **Content moderation**: AI-powered content filtering
- **Reporting system**: User report/block functionality
- **Photo editing**: In-app photo editing tools

### Phase 3: Scale & Performance

#### 7. **Infrastructure Scaling**

- **Database optimization**: Query optimization, indexing
- **CDN integration**: Image and asset delivery
- **Caching layer**: Redis for session/data caching
- **Load balancing**: Horizontal scaling preparation

#### 8. **Advanced Features**

- **Real-time features**: WebSocket integration
- **AI recommendations**: ML-based matching suggestions
- **Social features**: Friend referrals, social sharing
- **Gamification**: Profile completion rewards, badges

#### 9. **Security & Privacy**

- **Enhanced security**: 2FA, security audits
- **Privacy controls**: Granular privacy settings
- **Data protection**: GDPR compliance, data export
- **Security monitoring**: Intrusion detection, monitoring

### Phase 4: Enterprise Features

#### 10. **Multi-tenancy**

- **White-label solution**: Customizable branding
- **Multi-region support**: Geographic data isolation
- **Enterprise dashboard**: Organization-level analytics
- **API monetization**: Third-party API access

---

## 📈 Technical Debt & Optimization Opportunities

### Immediate Technical Debt

#### 1. **File Storage System**

- **Current**: Local file system storage
- **Issues**: No scalability, backup challenges
- **Solution**: Migrate to AWS S3/CloudFront CDN
- **Priority**: High

#### 2. **Email Service**

- **Current**: Basic Nodemailer implementation
- **Issues**: No delivery tracking, limited templates
- **Solution**: Integrate SendGrid/Mailgun with templates
- **Priority**: Medium

#### 3. **Error Handling**

- **Current**: Basic HTTP exceptions
- **Issues**: Inconsistent error responses, no logging
- **Solution**: Centralized error handling, structured logging
- **Priority**: Medium

#### 4. **API Documentation**

- **Current**: README-based documentation
- **Issues**: No interactive API docs
- **Solution**: Swagger/OpenAPI integration
- **Priority**: Low

### Performance Optimizations

#### 1. **Database Queries**

- **Add database indexing** for frequently queried fields
- **Implement query optimization** for admin dashboard
- **Add database connection pooling** for better performance
- **Database read replicas** for analytics queries

#### 2. **Frontend Performance**

- **Code splitting** for route-based chunks
- **Image optimization** and lazy loading
- **Bundle size optimization** and tree shaking
- **Caching strategies** for API responses

#### 3. **API Performance**

- **Request/Response caching** with Redis
- **API rate limiting** implementation
- **Response compression** (gzip)
- **Database query optimization**

### Security Enhancements

#### 1. **Authentication Security**

- **Two-factor authentication** (2FA)
- **Password reset functionality** (currently missing)
- **Account lockout** after failed attempts
- **JWT refresh token** implementation

#### 2. **Data Protection**

- **Input sanitization** enhancement
- **XSS protection** headers
- **CSRF protection** implementation
- **API request validation** strengthening

---

## 🛠️ Development & Deployment

### Development Setup

#### Prerequisites

- Node.js 16+
- PostgreSQL database
- Stripe account (optional for mock mode)

#### Quick Start Commands

```bash
# Backend setup
cd api
npm install
npx prisma migrate deploy
npx prisma generate
npm run start:dev

# Frontend setup
cd cli
npm install
npm run dev
```

### Environment Configuration

#### Backend Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/qr_dating_app"

# Application
PORT=3000
JWT_SECRET="your_super_secret_jwt_key"

# Stripe (Live Keys)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
MOCK_PAYMENTS="false"  # Set to "true" for development

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

#### Frontend Environment Variables

```env
VITE_API_BASE_URL="http://localhost:3000"
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

### Deployment Architecture

#### Production Deployment

- **Backend**: Docker containerized NestJS application
- **Frontend**: Static build deployed to CDN
- **Database**: Managed PostgreSQL (AWS RDS/DigitalOcean)
- **File Storage**: AWS S3 with CloudFront CDN
- **Monitoring**: Application monitoring and logging

#### CI/CD Pipeline

```yaml
# Suggested GitHub Actions workflow
1. Code commit to main branch
2. Run automated tests (unit + integration)
3. Build Docker image for backend
4. Build frontend static assets
5. Deploy to staging environment
6. Run end-to-end tests
7. Deploy to production
8. Health check verification
```

---

## 📊 Metrics & Monitoring

### Key Performance Indicators (KPIs)

#### Business Metrics

- **User Registration Rate**: New signups per day/week/month
- **Conversion Rate**: Setup fee payment completion rate
- **Profile Approval Rate**: Admin approval vs rejection ratio
- **QR Scan Analytics**: Scans per card, popular profiles
- **Subscription Metrics**: Monthly/yearly subscription rates
- **Revenue Tracking**: Setup fees, subscription revenue

#### Technical Metrics

- **API Response Times**: Endpoint performance monitoring
- **Database Performance**: Query execution times
- **Error Rates**: 4xx/5xx error tracking
- **Uptime Monitoring**: Service availability
- **Payment Success Rate**: Stripe payment completion rate

### Monitoring Implementation

```typescript
// Suggested monitoring endpoints
GET /health                 # Application health check
GET /metrics               # Prometheus metrics
GET /admin/analytics       # Business intelligence dashboard
```

---

## 🔧 Testing Strategy

### Testing Pyramid

#### Unit Tests

- **Service layer testing**: Business logic validation
- **Controller testing**: HTTP endpoint validation
- **Component testing**: React component isolation

#### Integration Tests

- **API endpoint testing**: Full request/response cycle
- **Database integration**: Prisma model testing
- **Payment integration**: Stripe mock testing

#### End-to-End Tests

- **User journey testing**: Complete user workflows
- **Admin workflow testing**: Profile approval process
- **Payment flow testing**: Setup fee and subscription flows

### Testing Tools

- **Backend**: Jest + Supertest for API testing
- **Frontend**: React Testing Library + Jest
- **E2E**: Playwright or Cypress
- **API Testing**: Postman collection (already implemented)

---

## 📋 Conclusion

The Stuart QR Dating App represents a sophisticated full-stack application with several high-complexity features including QR code management, payment processing, admin approval workflows, and file upload systems. The modular architecture provides a solid foundation for future enhancements while the current technical debt areas offer clear optimization paths.

### Key Strengths

- ✅ **Comprehensive feature set** covering the complete user journey
- ✅ **Modular architecture** with clear separation of concerns
- ✅ **Production-ready payment integration** with Stripe
- ✅ **Scalable database design** with proper relationships
- ✅ **Modern technology stack** with TypeScript and React

### Priority Improvements

1. **File storage migration** to cloud-based solution (AWS S3)
2. **Enhanced error handling** and logging implementation
3. **Performance optimizations** for database and API
4. **Security enhancements** including 2FA and improved validation
5. **Mobile application development** for better user experience

### Future Scalability

The current architecture supports scaling to thousands of users with appropriate infrastructure improvements. The modular design allows for independent scaling of different features and services.

---

**Document Version**: 1.0  
**Last Updated**: October 18, 2025  
**Prepared By**: GitHub Copilot Analysis  
**Project**: Stuart QR Dating App
