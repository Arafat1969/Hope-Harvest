# Hope Harvest - Donation & Volunteer Platform

A comprehensive donation and volunteer management platform built with Spring Boot microservices and React frontend.

## 🏗️ Architecture

- **Frontend**: React.js with Bootstrap
- **Backend**: Spring Boot microservices
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## 📋 Services

| Service          | Port | Database            | Description                      |
| ---------------- | ---- | ------------------- | -------------------------------- |
| Frontend         | 3000 | -                   | React web application            |
| User Service     | 8085 | User_Authentication | User management & authentication |
| Donation Payment | 8080 | Donation_Payment    | Donation processing & payment    |
| Event Volunteer  | 8090 | Event_Volunteer     | Event & volunteer management     |
| PostgreSQL       | 5432 | -                   | Database server                  |

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites

- Docker Desktop installed and running
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
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
- **Database**: localhost:5432

### 4. Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (reset database)
docker-compose -f docker-compose.dev.yml down -v
```

## 🛠️ Manual Setup (Alternative)

### Prerequisites

- Java 21 or higher
- Node.js 18 or higher
- PostgreSQL 15
- Maven 3.9+

### 1. Database Setup

```bash
# Start PostgreSQL and create databases
createdb User_Authentication
createdb Donation_Payment
createdb Event_Volunteer

# Run initialization scripts
psql -d User_Authentication -f UserInit.sql
psql -d Donation_Payment -f DonationInit.sql
psql -d Event_Volunteer -f EventInit.sql

# Insert sample data
psql -d Donation_Payment -f InsertSQL.sql
```

### 2. Backend Services

#### User Service

```bash
cd BackEnd/user-service
./mvnw clean install
./mvnw spring-boot:run
```

#### Donation Payment Service

```bash
cd BackEnd/donation-payment-service
./mvnw clean install
./mvnw spring-boot:run
```

#### Event Volunteer Service

```bash
cd BackEnd/event-volunteer-service
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
REACT_APP_API_BASE_URL=http://localhost
REACT_APP_USER_SERVICE_PORT=8085
REACT_APP_DONATION_SERVICE_PORT=8080
REACT_APP_EVENT_SERVICE_PORT=8090
```

## 📊 Database Schema

### User Authentication Database

- Users table with authentication credentials
- JWT token management
- Role-based access control

### Donation Payment Database

- Donations tracking
- Payment gateway integration
- Campaign management
- Anonymous donation support

### Event Volunteer Database

- Events and campaigns
- Volunteer registrations
- Event scheduling

## 🧪 Testing

### Frontend Testing

```bash
cd FrontEnd
npm test
```

### Backend Testing

```bash
cd BackEnd/[service-name]
./mvnw test
```

## 🔍 API Documentation

### User Service (Port 8085)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Donation Service (Port 8080)

- `POST /donations` - Create authenticated donation
- `POST /donations/anonymous` - Create anonymous donation
- `GET /donations` - Get user donations
- `POST /payment/initiate` - Initiate payment
- `POST /payment/verify` - Verify payment

### Event Service (Port 8090)

- `GET /events` - Get all events
- `POST /events` - Create new event
- `GET /events/{id}` - Get event details
- `POST /volunteer` - Register as volunteer

## 🎨 Payment Methods Supported

- **Mobile Banking**: bKash, Nagad, Rocket, Upay, Q-Cash
- **Cards**: Visa, MasterCard, American Express

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
├── Images/
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

---

**Happy Coding! 🚀**
