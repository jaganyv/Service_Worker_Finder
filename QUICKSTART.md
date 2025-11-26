# Quick Start Guide

Get the Service Worker Finder up and running locally in 5 minutes.

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 18+
- MySQL 8.0+

## Quick Setup

### 1. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE worker_finder;
EXIT;
```

### 2. Backend Setup

```bash
cd backend

# Update application.yml with your database credentials
# Edit: src/main/resources/application.yml
# Set: DB_URL, DB_USERNAME, DB_PASSWORD

# Run the application
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080" > .env

# Start dev server
npm run dev
```

Frontend will start on `http://localhost:5173`

## Test the Application

1. **Register as Customer**
   - Go to `http://localhost:5173/register`
   - Fill in details (uncheck "Register as worker")
   - Submit

2. **Register as Worker**
   - Logout
   - Register again with "Register as worker" checked
   - After login, go to Dashboard
   - Complete worker profile (service type, experience, price)

3. **Book a Worker**
   - Login as customer
   - Go to Home page
   - Click on a service category
   - View workers on map
   - Click "View Profile" on a worker
   - Click "Book This Worker"
   - Select date and time
   - Confirm booking

4. **Worker Accepts Booking**
   - Login as worker
   - Go to Dashboard
   - See pending booking
   - Click "Accept"

5. **Check Status**
   - Login as customer
   - Go to "My Bookings"
   - See updated status

## Default Admin Account

To create an admin account, you can manually insert into the database:

```sql
INSERT INTO users (name, email, password, phone, role, created_at) 
VALUES ('Admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1234567890', 'ADMIN', NOW());
```

Password: `admin123`

## Troubleshooting

**Backend won't start:**
- Check MySQL is running
- Verify database credentials in `application.yml`
- Check port 8080 is not in use

**Frontend can't connect:**
- Verify backend is running
- Check `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

**Database connection fails:**
- Ensure MySQL is running: `sudo systemctl status mysql`
- Check user has permissions: `GRANT ALL ON worker_finder.* TO 'user'@'localhost';`

## Next Steps

- Read [README.md](README.md) for full documentation
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize service types in `ServiceType.java`
- Enable WhatsApp notifications (see README)

## Development Tips

- Backend hot reload: Use Spring Boot DevTools
- Frontend hot reload: Vite handles this automatically
- Database changes: Hibernate auto-updates schema
- Check logs: Backend logs in console, Frontend in browser console

Happy coding! 🚀

