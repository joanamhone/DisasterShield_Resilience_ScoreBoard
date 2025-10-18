// Vercel serverless function for sending SMS via Twilio
const twilio = require('twilio');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message } = req.body;

    // Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return res.status(500).json({ error: 'Twilio credentials not configured' });
    }

    const client = twilio(accountSid, authToken);

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });

    console.log('SMS sent successfully:', result.sid);
    
    res.status(200).json({ 
      success: true, 
      messageSid: result.sid,
      status: result.status 
    });

  } catch (error) {
    console.error('SMS send error:', error);
    res.status(500).json({ 
      error: 'Failed to send SMS', 
      details: error.message 
    });
  }
}