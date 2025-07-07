# Hope Harvest - Donation & Volunteer Platform

A comprehensive donation and volunteer management platform built with Spring Boot microservices and React frontend. Hope Harvest connects donors, volunteers, and beneficiaries to create meaningful impact across Bangladesh.

## 🏗️ Architecture

- **Frontend**: React.js with Bootstrap 5 & CSS Modules
- **Backend**: Spring Boot 3.x microservices (Java 21)
- **Database**: PostgreSQL 15 with separate schemas
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions with automated testing
- **Authentication**: JWT-based with role-based access control

## 📋 Services

| Service          | Port | Database            | Technology Stack             | Description                      |
| ---------------- | ---- | ------------------- | ---------------------------- | -------------------------------- |
| Frontend         | 3000 | -                   | React 18, Bootstrap 5, Axios | Web application with admin panel |
| User Service     | 8085 | User_Authentication | Spring Boot 3, JWT, JPA      | User management & authentication |
| Donation Payment | 8080 | Donation_Payment    | Spring Boot 3, JPA, UUID     | Donation processing & campaigns  |
| Event Volunteer  | 8090 | Event_Volunteer     | Spring Boot 3, JPA           | Event & volunteer management     |
| PostgreSQL       | 5433 | Multiple Schemas    | PostgreSQL 15                | Database server (external port)  |

## 🌟 Key Features

### For Donors

- 💳 **Multiple Payment Methods**: bKash, Nagad, Rocket, Upay, Cards
- 📊 **Real-time Tracking**: Track donation status and campaign progress
- 🎯 **Campaign Categories**: Education, Healthcare, Environment, etc.
- 📱 **Anonymous Donations**: Support causes without revealing identity

### For Volunteers

- 📝 **Easy Registration**: Simple volunteer application process
- 📅 **Event Management**: Browse and join volunteer opportunities
- 🏆 **Activity Tracking**: Monitor volunteer hours and impact
- 👥 **Team Building**: Collaborate with other volunteers

### For Administrators

- 📈 **Comprehensive Dashboard**: Monitor all platform activities
- ⚙️ **Campaign Management**: Create and manage fundraising campaigns
- 👤 **User Management**: Handle user accounts and permissions
- 📊 **Analytics**: Detailed reports on donations and volunteer activities
- 🔧 **Category Management**: Organize campaigns by categories

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites

- Docker Desktop installed and running
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Arafat1969/Hope-Harvest.git
cd hope-harvest
```

### 2. Run with Docker Compose

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up --build -d
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **User Service API**: http://localhost:8085
- **Donation Service API**: http://localhost:8080
- **Event Service API**: http://localhost:8090
- **Database**: localhost:5433 (external port)
- **API Documentation**:
  - User Service: http://localhost:8085/swagger-ui.html
  - Donation Service: http://localhost:8080/swagger-ui.html
  - Event Service: http://localhost:8090/swagger-ui.html

### 4. Default Admin Credentials

```
Email: admin@hopeharvest.org
Password: admin123
Role: ADMIN
```

### 5. Health Checks

```bash
# Check all services health
curl http://localhost:8085/actuator/health  # User Service
curl http://localhost:8080/actuator/health  # Donation Service
curl http://localhost:8090/actuator/health  # Event Service
```

### 6. Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (reset database)
docker-compose -f docker-compose.dev.yml down -v

# View service logs
docker-compose -f docker-compose.dev.yml logs [service-name]
```

## 🛠️ Manual Setup (Alternative)

### Prerequisites

- Java 21 (Eclipse Temurin recommended)
- Node.js 18+ and npm
- PostgreSQL 15
- Maven 3.9+
- Git

### 1. Database Setup

```bash
# Start PostgreSQL and create databases
createdb User_Authentication
createdb Donation_Payment
createdb Event_Volunteer

# Run initialization scripts (automatically handled by Docker)
psql -d User_Authentication -f database/UserService.sql
psql -d Donation_Payment -f database/DonationService.sql
psql -d Event_Volunteer -f database/EventService.sql
```

### 2. Backend Services

Start each service in separate terminals:

#### User Service (Port 8085)

```bash
cd BackEnd/user-service
chmod +x ./mvnw
./mvnw clean install
./mvnw spring-boot:run
```

#### Donation Payment Service (Port 8080)

```bash
cd BackEnd/donation-payment
chmod +x ./mvnw
./mvnw clean install
./mvnw spring-boot:run
```

#### Event Volunteer Service (Port 8090)

```bash
cd BackEnd/event-volunteer
chmod +x ./mvnw
./mvnw clean install
./mvnw spring-boot:run
```

### 3. Frontend

```bash
cd FrontEnd
npm install
npm start
```

## 🔧 Environment Configuration

### Backend Environment Variables

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/[DATABASE_NAME]
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=arafat1969

# JWT Configuration (User Service)
JWT_SECRET=dGhpc2lzYXZlcnlsb25nc2VjcmV0a2V5Zm9yaG9wZWhhcnZlc3RhcHBsaWNhdGlvbjIwMjQ
```

### Frontend Environment Variables

Create `.env` file in `FrontEnd` directory:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost
REACT_APP_USER_SERVICE_PORT=8085
REACT_APP_DONATION_SERVICE_PORT=8080
REACT_APP_EVENT_SERVICE_PORT=8090

# Development Settings
CHOKIDAR_USEPOLLING=true
GENERATE_SOURCEMAP=false
```

