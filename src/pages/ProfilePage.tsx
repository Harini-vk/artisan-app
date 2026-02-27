import { useState, useEffect } from "react";
import { User, Briefcase, Tag, Save, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, completeOnboarding } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    experience: "",
    interests: [] as string[],
    categories: [] as string[],
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        businessType: user.profile?.businessType || "",
        experience: user.profile?.experience || "",
        interests: user.profile?.interests || [],
        categories: user.profile?.categories || [],
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Save profile data to Supabase (using completeOnboarding since it updates the profiles table)
    const res = await completeOnboarding({
      ...user.profile,
      phone: profile.phone,
      businessType: profile.businessType,
      experience: profile.experience,
      interests: profile.interests,
      categories: profile.categories
    });

    if (res.success) {
      setEditing(false);
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
    } else {
      toast({ title: "Error", description: res.error || "Failed to update profile", variant: "destructive" });
    }
  };

  if (!user) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.businessType || "No business type set"}</p>
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

      {/* Business Info */}
      <div className="bg-card rounded-xl p-4 shadow-card space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" /> Business Profile
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Business Type</label>
            {editing ? (
              <input
                value={profile.businessType}
                onChange={(e) => setProfile((p) => ({ ...p, businessType: e.target.value }))}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <p className="text-sm text-foreground mt-0.5">{profile.businessType || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Experience</label>
            {editing ? (
              <select
                value={profile.experience}
                onChange={(e) => setProfile((p) => ({ ...p, experience: e.target.value }))}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select experience</option>
                <option value="< 1 year">Less than 1 year</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            ) : (
              <p className="text-sm text-foreground mt-0.5">{profile.experience || "-"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Interests & Categories */}
      <div className="bg-card rounded-xl p-4 shadow-card space-y-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" /> Interests & Categories
        </h3>
        <div>
          <label className="text-xs text-muted-foreground font-medium">Product Interests</label>
          {editing ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {["Pottery", "Ceramics", "Textiles", "Jewelry", "Food Products", "Beauty & Wellness", "Art & Decor", "Woodcraft", "Leather", "Natural Dyes"].map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => {
                    setProfile((p) => ({
                      ...p,
                      interests: p.interests.includes(interest)
                        ? p.interests.filter((i) => i !== interest)
                        : [...p.interests, interest],
                    }));
                  }}
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
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.interests.length > 0 ? profile.interests.map((i) => (
                <span key={i} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  {i}
                </span>
              )) : (
                <p className="text-sm text-muted-foreground">No interests selected</p>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium">Product Categories</label>
          {editing ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {["Pottery", "Textiles", "Jewelry", "Food Products", "Beauty & Wellness", "Art & Decor", "Woodcraft", "Leather", "Baskets", "Macrame", "Other"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setProfile((p) => ({
                      ...p,
                      categories: p.categories.includes(cat)
                        ? p.categories.filter((c) => c !== cat)
                        : [...p.categories, cat],
                    }));
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${profile.categories.includes(cat)
                      ? "bg-accent text-accent-foreground ring-1 ring-primary"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.categories.length > 0 ? profile.categories.map((c) => (
                <span key={c} className="text-xs font-medium bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
                  {c}
                </span>
              )) : (
                <p className="text-sm text-muted-foreground">No categories selected</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
