import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Search } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

export const AdminSearchCommand = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const go = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search registrations, jump to a page…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go('/admin')}>
            <LayoutDashboard className="size-4" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go('/admin/registrations')}>
            <Users className="size-4" /> Registrations
          </CommandItem>
        </CommandGroup>
        {query.trim() && (
          <CommandGroup heading="Search">
            <CommandItem
              onSelect={() => go(`/admin/registrations?search=${encodeURIComponent(query.trim())}`)}
            >
              <Search className="size-4" /> Search registrations for &ldquo;{query.trim()}&rdquo;
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default AdminSearchCommand;
