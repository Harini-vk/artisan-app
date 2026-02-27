import { useState, useEffect } from "react";
import { User, Building2, Tag, Edit2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const allInterests = ["Handmade Crafts", "Textile Products", "Food Products", "Beauty and Wellness", "Art and Decor", "Pottery", "Jewelry", "Woodcraft", "Leather", "Technology"];

export default function InvestorProfilePage() {
  const { user, completeOnboarding } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    interests: [] as string[],
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        organization: user.profile?.organization || "",
        interests: user.profile?.interests || [],
      });
    }
  }, [user]);

  const toggleInterest = (interest: string) => {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    const res = await completeOnboarding({
      ...user.profile,
      phone: profile.phone,
      organization: profile.organization,
      interests: profile.interests,
    });

    if (res.success) {
      setEditing(false);
      toast({ title: "Profile Updated", description: "Your investor profile has been saved successfully." });
    } else {
      toast({ title: "Error", description: res.error || "Failed to update profile", variant: "destructive" });
    }
  };

  if (!user) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.organization || "Investor"}</p>
        </div>
        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className="flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          {editing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          {editing ? "Save Profile" : "Edit Profile"}
        </button>
      </div>

      {/* Personal Details */}
      <div className="bg-card rounded-xl p-4 shadow-card space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-primary" /> Personal Details
        </h3>
        <div className="space-y-3">
          {[
            { label: "Full Name", value: profile.name, key: "name", editable: false },
            { label: "Email", value: profile.email, key: "email", editable: false },
            { label: "Phone", value: profile.phone, key: "phone", editable: true },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs text-muted-foreground font-medium">{field.label}</label>
              {editing && field.editable ? (
                <input
                  value={field.value}
                  onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <p className="text-sm text-foreground mt-0.5">{field.value || "-"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Organization */}
      <div className="bg-card rounded-xl p-4 shadow-card space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> Organization
        </h3>
        <div>
          <label className="text-xs text-muted-foreground font-medium">Organization Name</label>
          {editing ? (
            <input
              value={profile.organization}
              onChange={(e) => setProfile((p) => ({ ...p, organization: e.target.value }))}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <p className="text-sm text-foreground mt-0.5">{profile.organization || "-"}</p>
          )}
        </div>
      </div>

      {/* Investment Interests */}
      <div className="bg-card rounded-xl p-4 shadow-card space-y-3">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" /> Investment Interests
        </h3>
        {editing ? (
          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${profile.interests.includes(interest)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
              >
                {interest}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <span key={interest} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No interests selected yet. Edit your profile to add interests.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
