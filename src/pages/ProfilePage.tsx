import { useState } from "react";
import { User, Briefcase, Tag, Star, ChevronRight, Edit2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const initialProfile = {
  name: "Priya Sharma",
  email: "priya@artisan.com",
  phone: "+91 98765 43210",
  businessType: "Handmade Pottery & Ceramics",
  experience: "3-5 years",
  interests: ["Pottery", "Ceramics", "Natural Dyes"],
  categories: ["Home Decor", "Kitchenware", "Art"],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
  };

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.businessType}</p>
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
            { label: "Full Name", value: profile.name, key: "name" },
            { label: "Email", value: profile.email, key: "email" },
            { label: "Phone", value: profile.phone, key: "phone" },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs text-muted-foreground font-medium">{field.label}</label>
              {editing ? (
                <input
                  value={field.value}
                  onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <p className="text-sm text-foreground mt-0.5">{field.value}</p>
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
              <p className="text-sm text-foreground mt-0.5">{profile.businessType}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Experience</label>
            <p className="text-sm text-foreground mt-0.5">{profile.experience}</p>
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
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.interests.map((i) => (
              <span key={i} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                {i}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium">Product Categories</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.categories.map((c) => (
              <span key={c} className="text-xs font-medium bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
