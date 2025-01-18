export type Notification = {
  id: string;
  notification_title: string | null;
  notification_content: string | null;
  created_at: string;
  read_at: string | null;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'sent' | 'failed' | 'read';
  notification_type: 'whatsapp' | 'email' | 'in_app';
  error_message?: string;
  user_id: string;
};