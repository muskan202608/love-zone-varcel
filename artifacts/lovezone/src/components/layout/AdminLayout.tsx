import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, MapPin, Map, Settings, Search, LogOut } from "lucide-react";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, isError } = useGetAdminMe();
  const logout = useAdminLogout();

  useEffect(() => {
    if (isError) {
      setLocation("/admin/login");
    }
  }, [isError, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout.mutateAsync();
    localStorage.removeItem("lovezone_admin");
    setLocation("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/listings", label: "Listings", icon: Users },
    { href: "/admin/states", label: "States", icon: Map },
    { href: "/admin/cities", label: "Cities", icon: MapPin },
    { href: "/admin/seo", label: "SEO Pages", icon: Search },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">LoveZone Admin</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome, {user.username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}