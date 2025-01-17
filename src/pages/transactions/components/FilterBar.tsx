import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onSortChange: (value: string) => void;
}

export const FilterBar = ({
  description,
  onDescriptionChange,
  date,
  onDateChange,
  onSortChange,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-asc">Date (Ascending)</SelectItem>
          <SelectItem value="date-desc">Date (Descending)</SelectItem>
          <SelectItem value="amount-asc">Amount (Ascending)</SelectItem>
          <SelectItem value="amount-desc">Amount (Descending)</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Filter by Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-[200px]"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "dd/MM/yyyy") : "Filter by Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            className="border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};