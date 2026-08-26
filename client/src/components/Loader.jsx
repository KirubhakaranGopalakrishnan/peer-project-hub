export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
