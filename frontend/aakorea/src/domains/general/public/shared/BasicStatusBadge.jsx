const statusClassMap = {
  ACTIVE:
    "bg-[rgba(57,119,195,0.12)] text-[color:var(--aa-primary-strong)] ring-1 ring-[rgba(57,119,195,0.16)]",
  SUSPENDED:
    "bg-[rgba(233,161,81,0.16)] text-[#8a5618] ring-1 ring-[rgba(233,161,81,0.22)]",
};

export default function BasicStatusBadge({ children, status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusClassMap[status] ||
        "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
      }`}
    >
      {children}
    </span>
  );
}
