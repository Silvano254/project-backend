# Jirani Mwema Backend API

A Node.js/Express backend API for the Jirani Mwema Chama (savings group) management system. This API provides comprehensive endpoints for managing members, contributions, loans, meetings, welfare requests, and more.

## Features

- 🔐 **Authentication & Authorization**
  - OTP-based phone authentication
  - Biometric authentication support
  - JWT token-based sessions
  - Role-based access control

- 👥 **Member Management**
  - User registration and profiles
  - Role assignment (Member, Chairperson, Treasurer, Secretary, etc.)
  - Member directory and search

- 💰 **Financial Management**
  - Contribution tracking
  - Loan management (requests, approvals, repayments)
  - Transaction history
  - Account balances

- 📅 **Meeting Management**
  - Meeting scheduling
  - Attendance tracking
  - Minutes recording

- 🤝 **Welfare System**
  - Welfare request submissions
  - Request approvals
  - Disbursement tracking

- 📊 **Reports & Analytics**
  - Financial reports
  - Member activity reports
  - Loan portfolio reports

- 🔔 **Notifications**
  - SMS notifications via Africa's Talking
  - WhatsApp fallback for OTP
  - Push notifications via Firebase

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, OTP
- **SMS Service**: Africa's Talking
- **Push Notifications**: Firebase Cloud Messaging

## Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account or local MongoDB instance
- Africa's Talking account for SMS
- Firebase project for push notifications (optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jirani_mwema_backend
   ```

2. **Install dependencies**
   ```bash
   cd functions
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your actual values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random secret key
   - `AFRICASTALKING_API_KEY`: Your Africa's Talking API key
   - `AFRICASTALKING_USERNAME`: Your Africa's Talking username

4. **Start the server**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

   Using PowerShell script (Windows):
   ```powershell
   powershell -ExecutionPolicy Bypass -File start-server.ps1
   ```

## API Endpoints

### Authentication
- `POST /api/auth/request-otp` - Request OTP for phone number
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user
- `GET /api/users/profile` - Get user profile
- `GET /api/users/biometric` - Get biometric settings
- `PUT /api/users/biometric` - Update biometric settings

### Contributions
- `POST /api/contributions` - Record a contribution
- `GET /api/contributions` - Get all contributions
- `GET /api/contributions/user/:userId` - Get user's contributions

### Loans
- `POST /api/loans` - Request a loan
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get specific loan
- `PUT /api/loans/:id/approve` - Approve loan (treasurer only)
- `PUT /api/loans/:id/reject` - Reject loan (treasurer only)
- `POST /api/loans/:id/repay` - Record loan repayment

### Meetings
- `POST /api/meetings` - Schedule a meeting
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/:id` - Get specific meeting
- `PUT /api/meetings/:id` - Update meeting
- `POST /api/meetings/:id/attendance` - Record attendance

### Welfare
- `POST /api/welfare/requests` - Submit welfare request
- `GET /api/welfare/requests` - Get all welfare requests
- `PUT /api/welfare/requests/:id/approve` - Approve request
- `PUT /api/welfare/requests/:id/reject` - Reject request

### Transactions
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/user/:userId` - Get user transactions

### Approvals
- `GET /api/approvals/pending` - Get pending approvals
- `POST /api/approvals/:id/approve` - Approve request
- `POST /api/approvals/:id/reject` - Reject request

### Reports
- `GET /api/reports/:type` - Generate report by type

### Notifications
- `POST /api/notifications/send` - Send notification
- `GET /api/notifications/user/:userId` - Get user notifications

## Project Structure

```
jirani_mwema_backend/
├── functions/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration files
│   │   └── app.js           # Express app setup
│   ├── .env                 # Environment variables (not in git)
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies
│   └── start-server.ps1     # Windows startup script
├── .gitignore
└── README.md
```

## Environment Variables

See `.env.example` for all available environment variables and their descriptions.

### Required Variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `AFRICASTALKING_API_KEY` - Africa's Talking API key
- `AFRICASTALKING_USERNAME` - Africa's Talking username

### Optional Variables:
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `FIREBASE_*` - Firebase credentials for push notifications

## Security Features

- 🔒 JWT-based authentication
- 🔐 Biometric authentication support
- 📱 OTP verification via SMS
- 🛡️ Role-based access control
- 🔑 Password hashing with bcrypt
- ⏱️ Session timeout management
- 🚫 Rate limiting (recommended for production)

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding
```bash
npm run seed
```

## Deployment

### Firebase Functions (Recommended)
```bash
firebase deploy --only functions
```

### Docker
```bash
docker build -t jirani-mwema-backend .
docker run -p 5001:5001 jirani-mwema-backend
```

### Traditional Server
1. Set environment variables in production
2. Install dependencies: `npm install --production`
3. Start server: `npm start`
4. Use PM2 for process management: `pm2 start src/app.js`

## Troubleshooting

### Server won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify all required environment variables are set

### OTP not sending
- Verify Africa's Talking credentials
- Check phone number format (+254...)
- Ensure sufficient Africa's Talking credits

### Database connection issues
- Check MongoDB URI format
- Verify network connectivity
- Check MongoDB Atlas cluster status

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

Proprietary - Jirani Mwema Chama Management System

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Core authentication system
- Member management
- Financial operations (contributions, loans)
- Meeting management
- Welfare system
- SMS notifications
- Biometric authentication support
