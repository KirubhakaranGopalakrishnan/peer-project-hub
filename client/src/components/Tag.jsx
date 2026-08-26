export default function Tag({ label, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick ? () => onClick(label) : undefined}
      className={
        'rounded-full border px-2.5 py-1 text-xs font-medium transition ' +
        (active
          ? 'border-accent bg-accent/15 text-accent'
          : 'border-border bg-surface2 text-muted hover:border-accent/50 hover:text-fg') +
        (onClick ? ' cursor-pointer' : ' cursor-default')
      }
    >
      {label}
    </button>
  );
}
