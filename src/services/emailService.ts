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
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ SMS sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ SMS send failed:', error);
    const smsLink = `sms:${to}?body=${encodeURIComponent(message)}`;
    window.open(smsLink, '_blank');
    return { success: true, fallback: true };
  }
};

export const sendFallbackEmail = (to: string, subject: string, body: string) => {
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, '_blank');
};