import { Link } from "react-router-dom";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            AA Korea
          </Link>
          <div className="text-sm text-slate-500">모임 조회</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
