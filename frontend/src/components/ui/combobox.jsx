"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

// Searchable single-select — same visual language as <SelectTrigger/> (same
// border/bg/focus/aria-invalid classes) so it's a drop-in replacement
// wherever a plain <Select> doesn't scale to a long, searchable option list.
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  // When true, typing a value with no matching option offers a "Use ⟨query⟩"
  // item that commits the typed text directly — for fields backed by a
  // seed list that can't be exhaustive (e.g. city/town), rather than a
  // truly closed set (e.g. state).
  allowCustomValue = false,
  disabled,
  className,
  id,
  ...props
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const selectedOption = options.find((option) => option.value === value)
  const displayLabel = selectedOption
    ? selectedOption.label
    : allowCustomValue && value
      ? value
      : null

  const trimmedQuery = query.trim()
  const hasExactMatch = options.some(
    (option) => option.label.toLowerCase() === trimmedQuery.toLowerCase()
  )
  const showCustomValueOption = allowCustomValue && trimmedQuery && !hasExactMatch

  const commit = (nextValue) => {
    onValueChange(nextValue)
    setOpen(false)
    setQuery("")
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          data-placeholder={!displayLabel ? "" : undefined}
          className={cn(
            "flex h-8 w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground md:text-sm dark:bg-input/30 dark:hover:bg-input/50 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            className
          )}
          {...props}
        >
          <span className="truncate">{displayLabel || placeholder}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={!allowCustomValue}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {!showCustomValueOption && <CommandEmpty>{emptyText}</CommandEmpty>}
            <CommandGroup>
              {(allowCustomValue && trimmedQuery
                ? options.filter((option) =>
                    option.label.toLowerCase().includes(trimmedQuery.toLowerCase())
                  )
                : options
              ).map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  data-checked={option.value === value}
                  onSelect={() => commit(option.value)}
                >
                  {option.label}
                </CommandItem>
              ))}
              {showCustomValueOption && (
                <CommandItem value={`__custom__${trimmedQuery}`} onSelect={() => commit(trimmedQuery)}>
                  Use &ldquo;{trimmedQuery}&rdquo;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
export default Combobox
