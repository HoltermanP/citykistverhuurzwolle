import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft, FileText, CalendarDays, Percent } from "lucide-react";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/producten", label: "Producten", icon: Package },
  { href: "/admin/bestellingen", label: "Bestellingen", icon: ShoppingBag },
  { href: "/admin/verhuringen", label: "Verhuuragenda", icon: CalendarDays },
  { href: "/admin/service", label: "Service", icon: FileText },
  { href: "/admin/kortingscodes", label: "Kortingscodes", icon: Percent },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row">
      {/* Sidebar (mobiel: bovenbalk met horizontaal scrollende nav) */}
      <aside className="w-full md:w-56 bg-dark-card border-b md:border-b-0 md:border-r border-dark-border flex flex-col flex-shrink-0 md:min-h-screen">
        <div className="p-4 md:p-5 md:border-b border-dark-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xl">⚙️</span>
              <span className="text-slate-900 font-black">Beheer</span>
            </div>
            <span className="text-slate-400 text-xs">CityKist Verhuur</span>
          </div>
          {/* Acties rechtsboven op mobiel */}
          <div className="flex items-center gap-1 md:hidden">
            <Link href="/" className="text-slate-500 hover:text-party p-2" title="Naar website">
              <ArrowLeft size={18} />
            </Link>
            <LogoutButton />
          </div>
        </div>

        <nav className="flex md:flex-col gap-1 p-2 md:p-3 overflow-x-auto md:flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-party hover:bg-slate-100 text-sm transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Onderaan op desktop */}
        <div className="hidden md:block p-3 border-t border-dark-border space-y-1">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-party text-xs px-3 py-2 transition-colors">
            <ArrowLeft size={14} />
            Naar website
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
