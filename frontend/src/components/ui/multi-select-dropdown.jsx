import { useState } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export const MultiSelectDropdown = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedList = Array.isArray(value) ? value : [];

  const handleToggleOption = (option) => {
    let nextList = [...selectedList];

    if (option === 'None') {
      nextList = ['None'];
    } else {
      nextList = nextList.filter((item) => item !== 'None');

      if (nextList.includes(option)) {
        nextList = nextList.filter((item) => item !== option);
      } else {
        nextList.push(option);
      }
    }

    onChange(nextList);
  };

  const handleRemoveBadge = (e, option) => {
    e.stopPropagation();
    const nextList = selectedList.filter((item) => item !== option);
    onChange(nextList);
  };

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "glass-card flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm shadow-xs transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
            {selectedList.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedList.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
                >
                  {item}
                  <X
                    className="size-3 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={(e) => handleRemoveBadge(e, item)}
                  />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground opacity-60" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-[280px] p-2 shadow-xl border border-border bg-popover rounded-xl"
        align="start"
      >
        <div className="flex flex-col max-h-64">
          <div className="sticky top-0 z-10 flex shrink-0 items-center border-b border-border/50 bg-popover pb-2 px-1">
            <Search className="size-4 shrink-0 text-muted-foreground opacity-60 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-muted-foreground hover:text-foreground text-xs px-1"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pt-1 space-y-0.5 max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">No options found.</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedList.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => handleToggleOption(option)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground select-none',
                      isSelected && 'bg-primary/15 font-semibold text-primary'
                    )}
                  >
                    <span>{option}</span>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectDropdown;
