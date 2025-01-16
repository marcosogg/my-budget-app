import { useState } from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tag } from '@/types/tags';
import { TagBadge } from './TagBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface TagSelectProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagDeselect: (tagId: string) => void;
  onCreateClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const TagSelect = ({
  tags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onCreateClick,
  className,
  isLoading = false,
}: TagSelectProps) => {
  const [open, setOpen] = useState(false);

  // Ensure we have valid arrays even during loading
  const safeTags = Array.isArray(tags) ? tags : [];
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];

  const renderCommandContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      );
    }

    return (
      <Command>
        <CommandInput placeholder="Search tags..." />
        <CommandEmpty className="p-4">
          {safeTags.length === 0 ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">No tags exist yet.</p>
              {onCreateClick && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    onCreateClick();
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create your first tag
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">No tags found.</p>
              {onCreateClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    onCreateClick();
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create new tag
                </Button>
              )}
            </div>
          )}
        </CommandEmpty>
        <ScrollArea className="h-[200px]">
          <CommandGroup>
            {safeTags.map((tag) => {
              const isSelected = safeSelectedTags.some((t) => t.id === tag.id);
              return (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    if (isSelected) {
                      onTagDeselect(tag.id);
                    } else {
                      onTagSelect(tag);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {tag.name}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </ScrollArea>
      </Command>
    );
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            disabled={isLoading}
          >
            {isLoading ? (
              <Skeleton className="h-4 w-[100px]" />
            ) : (
              <>
                Select tags...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          {renderCommandContent()}
        </PopoverContent>
      </Popover>

      {safeSelectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {safeSelectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onDelete={() => onTagDeselect(tag.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};