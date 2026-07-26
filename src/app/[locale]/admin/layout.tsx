"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { LayoutDashboard, CalendarDays, Users, FileText, LogOut, Newspaper, Menu, Database, Briefcase, Mail } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { getAuthInstance } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leadership CMS", href: "/admin/leadership", icon: Users },
  { name: "Articles CMS", href: "/admin/articles", icon: Newspaper },
  { name: "Events CMS", href: "/admin/events", icon: CalendarDays },
  { name: "Career CMS", href: "/admin/career", icon: Briefcase },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Resource Library", href: "/admin/resources", icon: FileText },
  { name: "Email Members", href: "/admin/email", icon: Mail },
  { name: "Publications", href: "/admin/research", icon: FileText },
  { name: "Projects", href: "/admin/projects", icon: FileText },
  { name: "Seed Data", href: "/admin/seed", icon: Database },
];

const SidebarContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleSignOut = async () => {
    await signOut(getAuthInstance());
    document.cookie = `userRole=; path=/; max-age=0; SameSite=Strict`;
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="font-serif font-bold text-2xl tracking-tighter text-white">
          AABP Admin
        </Link>
        <p className="text-white/50 text-xs mt-1 uppercase tracking-widest">Management Portal</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-8">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors ${isActive ? "bg-white/20 text-white" : ""}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button onClick={handleSignOut} className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-secondary/30 flex-col md:flex-row">
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden flex items-center justify-between bg-primary text-white p-4 shrink-0">
        <Link href="/" className="font-serif font-bold text-xl tracking-tighter">
          AABP Admin
        </Link>
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="text-white hover:bg-white/10" />}>
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-primary border-none w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-primary text-white flex-col h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
