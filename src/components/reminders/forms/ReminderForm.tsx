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
import { Switch } from "@/components/ui/switch";

interface ReminderFormData {
  name: string;
  amount: number;
  due_day: number;
  reminder_days_before: number[];
  notification_types: ("whatsapp" | "email" | "in_app")[];
  recurrence_frequency: 'none' | 'monthly';
}

interface ReminderFormProps {
  defaultValues: ReminderFormData;
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
    defaultValues,
  });

  const handleSubmit = (data: ReminderFormData) => {
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

        <FormField
          control={form.control}
          name="due_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Day of Month (1-31)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1}
                  max={31}
                  {...field}
                  onChange={e => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 31) {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recurrence_frequency"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Monthly Recurring</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Automatically create this reminder every month
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === 'monthly'}
                  onCheckedChange={(checked) => 
                    field.onChange(checked ? 'monthly' : 'none')
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

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