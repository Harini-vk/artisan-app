import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const entrepreneurCategories = ["Pottery", "Ceramics", "Textiles", "Jewelry", "Food Products", "Beauty & Wellness", "Art & Decor", "Woodcraft", "Leather", "Natural Dyes"];
const investorCategories = ["Handmade Crafts", "Textile Products", "Food Products", "Beauty and Wellness", "Art and Decor"];

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const role = user?.role;

  // Entrepreneur state
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [products, setProducts] = useState<{ name: string; description: string; price: string }[]>([]);

  // Investor / Organizer state
  const [organization, setOrganization] = useState("");
  const [investInterests, setInvestInterests] = useState<string[]>([]);

  const toggleInterest = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const addProduct = () => {
    if (productName && productDesc && productPrice) {
      setProducts([...products, { name: productName, description: productDesc, price: productPrice }]);
      setProductName("");
      setProductDesc("");
      setProductPrice("");
    }
  };

  const handleComplete = async () => {
    let res;
    if (role === "entrepreneur") {
      res = await completeOnboarding({ phone, businessType, experience, interests: selectedInterests, products });
    } else {
      res = await completeOnboarding({ organization, interests: investInterests, phone });
    }

    if (res.success) {
      toast({ title: "Welcome!", description: "Your profile has been set up successfully." });
    } else {
      toast({ title: "Error", description: res.error || "Failed to save profile", variant: "destructive" });
    }
  };

  if (role === "entrepreneur") {
    return (
      <div className="min-h-screen bg-background px-6 py-8 max-w-md mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Set Up Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Tell us about your business</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Business Type</label>
            <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. Handmade Pottery & Ceramics"
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Experience</label>
            <select value={experience} onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select experience</option>
              <option value="< 1 year">Less than 1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Interests & Categories</label>
            <div className="flex flex-wrap gap-2">
              {entrepreneurCategories.map((cat) => (
                <button key={cat} type="button" onClick={() => toggleInterest(cat, selectedInterests, setSelectedInterests)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${selectedInterests.includes(cat) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}>{cat}</button>
              ))}
            </div>
          </div>

          {/* Add Products Section */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-medium text-muted-foreground">Add Products (Optional)</label>
            {products.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-card rounded-xl p-3 border border-border">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.price}</p>
                </div>
                <button onClick={() => setProducts(products.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="space-y-2 bg-card rounded-xl p-3 border border-border">
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={productDesc} onChange={(e) => setProductDesc(e.target.value)} placeholder="Short description"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Price (e.g. ₹1,200)"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button type="button" onClick={addProduct}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                <Plus className="h-3 w-3" /> Add Product
              </button>
            </div>
          </div>
        </div>

        <button onClick={handleComplete}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          Continue <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Investor / Organizer onboarding
  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-md mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Set Up Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {role === "investor" ? "Tell us about your investment interests" : "Tell us about your organization"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
            className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            {role === "investor" ? "Organization (Optional)" : "Organization Name"}
          </label>
          <input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Your organization name"
            className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            {role === "investor" ? "Investment Interests" : "Event Categories of Interest"}
          </label>
          <div className="flex flex-wrap gap-2">
            {investorCategories.map((cat) => (
              <button key={cat} type="button" onClick={() => toggleInterest(cat, investInterests, setInvestInterests)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${investInterests.includes(cat) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleComplete}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
        Continue <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
