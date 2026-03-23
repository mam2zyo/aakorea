const statusClassMap = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  SUSPENDED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export default function StatusBadge({ children, status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        statusClassMap[status] ||
        "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
      }`}
    >
      {children}
    </span>
  );
}
