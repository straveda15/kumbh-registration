import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

// Two-way segmented control — next-themes persists the choice to
// localStorage itself (see main.jsx's ThemeProvider), so there's nothing
// extra to wire up here. Reused as-is in both the nav drawer (quick access)
// and the Profile page.
export const ThemeSwitcher = ({ className }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn('flex items-center gap-1 rounded-xl bg-muted p-1', className)}>
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors',
            theme === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="size-3.5" /> {label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
