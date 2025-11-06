# Deployment Guide

This guide covers different deployment options for the Jirani Mwema Backend API.

## Table of Contents
1. [Firebase Functions](#firebase-functions)
2. [Docker](#docker)
3. [Traditional Server](#traditional-server)
4. [Cloud Platforms](#cloud-platforms)

---

## Firebase Functions

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- Billing enabled (required for external API calls)

### Steps

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not already done)**
   ```bash
   firebase init functions
   ```

3. **Configure environment variables**
   ```bash
   firebase functions:config:set \
     mongodb.uri="your-mongodb-uri" \
     jwt.secret="your-jwt-secret" \
     africastalking.api_key="your-api-key" \
     africastalking.username="your-username"
   ```

4. **Deploy**
   ```bash
   cd jirani_mwema_backend
   firebase deploy --only functions
   ```

5. **View logs**
   ```bash
   firebase functions:log
   ```

### Accessing Your API
Your API will be available at:
```
https://us-central1-<your-project-id>.cloudfunctions.net/api
```

---

## Docker

### Prerequisites
- Docker installed
- Docker Compose installed (optional)

### Option 1: Docker Compose (Recommended)

1. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Build and run**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f api
   ```

4. **Stop**
   ```bash
   docker-compose down
   ```

### Option 2: Docker Only

1. **Build the image**
   ```bash
   docker build -t jirani-mwema-backend .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     -p 5001:5001 \
     --env-file .env \
     --name jirani-api \
     jirani-mwema-backend
   ```

3. **View logs**
   ```bash
   docker logs -f jirani-api
   ```

4. **Stop and remove**
   ```bash
   docker stop jirani-api
   docker rm jirani-api
   ```

---

## Traditional Server

### Prerequisites
- Node.js 18+ installed
- MongoDB access (Atlas or local)
- Server with public IP (for production)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jirani_mwema_backend/functions
   ```

2. **Install dependencies**
   ```bash
   npm install --production
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # or your preferred editor
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Using PM2 (Recommended for Production)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file** (`ecosystem.config.js`)
   ```javascript
   module.exports = {
     apps: [{
       name: 'jirani-api',
       script: 'src/app.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5001
       }
     }]
   };
   ```

3. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup  # Follow instructions to enable auto-start
   ```

4. **Monitoring**
   ```bash
   pm2 status
   pm2 logs jirani-api
   pm2 monit
   ```

### Nginx Reverse Proxy (Optional)

1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx** (`/etc/nginx/sites-available/jirani-api`)
   ```nginx
   server {
       listen 80;
       server_name api.jiranimwema.com;

       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable and restart**
   ```bash
   sudo ln -s /etc/nginx/sites-available/jirani-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.jiranimwema.com
   ```

---

## Cloud Platforms

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create jirani-mwema-api
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI="your-uri"
   heroku config:set JWT_SECRET="your-secret"
   # Set other variables
   ```

4. **Create Procfile**
   ```
   web: cd functions && node src/app.js
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### AWS EC2

1. **Launch EC2 instance** (Ubuntu 22.04 recommended)

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

4. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd jirani_mwema_backend/functions
   npm install --production
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env
   ```

6. **Use PM2** (see Traditional Server section)

7. **Configure Security Group**
   - Allow inbound traffic on port 5001 (or 80/443 if using Nginx)

### Google Cloud Run

1. **Install gcloud CLI**

2. **Configure project**
   ```bash
   gcloud config set project your-project-id
   ```

3. **Build and deploy**
   ```bash
   gcloud run deploy jirani-api \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars MONGODB_URI="your-uri"
   ```

### DigitalOcean App Platform

1. **Connect GitHub repository**

2. **Configure build settings**
   - Build Command: `cd functions && npm install`
   - Run Command: `cd functions && node src/app.js`

3. **Set environment variables** in the dashboard

4. **Deploy**

---

## Production Checklist

### Before Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Configure all environment variables
- [ ] Remove development dependencies
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for your domain
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Enable rate limiting
- [ ] Review security settings
- [ ] Test all API endpoints
- [ ] Configure firewall rules
- [ ] Set up CI/CD pipeline

### After Deployment
- [ ] Verify API is accessible
- [ ] Test authentication flow
- [ ] Check database connectivity
- [ ] Monitor logs for errors
- [ ] Set up health check monitoring
- [ ] Configure alerting
- [ ] Document API base URL
- [ ] Update client applications
- [ ] Perform load testing
- [ ] Create backup restore procedure

---

## Environment Variables for Production

```bash
# Required
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret-64-chars>
AFRICASTALKING_API_KEY=...
AFRICASTALKING_USERNAME=...

# Optional
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

## Monitoring

### Health Check Endpoint
```bash
curl https://your-api-url/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-06T10:30:00.000Z"
}
```

### Log Monitoring
- Set up log aggregation (e.g., CloudWatch, Loggly)
- Monitor error rates
- Track API response times
- Watch database connection pool

### Uptime Monitoring
Use services like:
- UptimeRobot
- Pingdom
- StatusCake

---

## Troubleshooting

### Common Issues

**API not starting**
- Check environment variables
- Verify MongoDB connection
- Review logs for errors

**Database connection failed**
- Check MongoDB URI format
- Verify IP whitelist (MongoDB Atlas)
- Ensure network connectivity

**OTP not sending**
- Verify Africa's Talking credentials
- Check account balance
- Review SMS logs

**High memory usage**
- Increase server resources
- Check for memory leaks
- Optimize database queries

---

## Rollback Procedure

### Firebase Functions
```bash
firebase functions:log  # Find previous deployment
# Redeploy previous version
```

### Docker
```bash
docker-compose down
docker-compose up -d --build <previous-tag>
```

### PM2
```bash
pm2 stop jirani-api
git checkout <previous-commit>
npm install
pm2 restart jirani-api
```

---

## Support

For deployment issues:
- Check troubleshooting section
- Review logs
- Contact development team
- Create GitHub issue

Happy deploying! 🚀
