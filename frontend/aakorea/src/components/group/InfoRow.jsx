export default function InfoRow({ label, value }) {
  return (
    <div className="aa-divider grid gap-1 border-b py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
      <div className="text-sm font-medium aa-copy">{label}</div>
      <div className="text-sm aa-heading">{value || "-"}</div>
    </div>
  );
}
