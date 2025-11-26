# Deployment Guide

This guide walks you through deploying the Service Worker Finder application to production.

## Prerequisites

- GitHub account
- Render account (for backend)
- Vercel account (for frontend)
- Railway account (for database)

## Step 1: Database Setup (Railway)

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project" → "Provision MySQL"
3. Once created, click on the MySQL service
4. Go to the "Variables" tab and note down:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
5. The connection URL format is:
   ```
   jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE
   ```

## Step 2: Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com) and sign in
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `service-finder-backend`
   - **Environment**: `Java`
   - **Build Command**: `mvn -DskipTests package`
   - **Start Command**: `java -jar target/app.jar`
   - **Instance Type**: Free tier is fine for testing

6. Add Environment Variables:
   ```
   DB_URL=jdbc:mysql://your-railway-host:3306/your-database
   DB_USERNAME=your-railway-username
   DB_PASSWORD=your-railway-password
   JWT_SECRET=your-secret-key-minimum-256-bits-long-for-security
   WHATSAPP_ENABLED=false
   PORT=10000
   ```

7. Click "Create Web Service"
8. Wait for deployment to complete
9. Note your backend URL (e.g., `https://service-finder-backend.onrender.com`)

## Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

6. Click "Deploy"
7. Wait for deployment to complete
8. Your frontend will be live at `https://your-project.vercel.app`

## Step 4: WhatsApp Integration (Optional)

If you want to enable WhatsApp notifications:

### Option 1: Twilio

1. Sign up at [Twilio](https://www.twilio.com)
2. Get your API credentials
3. Update backend environment variables:
   ```
   WHATSAPP_ENABLED=true
   WHATSAPP_API_URL=https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
   WHATSAPP_API_KEY=your-twilio-auth-token
   ```

### Option 2: UltraMSG

1. Sign up at [UltraMSG](https://ultramsg.com)
2. Get your API credentials
3. Update backend environment variables:
   ```
   WHATSAPP_ENABLED=true
   WHATSAPP_API_URL=https://api.ultramsg.com/instance-id/messages/chat
   WHATSAPP_API_KEY=your-ultramsg-token
   ```

## Step 5: Testing

1. Visit your frontend URL
2. Register a new customer account
3. Register a worker account
4. Test the booking flow
5. Verify notifications (if enabled)

## Troubleshooting

### Backend Issues

- **Build fails**: Check Maven version and Java version
- **Database connection fails**: Verify Railway credentials and network access
- **JWT errors**: Ensure JWT_SECRET is at least 256 bits

### Frontend Issues

- **API calls fail**: Verify VITE_API_BASE_URL is correct
- **CORS errors**: Check backend CORS configuration
- **Build fails**: Check Node.js version (18+)

### Database Issues

- **Connection timeout**: Check Railway service status
- **Table not found**: Database will auto-create on first run

## Environment Variables Summary

### Backend (Render)
```
DB_URL=jdbc:mysql://...
DB_USERNAME=...
DB_PASSWORD=...
JWT_SECRET=...
WHATSAPP_ENABLED=false
WHATSAPP_API_URL=...
WHATSAPP_API_KEY=...
PORT=10000
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## Post-Deployment

1. Test all user flows
2. Monitor logs for errors
3. Set up error tracking (optional)
4. Configure custom domain (optional)
5. Set up SSL certificates (automatic on Vercel/Render)

## Cost Estimation

- **Railway**: Free tier includes 500MB database
- **Render**: Free tier includes 750 hours/month
- **Vercel**: Free tier includes unlimited deployments
- **Total**: $0/month for small-scale usage

For production scale, consider paid tiers:
- Railway: $5/month for 1GB database
- Render: $7/month for always-on service
- Vercel: Free tier is usually sufficient

