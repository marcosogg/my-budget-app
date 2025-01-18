import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

interface ReminderNotification {
  id: string;
  reminder_id: string;
  notification_type: "email" | "whatsapp" | "in_app";
  user_id: string;
  scheduled_for: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get pending notifications that are due
    const { data: notifications, error: fetchError } = await supabase
      .from("reminder_notifications")
      .select(`
        *,
        bill_reminders (
          name,
          amount,
          due_date
        )
      `)
      .eq("status", "pending")
      .eq("notification_type", "email")
      .lte("scheduled_for", new Date().toISOString());

    if (fetchError) throw fetchError;

    console.log(`Processing ${notifications?.length || 0} email notifications`);

    if (!notifications?.length) {
      return new Response(
        JSON.stringify({ message: "No notifications to process" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get user emails
    const userIds = [...new Set(notifications.map(n => n.user_id))];
    const { data: users, error: usersError } = await supabase.auth.admin
      .listUsers();

    if (usersError) throw usersError;

    const userEmails = new Map(
      users.users.map(user => [user.id, user.email])
    );

    // Process each notification
    for (const notification of notifications) {
      const reminder = notification.bill_reminders;
      const userEmail = userEmails.get(notification.user_id);

      if (!userEmail || !reminder) {
        console.error(`Missing email or reminder data for notification ${notification.id}`);
        continue;
      }

      const dueDate = new Date(reminder.due_date).toLocaleDateString();
      const amount = new Intl.NumberFormat('de-DE', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(reminder.amount);

      // Send email via Resend
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Bill Reminders <marcosgomes@gmail.com>",
          to: [userEmail],
          subject: `Reminder: ${reminder.name} payment due soon`,
          html: `
            <h2>Payment Reminder</h2>
            <p>This is a reminder that your payment for <strong>${reminder.name}</strong> is due on ${dueDate}.</p>
            <p>Amount due: ${amount}</p>
            <p>Please ensure to make the payment before the due date to avoid any late fees.</p>
          `,
        }),
      });

      if (emailResponse.ok) {
        // Update notification status
        await supabase
          .from("reminder_notifications")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", notification.id);
      } else {
        const error = await emailResponse.text();
        console.error(`Failed to send email for notification ${notification.id}:`, error);
        
        await supabase
          .from("reminder_notifications")
          .update({
            status: "failed",
            error_message: error,
          })
          .eq("id", notification.id);
      }
    }

    return new Response(
      JSON.stringify({ message: "Notifications processed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);