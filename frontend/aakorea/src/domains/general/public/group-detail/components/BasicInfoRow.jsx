export default function BasicInfoRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-[color:var(--aa-line)] py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
      <div className="text-sm font-medium aa-copy">{label}</div>
      <div className="text-sm aa-heading">{value || "-"}</div>
    </div>
  );
}
