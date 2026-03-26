export default function ServiceAdminPage({ title, description, children }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Service 운영
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
