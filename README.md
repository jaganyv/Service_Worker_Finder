# Service Worker Finder

A full-stack web platform where customers can find and book nearby service workers such as electricians, plumbers, carpenters, mechanics, tailors, and more.

## Features

### Customer Features
- Search workers by service category
- Filter by distance, rating, and price
- View worker profiles with ratings and experience
- Book a worker with date and time selection
- Track booking status
- View bookings on an interactive map

### Worker Features
- Register and create worker profile
- Set service type, price range, and experience
- Set availability (online/offline)
- View and manage bookings
- Accept or reject booking requests
- Receive WhatsApp notifications for new bookings

 <img width="1904" height="984" alt="Screenshot from 2025-11-26 11-02-32" src="https://github.com/user-attachments/assets/03e91a94-c6de-49ee-b2b9-7f6c25d70858" />
 <img width="1904" height="984" alt="Screenshot from 2025-11-26 11-02-39" src="https://github.com/user-attachments/assets/987bccba-bc65-45e6-96f8-9a45d3770a25" />
 <img width="1904" height="984" alt="Screenshot from 2025-11-26 11-02-47" src="https://github.com/user-attachments/assets/dfaf33a4-0413-4e86-9a81-db4549d04f36" />



### Admin Features
- View all workers
- Verify workers
- Manage platform

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **Haversine formula** for geo-based distance calculations

### Frontend
- **React 18** with **TypeScript**
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Leaflet** for interactive maps

### Deployment
- Backend: **Render**
- Frontend: **Vercel**
- Database: **Railway** (MySQL)

## Project Structure

```
Service_Worker_Finder/
├── backend/
│   ├── src/main/java/com/servicefinder/
│   │   ├── config/          # Security configuration
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Data transfer objects
│   │   ├── entity/           # JPA entities
│   │   ├── exception/        # Exception handlers
│   │   ├── repository/       # Data repositories
│   │   ├── security/         # JWT utilities and filters
│   │   └── service/          # Business logic
│   └── src/main/resources/
│       └── application.yml   # Configuration
└── frontend/
    ├── src/
    │   ├── api/              # API client functions
    │   ├── components/       # React components
    │   ├── hooks/            # Custom React hooks
    │   ├── pages/            # Page components
    │   └── utils/            # Utility functions
    └── public/
```

## Database Schema

### Users Table
- `id` (PK)
- `name`
- `email` (unique)
- `password` (BCrypt hashed)
- `phone`
- `role` (CUSTOMER/WORKER/ADMIN)
- `lat`, `lon` (coordinates)
- `created_at`

### Workers Table
- `id` (PK, FK to users)
- `service_type` (ELECTRICIAN, PLUMBER, etc.)
- `experience_years`
- `price_range`
- `rating`
- `availability`

### Bookings Table
- `id` (PK)
- `worker_id` (FK)
- `customer_id` (FK)
- `date`
- `time`
- `status` (PENDING/ACCEPTED/REJECTED/COMPLETED)
- `created_at`

### Reviews Table
- `id` (PK)
- `booking_id` (FK, unique)
- `customer_id` (FK)
- `rating`
- `comment`

## API Endpoints

### Authentication
- `POST /auth/register` - Register as customer
- `POST /auth/register/worker` - Register as worker
- `POST /auth/login` - Login

### Workers
- `POST /workers/register` - Complete worker profile (authenticated)
- `GET /workers?service=ELECTRICIAN&lat=&lon=&radius=` - Search workers
- `GET /workers/{id}` - Get worker details
- `PUT /workers/{id}/availability` - Update availability (authenticated)

### Bookings
- `POST /bookings` - Create booking (authenticated)
- `GET /bookings/customer` - Get customer bookings (authenticated)
- `GET /bookings/worker` - Get worker bookings (authenticated)
- `PUT /bookings/{id}/status` - Update booking status (authenticated)

### Admin
- `GET /admin/workers/pending` - Get pending workers (admin only)
- `PUT /admin/workers/{id}/verify` - Verify worker (admin only)

