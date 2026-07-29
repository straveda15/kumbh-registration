import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const MultiSelectDropdown = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedList = Array.isArray(value) ? value : [];

  const handleToggleOption = (option) => {
    let nextList = [...selectedList];

    if (option === 'None') {
      // Selecting 'None' clears all other choices
      nextList = ['None'];
    } else {
      // Remove 'None' if any other option is picked
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
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="glass-card flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm shadow-xs transition-colors hover:border-primary/50"
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

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in-80 zoom-in-95">
          <div className="relative mb-2 flex items-center border-b border-border/50 pb-2 px-1">
            <Search className="size-4 shrink-0 text-muted-foreground opacity-60 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-44 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-center text-xs text-muted-foreground">No options found.</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedList.includes(option);
                return (
                  <div
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleOption(option);
                    }}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
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
      )}
    </div>
  );
};

export default MultiSelectDropdown;
