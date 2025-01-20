import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DueDayInputProps {
  form: UseFormReturn<any>;
}

export function DueDayInput({ form }: DueDayInputProps) {
  return (
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
  );
}