## Setup Instructions

### Backend Setup

1. **Prerequisites**
   - Java 17 or higher
   - Maven 3.6+
   - MySQL 8.0+

2. **Configure Database**
   - Create a MySQL database
   - Update `application.yml` with your database credentials:
     ```yaml
     spring:
       datasource:
         url: jdbc:mysql://localhost:3306/worker_finder
         username: your_username
         password: your_password
     ```

3. **Configure JWT Secret**
   - Update `application.yml`:
     ```yaml
     jwt:
       secret: your-secret-key-min-256-bits
     ```

4. **Run the Application**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will run on `http://localhost:8080`

### Frontend Setup

1. **Prerequisites**
   - Node.js 18+ and npm

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure API URL**
   - Create `.env` file:
     ```
     VITE_API_BASE_URL=http://localhost:8080
     ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Deployment

### Backend on Render

1. Connect your GitHub repository
2. Set build command: `mvn -DskipTests package`
3. Set start command: `java -jar target/app.jar`
4. Add environment variables:
   - `DB_URL`: Your Railway MySQL connection string
   - `DB_USERNAME`: Database username
   - `DB_PASSWORD`: Database password
   - `JWT_SECRET`: Your JWT secret key (min 256 bits)
   - `WHATSAPP_ENABLED`: `true` or `false`
   - `WHATSAPP_API_URL`: Your WhatsApp API endpoint
   - `WHATSAPP_API_KEY`: Your WhatsApp API key

### Frontend on Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Add environment variable:
   - `VITE_API_BASE_URL`: Your Render backend URL

### Database on Railway

1. Create a new MySQL service
2. Copy the connection details
3. Update backend environment variables

## WhatsApp Notifications (Optional)

The application supports WhatsApp notifications using Twilio or UltraMSG API.

1. Get API credentials from your provider
2. Set environment variables in backend:
   - `WHATSAPP_ENABLED=true`
   - `WHATSAPP_API_URL`: Your API endpoint
   - `WHATSAPP_API_KEY`: Your API key

Notifications are sent when:
- A customer books a worker → Worker receives notification
- A worker accepts/rejects booking → Customer receives notification

## Key Features Implementation

### Geo-Based Search (Haversine Formula)

The application uses the Haversine formula to calculate distances between user location and worker locations:

```sql
SELECT w.*, 
  (6371 * acos(cos(radians(:lat)) * cos(radians(u.lat)) * 
  cos(radians(u.lon) - radians(:lon)) + 
  sin(radians(:lat)) * sin(radians(u.lat)))) AS distance 
FROM workers w 
INNER JOIN users u ON w.id = u.id 
WHERE w.service_type = :serviceType 
AND w.availability = true 
HAVING distance <= :radius 
ORDER BY distance ASC
```

### JWT Authentication

- Tokens are generated on login/register
- Tokens include user email, role, and userId
- Tokens are validated on each request
- Expired tokens result in 401 and redirect to login

## Demo Script

1. **Open the application** → Home page with service categories
2. **Choose a service** → Click on a service card (e.g., Electrician)
3. **View workers** → See list of nearby workers with map
4. **View worker profile** → Click on a worker card
5. **Book a worker** → Select date and time, confirm booking
6. **Check notifications** → Worker receives WhatsApp notification
7. **Worker dashboard** → Worker sees booking, accepts/rejects
8. **Customer dashboard** → Customer sees updated booking status

## Resume Points

- Developed a full-stack service worker marketplace enabling customers to discover and book electricians, plumbers, carpenters, and other local professionals.
- Implemented geo-based worker discovery using Haversine distance calculation, with JWT-secured role-based workflows (Customer/Worker/Admin).
- Built booking lifecycle (request → accept/reject → complete) and integrated WhatsApp notifications for real-time updates.
- Deployed backend on Render, frontend on Vercel, and database on Railway ensuring a production-grade architecture.

## License

MIT

