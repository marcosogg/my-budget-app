import { Input } from '@/components/ui/input';

interface DescriptionInputProps {
  value: string;
  onFilterChange: (type: string, value: string) => void;
}

export const DescriptionInput = ({ value, onFilterChange }: DescriptionInputProps) => {
  return (
    <Input
      type="text"
      placeholder="Filter by Description"
      value={value}
      onChange={(e) => onFilterChange('description', e.target.value)}
      className="w-[200px]"
    />
  );
};