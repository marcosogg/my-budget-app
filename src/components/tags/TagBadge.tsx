import { Tag } from '@/types/tags';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: Tag;
  onDelete?: (tagId: string) => void;
  className?: string;
}

export const TagBadge = ({ tag, onDelete, className }: TagBadgeProps) => {
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "gap-1 px-2 py-1 hover:bg-secondary/80 transition-colors", 
        className
      )}
    >
      {tag.name}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(tag.id);
          }}
          className="ml-1 hover:text-destructive focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};