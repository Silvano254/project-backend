# Changelog

All notable changes to the Jirani Mwema Backend API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-06

### Added
- Initial release of Jirani Mwema Backend API
- OTP-based authentication system
- Biometric authentication support
- User management with role-based access control
- Contribution tracking and recording
- Loan management system (requests, approvals, repayments)
- Meeting management (scheduling, attendance, minutes)
- Welfare request and approval system
- Transaction history tracking
- Proxy contribution and attendance features
- Notification system (SMS via Africa's Talking)
- WhatsApp fallback for OTP delivery
- Reports endpoints (financial, member, loan reports)
- Approvals workflow for various request types
- MongoDB database integration
- Express.js REST API
- Environment-based configuration
- Error handling and logging
- CORS support for cross-origin requests

### Security
- JWT token-based authentication
- Secure password hashing with bcrypt
- Input validation and sanitization
- Role-based authorization
- OTP expiration (10 minutes)
- Session timeout management
- Environment variable protection

### Documentation
- Comprehensive README with setup instructions
- API endpoint documentation
- Contributing guidelines
- Security policy
- Code of conduct
- Environment variable templates
- Deployment guides (Firebase, Docker, Traditional)

### Infrastructure
- Docker support with Dockerfile and docker-compose.yml
- PowerShell startup script for Windows
- Firebase Functions integration
- MongoDB Atlas configuration
- Africa's Talking SMS integration
- Firebase Cloud Messaging setup

## [Unreleased]

### Planned
- Unit and integration tests
- API rate limiting
- Email notification support
- Advanced reporting with charts
- Audit logging system
- Database migrations
- API versioning
- Swagger/OpenAPI documentation
- Performance optimization
- Caching layer (Redis)
- Webhook support
- Export functionality (PDF, Excel)
- Two-factor authentication (2FA)
- Password recovery
- Account deactivation
- Bulk operations support

---

## Version Guidelines

- **MAJOR** version for incompatible API changes
- **MINOR** version for added functionality (backwards compatible)
- **PATCH** version for backwards compatible bug fixes

## Release Types

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
