# User Management Guide

## Admin Account

**Name:** Silvano Otieno  
**Phone:** 0746170866  
**Role:** Chairperson (Admin)

This is the only account in the system. You can now login using this phone number.

---

## Adding New Members

As an admin, you can register new members using the API:

### Register a New Member

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Member Name",
  "phone": "0712345678",
  "role": "member"
}
```

**Available Roles:**
- `chairperson` - Full admin access
- `vice_chairperson` - Vice chair dashboard
- `secretary` - Secretary dashboard
- `treasurer` - Treasurer dashboard
- `auditor` - Auditor dashboard
- `welfare_officer` - Welfare dashboard
- `committee_member` - Committee dashboard
- `member` - Regular member (default)

**Example using cURL:**
```bash
curl -X POST https://project-backend-production-e4aa.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "0712345678",
    "role": "member"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "phone": "0712345678",
    "role": "member",
    "createdAt": "2025-11-06T..."
  }
}
```

**Error Responses:**

- **409 (User Already Exists):**
```json
{
  "success": false,
  "message": "User already registered",
  "errorCode": "USER_ALREADY_EXISTS"
}
```

- **400 (Missing Fields):**
```json
{
  "message": "Name and phone are required"
}
```

---

## Login Flow

### For Registered Users:
1. User enters phone number
2. System checks if user exists
3. If exists: OTP is sent via SMS (or WhatsApp fallback)
4. User enters OTP
5. User is logged in

### For Unregistered Users:
1. User enters phone number
2. System checks if user exists
3. **User not found** → Error message:  
   *"Phone number not registered. Please contact your Chama administrator to register your account."*
4. User must contact admin to be registered

---

## Resetting the Database

To remove all users and recreate only the admin:

```bash
cd functions
npm run setup-admin
```

This will:
- Delete all existing users
- Create admin account (Silvano Otieno, 0746170866)

---

## Security Notes

- **OTP is valid for 5 minutes**
- Only registered phone numbers can request OTP
- The `/api/auth/register` endpoint should be protected in production (add authentication middleware)
- For now, you can use Postman or cURL to register new members
- Consider building an admin panel in the app for easier user management

---

## Next Steps

1. ✅ Admin account created
2. ✅ User registration check enabled
3. 🔲 Add authentication middleware to protect `/register` endpoint
4. 🔲 Build admin UI in Flutter app for user management
5. 🔲 Add user list, edit, and delete functionality

---

## Troubleshooting

**"User not found" error when trying to login:**
- The phone number is not registered in the database
- Use the `/register` endpoint to add the user first

**SMS not sending (401 error):**
- Africa's Talking API credentials need verification
- App will automatically offer WhatsApp fallback
- Check `.env` file for correct `AFRICASTALKING_API_KEY` and `AFRICASTALKING_USERNAME`

**Need to add multiple users at once:**
- Modify `setupAdmin.js` script to insert multiple users
- Or create a batch registration endpoint
