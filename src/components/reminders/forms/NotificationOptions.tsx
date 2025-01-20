import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface NotificationOptionsProps {
  form: UseFormReturn<any>;
}

const recurrenceOptions = [
  { value: 'none', label: 'No recurrence' },
  { value: 'monthly', label: 'Monthly' },
];

export function NotificationOptions({ form }: NotificationOptionsProps) {
  return (
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
  );
}