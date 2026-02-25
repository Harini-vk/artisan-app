import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, Grid3X3, User, Menu, Bell, Landmark, BookOpen, Search, LogOut, Calendar, Send, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const entrepreneurBottomTabs = [
  { label: "Home", icon: Home, path: "/" },
  { label: "History", icon: Clock, path: "/history" },
  { label: "Products", icon: Grid3X3, path: "/products" },
  { label: "Profile", icon: User, path: "/profile" },
];

const investorBottomTabs = [
  { label: "Discover", icon: Search, path: "/investor/discover" },
  { label: "Profile", icon: User, path: "/investor/profile" },
];

const organizerBottomTabs = [
  { label: "Events", icon: Calendar, path: "/organizer/events" },
  { label: "Invites", icon: Send, path: "/organizer/invitations" },
  { label: "Apps", icon: FileText, path: "/organizer/applications" },
  { label: "Profile", icon: User, path: "/organizer/profile" },
];

const entrepreneurDrawerLinks = [
  { label: "Government Schemes", icon: Landmark, path: "/schemes" },
  { label: "Business Guidance", icon: BookOpen, path: "/guidance" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
];

const investorDrawerLinks = [
  { label: "Notifications", icon: Bell, path: "/investor/notifications" },
];

const organizerDrawerLinks = [
  { label: "Notifications", icon: Bell, path: "/organizer/notifications" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  const role = user?.role;
  const bottomTabs = role === "organizer" ? organizerBottomTabs : role === "investor" ? investorBottomTabs : entrepreneurBottomTabs;
  const drawerLinks = role === "organizer" ? organizerDrawerLinks : role === "investor" ? investorDrawerLinks : entrepreneurDrawerLinks;
  const notifPath = role === "organizer" ? "/organizer/notifications" : role === "investor" ? "/investor/notifications" : "/notifications";
  const portalLabel = role === "organizer" ? "Organizer Portal" : role === "investor" ? "Investor Portal" : "Empowering Women Creators";

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-sm border-b">
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card p-0">
            <div className="p-6 border-b">
              <h2 className="font-heading text-xl font-semibold text-foreground">ArtisanHub</h2>
              <p className="text-sm text-muted-foreground mt-1">{portalLabel}</p>
            </div>
            <nav className="p-4 space-y-1">
              {drawerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <button
                onClick={() => { setDrawerOpen(false); logout(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-destructive hover:bg-destructive/10 w-full"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className="font-heading text-lg font-semibold text-foreground">ArtisanHub</h1>

        <Link
          to={notifPath}
          className="p-2 rounded-lg hover:bg-accent transition-colors relative"
        >
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Tabs */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-sm border-t z-40">
        <div className="flex items-center justify-around py-2">
          {bottomTabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
