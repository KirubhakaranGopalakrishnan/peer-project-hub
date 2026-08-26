import { useTheme } from '../context/ThemeContext';

const OPTIONS = [
  { mode: 'light', label: 'Light', icon: '☀' },
  { mode: 'dark', label: 'Dark', icon: '☾' },
  { mode: 'system', label: 'System', icon: '⚙' },
];

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface2 p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.mode}
          type="button"
          onClick={() => setMode(opt.mode)}
          title={opt.label}
          aria-label={opt.label}
          className={
            'flex h-7 w-7 items-center justify-center rounded-md text-xs transition ' +
            (mode === opt.mode
              ? 'bg-accent text-white'
              : 'text-muted hover:text-fg')
          }
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
