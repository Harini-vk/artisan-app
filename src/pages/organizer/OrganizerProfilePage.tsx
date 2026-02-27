import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Building2, Edit2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OrganizerProfilePage() {
  const { user, completeOnboarding } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setOrg(user.profile?.organization || "");
      setPhone(user.profile?.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const res = await completeOnboarding({
      ...user.profile,
      organization: org,
      phone: phone
    });

    if (res.success) {
      setEditing(false);
      toast({ title: "Profile Updated", description: "Your profile has been saved." });
    } else {
      toast({ title: "Error", description: res.error || "Failed to update profile", variant: "destructive" });
    }
  };

  if (!user) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground">Event Organizer</p>
        </div>
        <button onClick={() => (editing ? handleSave() : setEditing(true))}
          className="flex items-center gap-1.5 text-sm font-medium text-primary">
          {editing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          {editing ? "Save Profile" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-card space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-primary" /> Personal Details
        </h3>
        <div className="space-y-3">
          {[
            { label: "Full Name", value: name, setter: setName },
            { label: "Email", value: email, setter: undefined },
            { label: "Phone", value: phone, setter: setPhone },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs text-muted-foreground font-medium">{field.label}</label>
              {editing && field.setter ? (
                <input value={field.value} onChange={(e) => field.setter(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              ) : (
                <p className="text-sm text-foreground mt-0.5">{field.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-card space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> Organization
        </h3>
        <div>
          <label className="text-xs text-muted-foreground font-medium">Organization Name</label>
          {editing ? (
            <input value={org} onChange={(e) => setOrg(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          ) : (
            <p className="text-sm text-foreground mt-0.5">{org}</p>
          )}
        </div>
      </div>
    </div>
  );
}
