import { useState } from "react";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Briefcase, TrendingUp, Calendar } from "lucide-react";

const roles: { value: UserRole; label: string; desc: string; icon: typeof Briefcase }[] = [
  { value: "entrepreneur", label: "Entrepreneur", desc: "Showcase products & discover events", icon: Briefcase },
  { value: "investor", label: "Investor", desc: "Discover products & connect with entrepreneurs", icon: TrendingUp },
  { value: "organizer", label: "Organizer", desc: "Create & manage events for artisans", icon: Calendar },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields and select a role");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    signup(name, email, password, role);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Join ArtisanHub</h1>
        <p className="text-muted-foreground mt-2 text-sm">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Select Your Role</label>
          <div className="space-y-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  role === r.value
                    ? "border-primary bg-primary/10 ring-2 ring-ring"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  role === r.value ? "bg-primary/20" : "bg-muted"
                }`}>
                  <r.icon className={`h-5 w-5 ${role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm text-foreground">{r.label}</h3>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
