export default function InfoRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="text-sm text-slate-900">{value || "-"}</div>
    </div>
  );
}
