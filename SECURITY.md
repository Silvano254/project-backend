# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **Do Not** Create a Public Issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Report Privately

Send a detailed report to the development team via:
- Email: security@jiranimwema.com (preferred)
- Or create a private security advisory on GitHub

### 3. Include in Your Report

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Components**: Which parts of the system are affected
- **Suggested Fix**: If you have ideas for a fix (optional)
- **Your Contact**: How we can reach you for follow-up

### 4. What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Assessment**: Initial assessment within 5 business days
- **Updates**: Regular updates on the status
- **Resolution**: We aim to resolve critical issues within 30 days
- **Credit**: Security researchers will be credited (unless they prefer anonymity)

## Security Best Practices for Contributors

### Environment Variables

- Never commit `.env` files
- Use `.env.example` for templates only
- Rotate credentials regularly
- Use strong, unique passwords
- Store secrets in secure vaults in production

### Authentication & Authorization

- Always use JWT tokens for API authentication
- Implement proper role-based access control
- Validate and sanitize all user inputs
- Use bcrypt for password hashing (if applicable)
- Implement rate limiting on authentication endpoints

### Database Security

- Use parameterized queries (Mongoose handles this)
- Implement proper access controls
- Never expose MongoDB directly to the internet
- Use MongoDB Atlas IP whitelisting
- Enable MongoDB authentication
- Regularly backup data

### API Security

- Validate all input data
- Sanitize output data
- Use HTTPS in production
- Implement CORS properly
- Add rate limiting to prevent abuse
- Log security-relevant events

### Code Security

```javascript
// Good - Input validation
if (!req.body.amount || typeof req.body.amount !== 'number' || req.body.amount <= 0) {
  return res.status(400).json({ error: 'Invalid amount' });
}

// Good - Sanitize outputs
const safeUser = {
  id: user._id,
  name: user.name,
  role: user.role
  // Don't expose sensitive fields
};

// Bad - No validation
const amount = req.body.amount; // Unsafe
await processPayment(amount);
```

### Dependencies

- Keep dependencies up to date
- Audit dependencies regularly: `npm audit`
- Review dependency changes before updating
- Use exact versions in production
- Scan for known vulnerabilities

### Secrets Management

- Use environment variables for secrets
- Never hardcode API keys or passwords
- Rotate secrets regularly
- Use different credentials for dev/staging/production
- Implement secret rotation policies

## Known Security Considerations

### SMS/OTP Security

- OTPs expire after 10 minutes
- Rate limit OTP requests (max 3 per hour per phone)
- Log all OTP attempts
- Use HTTPS for OTP transmission

### JWT Token Security

- Tokens expire after 24 hours
- Use strong JWT secrets (min 32 characters)
- Implement token refresh mechanism
- Store tokens securely on client side
- Invalidate tokens on logout

### Data Protection

- Encrypt sensitive data at rest
- Use HTTPS for data in transit
- Implement proper backup procedures
- Follow data retention policies
- Comply with data protection regulations

### Biometric Data

- Store only biometric status (enabled/disabled)
- Never store actual biometric data on server
- Biometric verification happens on device
- Sync only settings, not biometric templates

## Security Checklist for Deployment

- [ ] All environment variables configured
- [ ] MongoDB IP whitelist configured
- [ ] HTTPS enabled with valid certificate
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set (helmet.js)
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured for security events
- [ ] Backup procedures in place
- [ ] Secrets rotated from development
- [ ] Dependencies audited and updated
- [ ] API documentation reviewed for security
- [ ] Penetration testing completed (if applicable)

## Compliance

This application handles financial and personal data. Ensure compliance with:

- Local data protection laws
- Financial regulations
- Privacy requirements
- Industry standards

## Security Updates

We release security updates as needed. Subscribe to:
- GitHub Security Advisories
- Release notifications
- Security mailing list (if available)

## Contact

For security concerns:
- Email: security@jiranimwema.com
- GitHub Security Advisory (for severe vulnerabilities)

Thank you for helping keep Jirani Mwema secure! 🔒
