# Security Notes - OTP Implementation

## ⚠️ IMPORTANT: Production Security Considerations

### OTP Code Exposure in API Response

**Current Implementation:**
The `/api/auth/request-otp` endpoint currently returns the OTP code in the response:

```json
{
  "success": true,
  "otp": "123456",
  "expiresAt": "2025-11-06T10:30:00.000Z"
}
```

**Why This Was Implemented:**
- To support WhatsApp fallback when SMS delivery fails
- Frontend needs the OTP code to send it via WhatsApp

**Security Risks:**
1. **Network Interception**: OTP codes visible in network traffic
2. **Logging**: May be logged in server/client logs
3. **Browser History**: API responses cached in browser dev tools
4. **Man-in-the-Middle**: Vulnerable if HTTPS is not enforced

---

## 🔒 Production Recommendations

### Option 1: Environment-Based OTP Exposure (Recommended)
Only expose OTP in development mode:

```javascript
// In authController.js
async function requestOtp(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    const result = await sendOtp(phone);
    
    const response = { 
      success: true, 
      expiresAt: result.expiresAt 
    };
    
    // Only include OTP in development mode
    if (process.env.NODE_ENV === 'development') {
      response.otp = result.otp;
    }
    
    return res.json(response);
  } catch (err) {
    next(err);
  }
}
```

### Option 2: Server-Side WhatsApp Integration
Move WhatsApp sending to the backend:

1. Create new endpoint: `/api/auth/request-otp-whatsapp`
2. Backend sends OTP directly via WhatsApp Business API
3. Frontend never sees the OTP code
4. More secure but requires WhatsApp Business API setup

```javascript
// New endpoint example
async function requestOtpWhatsApp(req, res, next) {
  try {
    const { phone } = req.body;
    const result = await sendOtp(phone);
    
    // Send via WhatsApp Business API
    await whatsappService.sendMessage({
      to: phone,
      message: `Your Jirani Mwema verification code is: ${result.otp}\n\nPlease do not share this code with anyone.\n\nThis code will expire in 5 minutes.`
    });
    
    return res.json({ success: true, method: 'whatsapp' });
  } catch (err) {
    next(err);
  }
}
```

### Option 3: Encrypted OTP Response
Encrypt the OTP in the response:

```javascript
const crypto = require('crypto');

async function requestOtp(req, res, next) {
  try {
    const { phone } = req.body;
    const result = await sendOtp(phone);
    
    // Encrypt OTP with shared secret
    const encryptedOtp = encryptOtp(result.otp, process.env.OTP_ENCRYPTION_KEY);
    
    return res.json({ 
      success: true, 
      otp: encryptedOtp, // Encrypted OTP
      expiresAt: result.expiresAt 
    });
  } catch (err) {
    next(err);
  }
}
```

---

## 📱 Current SMS Integration

**Africa's Talking Configuration:**
- API Key: `AFRICASTALKING_API_KEY` (from .env)
- Username: `AFRICASTALKING_USERNAME` (from .env)
- Package: `africastalking` npm package

**Features:**
- Automatic phone number formatting (Kenya +254)
- Error handling and logging
- Optional sender ID support
- Success/failure tracking

**Error Handling:**
- SMS failures don't block OTP generation
- OTP is still created in database even if SMS fails
- This allows WhatsApp fallback to work

---

## 🔐 Best Practices Implemented

1. **OTP Expiration**: 5 minutes (configurable)
2. **Code Invalidation**: Previous unused codes invalidated on new request
3. **One-Time Use**: OTPs marked as used after verification
4. **Database Storage**: Secure storage in MongoDB
5. **Error Logging**: SMS failures logged but don't crash the system

---

## 🚀 Production Deployment Checklist

Before going to production:

- [ ] Enable HTTPS/TLS for all API endpoints
- [ ] Implement environment-based OTP exposure (Option 1)
- [ ] Add rate limiting on OTP request endpoints
- [ ] Implement IP-based throttling (max 3 OTP requests per IP per hour)
- [ ] Add phone number validation (prevent spam)
- [ ] Set up monitoring/alerting for failed SMS deliveries
- [ ] Consider implementing CAPTCHA on OTP request
- [ ] Add audit logging for all OTP operations
- [ ] Review and update CORS settings
- [ ] Implement request signing/verification
- [ ] Add phone number blacklist functionality
- [ ] Set up SMS cost monitoring (Africa's Talking credits)

---

## 📊 Monitoring Recommendations

Track these metrics:
- OTP request rate (per user, per IP)
- SMS delivery success rate
- WhatsApp fallback usage rate
- OTP verification success rate
- Time between OTP request and verification
- Failed verification attempts

---

## 🔄 Current Architecture

```
Client (Flutter) 
    ↓
Request OTP with fallback
    ↓
Backend API (/api/auth/request-otp)
    ↓
├─ Generate OTP (6 digits)
├─ Save to Database (MongoDB)
├─ Try Send SMS (Africa's Talking)
│   ├─ Success: Return {success, otp, expiresAt}
│   └─ Failure: Still Return {success, otp, expiresAt}
└─ Return Response
    ↓
Client receives OTP
    ↓
If SMS failed: Show WhatsApp fallback dialog
    ↓
Open WhatsApp with pre-filled message
    ↓
User enters OTP manually
    ↓
Verify OTP (/api/auth/verify-otp)
```

---

## 📝 Notes

- Current implementation prioritizes development speed and reliability
- WhatsApp fallback uses URL scheme (wa.me) - doesn't require Business API
- SMS is primary method, WhatsApp is manual fallback
- Consider migrating to server-side WhatsApp sending for better security
- Always use environment variables for sensitive credentials
- Never commit .env files to version control

---

Last Updated: November 6, 2025
