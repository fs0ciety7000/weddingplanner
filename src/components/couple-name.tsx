/**
 * Renders a wedding name with its "&" set in italic gold, per the brand
 * book ("the couple's names, once per screen; ampersand in italic gold").
 * Falls back to plain text if there's no ampersand to highlight.
 */
export function CoupleName({ name, className }: { name: string; className?: string }) {
  const parts = name.split("&");
  if (parts.length !== 2) {
    return <span className={className}>{name}</span>;
  }
  return (
    <span className={className}>
      {parts[0]}
      <span className="text-gold-ink italic">&amp;</span>
      {parts[1]}
    </span>
  );
}
