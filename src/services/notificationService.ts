import { supabase } from '../lib/supabase';

export interface NotificationPayload {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  alertType: 'weather' | 'flood' | 'fire' | 'earthquake' | 'general';
  expiresAt?: string;
}

export interface NotificationRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  preferredMethod?: string[];
}

class NotificationService {
  async sendNotification(
    recipients: NotificationRecipient[],
    payload: NotificationPayload,
    methods: string[]
  ): Promise<{ success: boolean; delivered: number; failed: number }> {
    let delivered = 0;
    let failed = 0;

    for (const recipient of recipients) {
      for (const method of methods) {
        try {
          switch (method) {
            case 'email':
              if (recipient.email) {
                await this.sendEmail(recipient, payload);
                delivered++;
              }
              break;
            case 'sms':
              if (recipient.phone) {
                await this.sendSMS(recipient, payload);
                delivered++;
              }
              break;
            case 'push':
              await this.sendPushNotification(recipient, payload);
              delivered++;
              break;
          }
        } catch (error) {
          console.error(`Failed to send ${method} to ${recipient.name}:`, error);
          failed++;
        }
      }
    }

    return { success: true, delivered, failed };
  }

  private async sendEmail(recipient: NotificationRecipient, payload: NotificationPayload): Promise<void> {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    const emailTemplate = this.generateEmailTemplate(payload);
    
    console.log(`📧 Email sent to ${recipient.email}:`);
    console.log(`Subject: ${payload.title}`);
    console.log(`Body: ${emailTemplate}`);

    // Store notification log
    await this.logNotification(recipient.id, 'email', payload.title, 'sent');
  }

  private async sendSMS(recipient: NotificationRecipient, payload: NotificationPayload): Promise<void> {
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    const smsMessage = this.generateSMSMessage(payload);
    
    console.log(`📱 SMS sent to ${recipient.phone}:`);
    console.log(`Message: ${smsMessage}`);

    // Store notification log
    await this.logNotification(recipient.id, 'sms', payload.title, 'sent');
  }

  private async sendPushNotification(recipient: NotificationRecipient, payload: NotificationPayload): Promise<void> {
    // In production, integrate with push service (Firebase FCM, etc.)
    console.log(`🔔 Push notification sent to ${recipient.name}:`);
    console.log(`Title: ${payload.title}`);
    console.log(`Body: ${payload.message}`);

    // Store notification log
    await this.logNotification(recipient.id, 'push', payload.title, 'sent');
  }

  private generateEmailTemplate(payload: NotificationPayload): string {
    const severityColors = {
      low: '#3B82F6',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626'
    };

    const alertIcons = {
      weather: '🌤️',
      flood: '🌊',
      fire: '🔥',
      earthquake: '🌍',
      general: '📢'
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${severityColors[payload.severity]}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">
            ${alertIcons[payload.alertType]} ${payload.title}
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
            Severity: ${payload.severity.toUpperCase()}
          </p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            ${payload.message}
          </p>
          ${payload.expiresAt ? `
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              This alert expires on: ${new Date(payload.expiresAt).toLocaleString()}
            </p>
          ` : ''}
          <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3;">
            <p style="margin: 0; font-size: 14px; color: #1976d2;">
              Stay safe and follow local emergency guidelines.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private generateSMSMessage(payload: NotificationPayload): string {
    const alertIcons = {
      weather: '🌤️',
      flood: '🌊',
      fire: '🔥',
      earthquake: '🌍',
      general: '📢'
    };

    return `${alertIcons[payload.alertType]} ALERT [${payload.severity.toUpperCase()}]: ${payload.title}\n\n${payload.message}\n\nStay safe!`;
  }

  private async logNotification(
    recipientId: string,
    method: string,
    title: string,
    status: 'sent' | 'failed'
  ): Promise<void> {
    try {
      await supabase.from('notification_logs').insert({
        recipient_id: recipientId,
        delivery_method: method,
        title,
        status,
        sent_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  async getNotificationHistory(userId: string): Promise<any[]> {
    try {
      const { data: logs } = await supabase
        .from('notification_logs')
        .select('*')
        .eq('recipient_id', userId)
        .order('sent_at', { ascending: false })
        .limit(50);

      return logs || [];
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: { email: boolean; sms: boolean; push: boolean }
  ): Promise<boolean> {
    try {
      const methods = [];
      if (preferences.email) methods.push('email');
      if (preferences.sms) methods.push('sms');
      if (preferences.push) methods.push('push');

      await supabase
        .from('users')
        .update({ notification_preferences: methods })
        .eq('id', userId);

      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();