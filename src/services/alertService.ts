import { supabase } from '../lib/supabase';

export interface AlertData {
  alertType: 'weather' | 'flood' | 'fire' | 'earthquake' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  targetAudience: 'all' | 'community' | 'region' | 'specific_group';
  targetCommunityId?: string;
  deliveryMethod: string[];
  expiresInHours: number;
}

export interface AlertRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  communityId?: string;
}

class AlertService {
  async sendCommunityAlert(senderId: string, alertData: AlertData): Promise<{ success: boolean; alertId?: string; error?: string }> {
    try {
      console.log('🚀 Starting alert send process...');
      console.log('📋 Alert Data:', alertData);
      console.log('👤 Sender ID:', senderId);
      
      // Request notification permission at the start
      if ('Notification' in window && Notification.permission === 'default') {
        console.log('🔔 Requesting notification permission...');
        const permission = await Notification.requestPermission();
        console.log('🔔 Permission result:', permission);
      }
      // Calculate expiration time
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + alertData.expiresInHours);

      // Get recipients count
      console.log('👥 Getting recipients count...');
      const recipientsCount = await this.getRecipientsCount(senderId, alertData);
      console.log('👥 Recipients count:', recipientsCount);

      // Insert alert into database
      console.log('💾 Inserting alert into database...');
      const { data: alert, error: insertError } = await supabase
        .from('alerts')
        .insert({
          sender_id: senderId,
          alert_type: alertData.alertType,
          severity: alertData.severity,
          title: alertData.title,
          message: alertData.message,
          target_audience: alertData.targetAudience,
          target_community_id: alertData.targetCommunityId || null,
          recipients_count: recipientsCount,
          delivery_method: alertData.deliveryMethod,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw insertError;
      }
      console.log('✅ Alert inserted with ID:', alert.id);

      // Send notifications to recipients
      console.log('📤 Starting notification delivery...');
      await this.deliverAlert(alert.id, alertData);
      console.log('✅ Notification delivery completed');
      
      // Show success message with delivery details
      const recipients = await this.getRecipients(alertData);
      
      // Show browser notification for sender
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Community Alert Sent Successfully! 🎯', {
          body: `"${alertData.title}" sent to ${recipients.length} recipients via ${alertData.deliveryMethod.join(', ')}`,
          icon: '/favicon.ico'
        });
      }
      
      console.log(`🎯 Alert "${alertData.title}" sent successfully!`);
      console.log(`📊 Delivery Summary:`);
      console.log(`   • Recipients: ${recipients.length}`);
      console.log(`   • Methods: ${alertData.deliveryMethod.join(', ')}`);
      console.log(`   • Severity: ${alertData.severity.toUpperCase()}`);
      console.log(`   • Type: ${alertData.alertType}`);
      console.log(`   • Expires: ${expiresAt.toLocaleString()}`);

      // Update sender's progress tracking
      await this.updateSenderProgress(senderId);

      return { success: true, alertId: alert.id };
    } catch (error) {
      console.error('Error sending alert:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  private async getRecipientsCount(senderId: string, alertData: AlertData): Promise<number> {
    try {
      if (alertData.targetAudience === 'all') {
        // Count all members in sender's communities
        const { data: communities } = await supabase
          .from('community_groups')
          .select('total_members')
          .eq('leader_id', senderId);

        return communities?.reduce((sum, c) => sum + (c.total_members || 0), 0) || 0;
      } else if (alertData.targetAudience === 'community' && alertData.targetCommunityId) {
        // Count members in specific community
        const { data: community } = await supabase
          .from('community_groups')
          .select('total_members')
          .eq('id', alertData.targetCommunityId)
          .single();

        return community?.total_members || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating recipients count:', error);
      return 0;
    }
  }

  private async deliverAlert(alertId: string, alertData: AlertData): Promise<void> {
    try {
      // Get recipients based on target audience
      console.log('👥 Getting recipients for delivery...');
      const recipients = await this.getRecipients(alertData);
      console.log(`📊 Found ${recipients.length} recipients`);

      if (recipients.length === 0) {
        console.warn('⚠️ No recipients found - creating demo notification');
        // Show demo notification if no recipients
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🚨 DEMO ALERT SENT', {
            body: `"${alertData.title}" - No recipients in database, showing demo notification`,
            icon: '/favicon.ico'
          });
        }
        return;
      }

      // Send notifications via selected delivery methods
      console.log('📤 Processing delivery methods:', alertData.deliveryMethod);
      for (const method of alertData.deliveryMethod) {
        console.log(`📨 Processing ${method} notifications...`);
        switch (method) {
          case 'email':
            await this.sendEmailNotifications(recipients, alertData);
            break;
          case 'sms':
            await this.sendSMSNotifications(recipients, alertData);
            break;
          case 'push':
            await this.sendPushNotifications(recipients, alertData);
            break;
        }
      }

      // Log delivery status
      await this.logDeliveryStatus(alertId, recipients.length);
    } catch (error) {
      console.error('Error delivering alert:', error);
    }
  }

  private async getRecipients(alertData: AlertData): Promise<AlertRecipient[]> {
    try {
      console.log('🔍 Getting recipients for target audience:', alertData.targetAudience);
      
      let query = supabase.from('community_members').select(`
        id,
        name,
        phone_number,
        user_id,
        community_id,
        users!inner(email, phone_number)
      `);

      if (alertData.targetAudience === 'community' && alertData.targetCommunityId) {
        console.log('🎯 Filtering by community ID:', alertData.targetCommunityId);
        query = query.eq('community_id', alertData.targetCommunityId);
      }

      const { data: members, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching members:', error);
        return [];
      }
      
      console.log('👥 Raw members data:', members);

      const recipients = members?.map(member => ({
        id: member.id,
        name: member.name,
        email: member.users?.email,
        phone: member.phone_number || member.users?.phone_number,
        communityId: member.community_id
      })) || [];
      
      console.log('📋 Processed recipients:', recipients);
      return recipients;
    } catch (error) {
      console.error('Error getting recipients:', error);
      return [];
    }
  }

  private async sendEmailNotifications(recipients: AlertRecipient[], alertData: AlertData): Promise<void> {
    for (const recipient of recipients) {
      if (recipient.email) {
        await this.sendEmail(recipient.email, alertData);
      }
    }
  }

  private async sendSMSNotifications(recipients: AlertRecipient[], alertData: AlertData): Promise<void> {
    for (const recipient of recipients) {
      if (recipient.phone) {
        await this.sendSMS(recipient.phone, alertData);
      }
    }
  }

  private async sendPushNotifications(recipients: AlertRecipient[], alertData: AlertData): Promise<void> {
    console.log(`🔔 Sending push notifications to ${recipients.length} recipients`);
    for (const recipient of recipients) {
      await this.sendPushNotification(recipient, alertData);
    }
  }

  private async sendEmail(email: string, alertData: AlertData): Promise<void> {
    try {
      console.log(`📧 Sending email to: ${email}`);
      
      // Send actual email using browser's mailto or web API
      const emailContent = {
        to: email,
        subject: `🚨 ${alertData.severity.toUpperCase()} ALERT: ${alertData.title}`,
        body: this.generateEmailText(alertData)
      };

      // Create mailto link for immediate action
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;
      
      console.log('📧 Opening email client with link:', mailtoLink);
      // Open email client
      window.open(mailtoLink, '_blank');

      // Store in database for tracking
      const { error: logError } = await supabase.from('notification_logs').insert({
        delivery_method: 'email',
        title: alertData.title,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
      
      if (logError) {
        console.warn('⚠️ Failed to log email notification:', logError);
      }

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`📧 Email Alert Sent`, {
          body: `Alert sent to ${email}: ${alertData.title}`,
          icon: '/favicon.ico'
        });
      }

      console.log(`✅ Email notification triggered for ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${email}:`, error);
    }
  }

  private async sendSMS(phone: string, alertData: AlertData): Promise<void> {
    try {
      const message = `🚨 ${alertData.severity.toUpperCase()} ALERT: ${alertData.title}\n\n${alertData.message}\n\nStay safe!`;
      
      // Create SMS link for mobile devices
      const smsLink = `sms:${phone}?body=${encodeURIComponent(message)}`;
      
      // Open SMS app
      window.open(smsLink, '_blank');

      // Store in database for tracking
      await supabase.from('notification_logs').insert({
        delivery_method: 'sms',
        title: alertData.title,
        status: 'sent',
        sent_at: new Date().toISOString()
      });

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`SMS Alert Sent`, {
          body: `Alert sent to ${phone}: ${alertData.title}`,
          icon: '/favicon.ico'
        });
      }

      console.log(`✅ SMS notification triggered for ${phone}`);
    } catch (error) {
      console.error(`❌ Failed to send SMS to ${phone}:`, error);
    }
  }

  private async sendPushNotification(recipient: AlertRecipient, alertData: AlertData): Promise<void> {
    try {
      // Request notification permission if not granted
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
        
        if (Notification.permission === 'granted') {
          // Send browser push notification
          const notification = new Notification(`🚨 ${alertData.severity.toUpperCase()} ALERT`, {
            body: `${alertData.title}\n\n${alertData.message}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `alert-${Date.now()}`,
            requireInteraction: alertData.severity === 'critical',
            actions: [
              { action: 'view', title: 'View Details' },
              { action: 'dismiss', title: 'Dismiss' }
            ]
          });

          // Handle notification click
          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          // Auto-close after 10 seconds for non-critical alerts
          if (alertData.severity !== 'critical') {
            setTimeout(() => notification.close(), 10000);
          }
        }
      }

      // Store in database for tracking
      await supabase.from('notification_logs').insert({
        delivery_method: 'push',
        title: alertData.title,
        status: 'sent',
        sent_at: new Date().toISOString()
      });

      console.log(`✅ Push notification sent to ${recipient.name}`);
    } catch (error) {
      console.error(`❌ Failed to send push notification to ${recipient.name}:`, error);
    }
  }

  private generateEmailHTML(alertData: AlertData): string {
    const severityColors = {
      low: '#3B82F6',
      medium: '#F59E0B', 
      high: '#EF4444',
      critical: '#DC2626'
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${severityColors[alertData.severity]}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">${alertData.title}</h1>
          <p style="margin: 10px 0 0 0;">Severity: ${alertData.severity.toUpperCase()}</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p style="font-size: 16px; line-height: 1.5;">${alertData.message}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3;">
            <p style="margin: 0; font-size: 14px;">Stay safe and follow local emergency guidelines.</p>
          </div>
        </div>
      </div>
    `;
  }

  private generateEmailText(alertData: AlertData): string {
    return `🚨 ${alertData.severity.toUpperCase()} ALERT: ${alertData.title}\n\n${alertData.message}\n\nStay safe and follow local emergency guidelines.`;
  }

  private async logDeliveryStatus(alertId: string, recipientCount: number): Promise<void> {
    try {
      await supabase
        .from('alerts')
        .update({
          recipients_count: recipientCount,
          sent_at: new Date().toISOString()
        })
        .eq('id', alertId);
        
      console.log(`📝 Alert delivery logged: ${recipientCount} recipients notified`);
    } catch (error) {
      console.error('Error logging delivery status:', error);
    }
  }

  private async updateSenderProgress(senderId: string): Promise<void> {
    try {
      await supabase
        .from('progress_tracking')
        .upsert({
          user_id: senderId,
          progress_type: 'community_leader',
          alerts_sent: supabase.rpc('increment', { x: 1 }),
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error updating sender progress:', error);
    }
  }

  async getAlertHistory(userId: string): Promise<any[]> {
    try {
      const { data: alerts } = await supabase
        .from('alerts')
        .select('*')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });

      return alerts || [];
    } catch (error) {
      console.error('Error getting alert history:', error);
      return [];
    }
  }

  async getActiveAlerts(communityId?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('alerts')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (communityId) {
        query = query.or(`target_community_id.eq.${communityId},target_audience.eq.all`);
      }

      const { data: alerts } = await query;
      return alerts || [];
    } catch (error) {
      console.error('Error getting active alerts:', error);
      return [];
    }
  }
}

export const alertService = new AlertService();