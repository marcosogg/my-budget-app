export type Notification = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  read_at: string | null;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'sent' | 'failed' | 'read';
};