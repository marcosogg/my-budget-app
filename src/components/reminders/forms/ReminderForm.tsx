import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DueDayInput } from "./DueDayInput";
import { NotificationOptions } from "./NotificationOptions";

interface ReminderFormData {
  name: string;
  amount: number;
  due_day: number;
  reminder_days_before: number[];
  notification_types: string[];
  recurrence_frequency: 'none' | 'monthly' | 'yearly';
}

interface ReminderFormProps {
  defaultValues: Partial<ReminderFormData>;
  isSubmitting: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ReminderForm({ 
  defaultValues, 
  isSubmitting, 
  onSubmit, 
  onCancel 
}: ReminderFormProps) {
  const form = useForm<ReminderFormData>({
    defaultValues: {
      name: '',
      amount: 0,
      due_day: 1,
      reminder_days_before: [7],
      notification_types: ['email'],
      recurrence_frequency: 'none',
      ...defaultValues,
    },
  });

  const handleSubmit = (data: ReminderFormData) => {
    // Convert the due_day to a full date for the API
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), data.due_day);
    
    // If the day has already passed this month, set it to next month
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    onSubmit({
      ...data,
      due_date: dueDate,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Rent" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                  placeholder="0.00" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DueDayInput form={form} />
        <NotificationOptions form={form} />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}