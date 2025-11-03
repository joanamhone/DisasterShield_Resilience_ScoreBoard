import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY !== 'your_public_key') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export const sendRealEmail = async (to: string, subject: string, body: string, alertData?: any) => {
  try {
    console.log('📧 EmailJS Config:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing'
    });
    
    if (EMAILJS_PUBLIC_KEY === 'your_public_key' || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.warn('⚠️ EmailJS not properly configured, using fallback');
      return { success: false, error: 'EmailJS not configured' };
    }
    
    const templateParams = {
      to_email: to,
      to_name: to.split('@')[0],
      subject: subject,
      message: body,
      alert_type: alertData?.alertType || 'general',
      severity: alertData?.severity || 'medium',
      severity_color: alertData?.severity === 'critical' ? '#DC2626' : alertData?.severity === 'high' ? '#EF4444' : alertData?.severity === 'medium' ? '#F59E0B' : '#3B82F6',
      from_name: 'DisasterShield Alert System',
      from_email: 'ekarimagaleta@gmail.com',
      alert_title: alertData?.title || 'Community Alert',
      alert_message: alertData?.message || body,
      timestamp: new Date().toLocaleString(),
      reply_to: 'ekarimagaleta@gmail.com'
    };

    console.log('📧 Sending email with params:', templateParams);
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, error };
  }
};

export const sendRealSMS = async (to: string, message: string) => {
  try {
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

    console.log('📱 Twilio Config:', {
      accountSid: accountSid ? 'Set' : 'Missing',
      authToken: authToken ? 'Set' : 'Missing',
      fromNumber: fromNumber ? 'Set' : 'Missing'
    });

    if (accountSid && authToken && fromNumber) {
      console.log('📱 Attempting Twilio SMS to:', to);
      
      // Note: Direct Twilio API calls from browser will fail due to CORS
      // This is expected - we'll use the fallback
      console.warn('⚠️ Direct Twilio API calls blocked by CORS, using fallback');
      throw new Error('CORS blocked - using fallback');
    } else {
      console.warn('⚠️ Twilio credentials missing, using fallback');
      throw new Error('Twilio credentials not configured');
    }
  } catch (error) {
    console.log('📱 Using SMS fallback (opening SMS app):', error.message);
    const smsLink = `sms:${to}?body=${encodeURIComponent(message)}`;
    
    // Show notification that SMS app is opening
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📱 SMS Alert', {
        body: `Opening SMS app to send alert to ${to}`,
        icon: '/favicon.ico'
      });
    }
    
    window.open(smsLink, '_blank');
    return { success: true, fallback: true };
  }
};

export const sendFallbackEmail = (to: string, subject: string, body: string) => {
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, '_blank');
};