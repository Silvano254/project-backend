const AfricasTalking = require('africastalking');

// Initialize Africa's Talking
const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
};

let sms = null;

// Initialize only if credentials are available
if (credentials.apiKey && credentials.username) {
  try {
    const africastalking = AfricasTalking(credentials);
    sms = africastalking.SMS;
  } catch (err) {
    console.error('Failed to initialize Africa\'s Talking:', err.message);
  }
}

module.exports = {
  sendSms: async ({ to, message }) => {
    if (!sms) {
      throw new Error('Africa\'s Talking SMS service not configured. Check AFRICASTALKING_API_KEY and AFRICASTALKING_USERNAME environment variables.');
    }

    try {
      // Format phone number (ensure it starts with +)
      let formattedPhone = to;
      if (!formattedPhone.startsWith('+')) {
        // Assume Kenya country code if not provided
        formattedPhone = formattedPhone.startsWith('254') 
          ? `+${formattedPhone}` 
          : `+254${formattedPhone.replace(/^0/, '')}`;
      }

      const options = {
        to: [formattedPhone],
        message,
        from: process.env.AFRICASTALKING_SENDER_ID || undefined, // Optional sender ID
      };

      const response = await sms.send(options);
      
      // Check if message was sent successfully
      if (response.SMSMessageData && response.SMSMessageData.Recipients) {
        const recipients = response.SMSMessageData.Recipients;
        if (recipients.length > 0 && recipients[0].status === 'Success') {
          return {
            success: true,
            messageId: recipients[0].messageId,
            cost: recipients[0].cost,
          };
        }
      }

      throw new Error('SMS sending failed: ' + JSON.stringify(response));
    } catch (error) {
      console.error('SMS Service Error:', error.message);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  },
};
