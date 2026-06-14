import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-56 bg-dark-card border-r border-dark-border flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-dark-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚙️</span>
            <span className="text-slate-900 font-black">Beheer</span>
          </div>
          <span className="text-slate-400 text-xs">CityKist Verhuur</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-party hover:bg-slate-100 text-sm transition-colors">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link href="/admin/producten" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-party hover:bg-slate-100 text-sm transition-colors">
            <Package size={16} />
            Producten
          </Link>
          <Link href="/admin/bestellingen" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-party hover:bg-slate-100 text-sm transition-colors">
            <ShoppingBag size={16} />
            Bestellingen
          </Link>
        </nav>

        <div className="p-3 border-t border-dark-border">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-party text-xs px-3 py-2 transition-colors">
            <ArrowLeft size={14} />
            Naar website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
