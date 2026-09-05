import { SystemSettings, SMSAlertMessage } from '../types';

/**
 * Arkesel SMS API Service
 * Handles dispatching SMS alerts to client mobile phones.
 */
export async function sendArkeselSMS(
  recipientPhone: string,
  recipientName: string,
  message: string,
  settings: SystemSettings
): Promise<SMSAlertMessage> {
  const sanitizedPhone = recipientPhone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  const timestamp = new Date().toISOString();
  const alertId = 'sms_' + Math.random().toString(36).substr(2, 9);

  // If valid API key is present, attempt live HTTP dispatch to Arkesel V2 API
  if (
    settings.arkeselApiKey &&
    settings.arkeselApiKey !== 'sample_arkesel_api_key_creativekg' &&
    settings.arkeselApiKey.length > 8
  ) {
    try {
      const response = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
        method: 'POST',
        headers: {
          'api-key': settings.arkeselApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: settings.arkeselSenderId || 'CREATIVE-KG',
          recipients: [sanitizedPhone],
          message: message,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        return {
          id: alertId,
          recipientPhone: sanitizedPhone,
          recipientName,
          message,
          senderId: settings.arkeselSenderId || 'CREATIVE-KG',
          timestamp,
          status: 'sent',
        };
      }
    } catch (e) {
      console.warn('Arkesel API request fallback to simulated mode:', e);
    }
  }

  // Fallback to simulated delivery (guarantees seamless UX in development & demo mode)
  return {
    id: alertId,
    recipientPhone: sanitizedPhone,
    recipientName,
    message,
    senderId: settings.arkeselSenderId || 'CREATIVE-KG',
    timestamp,
    status: 'simulated',
  };
}

/**
 * Formats SMS templates by replacing placeholders
 */
export function formatSMSTemplate(
  template: string,
  variables: {
    clientName?: string;
    amount?: number | string;
    currency?: string;
    invoiceNumber?: string;
    shootTitle?: string;
    studioName?: string;
    passcode?: string;
  }
): string {
  let result = template;
  if (variables.clientName) result = result.replace(/{clientName}/g, variables.clientName);
  if (variables.amount !== undefined) result = result.replace(/{amount}/g, String(variables.amount));
  if (variables.currency) result = result.replace(/{currency}/g, variables.currency);
  if (variables.invoiceNumber) result = result.replace(/{invoiceNumber}/g, variables.invoiceNumber);
  if (variables.shootTitle) result = result.replace(/{shootTitle}/g, variables.shootTitle);
  if (variables.studioName) result = result.replace(/{studioName}/g, variables.studioName);
  if (variables.passcode) result = result.replace(/{passcode}/g, variables.passcode);
  return result;
}
