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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReminderFormData {
  name: string;
  amount: number;
  due_day: number;
  reminder_days_before: number[];
  notification_types: string[];
  recurrence_frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface ReminderFormProps {
  defaultValues: Partial<ReminderFormData>;
  isSubmitting: boolean;
  onSubmit: (data: ReminderFormData) => void;
  onCancel: () => void;
}

const recurrenceOptions = [
  { value: 'none', label: 'No recurrence' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

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

        <FormField
          control={form.control}
          name="due_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Day of Month</FormLabel>
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
                  placeholder="Day of month (1-31)" 
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
            <FormItem>
              <FormLabel>Recurrence</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {recurrenceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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