## 📊 Database Schema

### User Authentication Database

- **Users**: User credentials, roles (USER/ADMIN), profile information
- **JWT Tokens**: Token management and refresh functionality
- **Roles**: Role-based access control (RBAC)

### Donation Payment Database

- **Donations**: Donation records with UUID tracking
- **Payments**: Payment gateway integration with OTP verification
- **Campaigns**: Fundraising campaigns with categories and goals
- **Categories**: Campaign categorization system
- **Anonymous Support**: Anonymous donation capability

### Event Volunteer Database

- **Events**: Event scheduling and management
- **Volunteers**: Volunteer registrations and profiles
- **Applications**: Volunteer application tracking
- **Teams**: Team management for collaborative efforts

## 🧪 Testing

### Automated Testing (CI/CD)

The project includes automated testing via GitHub Actions:

```bash
# GitHub Actions workflow runs:
# 1. Frontend tests (Jest + React Testing Library)
# 2. Backend tests (JUnit 5 + Mockito) for all 3 services
# 3. Integration tests with Docker Compose
# 4. Deployment to Azure VM (on main branch)
```

### Frontend Testing

```bash
cd FrontEnd
npm test                    # Run tests in watch mode
npm test -- --coverage    # Run with coverage report
npm test -- --watchAll=false  # Run once (CI mode)
```

### Backend Testing

Test each microservice individually:

```bash
# User Service
cd BackEnd/user-service
./mvnw test

# Donation Payment Service
cd BackEnd/donation-payment
./mvnw test

# Event Volunteer Service
cd BackEnd/event-volunteer
./mvnw test

# Run all tests with coverage
./mvnw clean test jacoco:report
```

## 🔍 API Documentation

### User Service (Port 8085)

- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/profile` - Get authenticated user profile
- `POST /api/auth/refresh` - Refresh JWT access token
- `PUT /api/auth/profile` - Update user profile information
- `GET /api/admin/users` - Admin: Get all users (paginated)

### Donation Service (Port 8080)

- `POST /api/donations` - Create authenticated donation
- `POST /api/donations/anonymous` - Create anonymous donation
- `GET /api/donations` - Get user donation history
- `POST /api/payment/initiate` - Initiate payment with gateway
- `POST /api/payment/verify` - Verify payment with OTP
- `GET /api/campaigns` - Get all active campaigns
- `POST /api/admin/campaigns` - Admin: Create new campaign
- `GET /api/admin/campaigns/categories` - Get campaign categories
- `POST /api/admin/campaigns/categories` - Admin: Create category

### Event Service (Port 8090)

- `GET /api/events` - Get all upcoming events
- `POST /api/events` - Admin: Create new event
- `GET /api/events/{id}` - Get event details
- `POST /api/volunteer/register` - Register as volunteer for event
- `GET /api/volunteers` - Get volunteer registrations
- `PUT /api/volunteer/{id}/status` - Admin: Update volunteer status

## 🎨 Payment Methods Supported

### Mobile Financial Services (MFS)

- **bKash** - Most popular in Bangladesh
- **Nagad** - Government-backed digital wallet
- **Rocket** - Dutch-Bangla Bank mobile banking
- **Upay** - UCB Fintech Company solution
- **Q-Cash** - Quick cash transfer service

### International Cards

- **Visa** - Global payment network
- **MasterCard** - Worldwide payment solution
- **American Express** - Premium card services

### Security Features

- 🔒 **OTP Verification** - SMS-based transaction verification
- 🛡️ **Encrypted Storage** - Secure payment data handling
- ⚡ **Real-time Processing** - Instant payment confirmation
- 📱 **Mobile Optimized** - Touch-friendly payment interface

## 🔐 Security Features

- JWT-based authentication
- Password encryption
- CORS configuration
- SQL injection protection
- XSS protection

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**:

   ```bash
   # Check if ports are in use
   netstat -an | findstr :3000
   netstat -an | findstr :8080
   netstat -an | findstr :8085
   netstat -an | findstr :8090
   ```

2. **Database connection issues**:

   ```bash
   # Check PostgreSQL status
   docker-compose -f docker-compose.dev.yml logs postgres
   ```

3. **Frontend compilation errors**:

   ```bash
   cd FrontEnd
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Backend build issues**:
   ```bash
   cd BackEnd/[service-name]
   ./mvnw clean install -DskipTests
   ```

### Docker Issues

1. **Container startup failures**:

   ```bash
   # View container logs
   docker-compose -f docker-compose.dev.yml logs [service-name]

   # Restart specific service
   docker-compose -f docker-compose.dev.yml restart [service-name]
   ```

2. **Database initialization**:
   ```bash
   # Reset database
   docker-compose -f docker-compose.dev.yml down -v
   docker-compose -f docker-compose.dev.yml up postgres -d
   # Wait for postgres to be ready, then start other services
   ```

## 📝 Development Guidelines

### Code Structure

```
hope-harvest/
├── BackEnd/
│   ├── user-service/
│   ├── donation-payment-service/
│   └── event-volunteer-service/
├── FrontEnd/
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.dev.yml
└── README.md
```

### Adding New Features

1. Create feature branch
2. Implement backend changes
3. Update frontend components
4. Test thoroughly
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

