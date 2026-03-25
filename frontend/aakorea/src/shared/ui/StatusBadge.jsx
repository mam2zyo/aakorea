const statusClassMap = {
  ACTIVE:
    "bg-[rgba(36,81,106,0.12)] text-[color:var(--aa-primary)] ring-1 ring-[rgba(36,81,106,0.18)]",
  SUSPENDED:
    "bg-[rgba(169,109,62,0.14)] text-[color:var(--aa-accent)] ring-1 ring-[rgba(169,109,62,0.24)]",
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
