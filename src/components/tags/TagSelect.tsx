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

interface TagSelectProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagDeselect: (tagId: string) => void;
  onCreateClick?: () => void;
  className?: string;
}

export const TagSelect = ({
  tags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onCreateClick,
  className,
}: TagSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            Select tags...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>
              No tags found.
              {onCreateClick && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full justify-start"
                  onClick={() => {
                    setOpen(false);
                    onCreateClick();
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create new tag
                </Button>
              )}
            </CommandEmpty>
            <ScrollArea className="h-[200px]">
              <CommandGroup>
                {tags.map((tag) => {
                  const isSelected = selectedTags.some((t) => t.id === tag.id);
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
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
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