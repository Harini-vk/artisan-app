import { useParams, useNavigate } from "react-router-dom";
import { entrepreneurs } from "@/data/investorData";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function EntrepreneurProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const entrepreneur = entrepreneurs.find((e) => e.id === id);

  if (!entrepreneur) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        <p>Entrepreneur not found</p>
      </div>
    );
  }

  const handleInterest = () => {
    toast({
      title: "Interest Sent!",
      description: `Your interest has been sent to ${entrepreneur.name}. They'll be notified shortly.`,
    });
  };

  return (
    <div className="animate-fade-in px-4 py-5 space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Profile header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">{entrepreneur.name}</h2>
          <p className="text-sm text-muted-foreground">{entrepreneur.businessName}</p>
        </div>
      </div>

      {/* Business info */}
      <div className="bg-card rounded-xl p-4 shadow-card space-y-3">
        <h3 className="font-heading font-semibold text-foreground text-sm">Business Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category</span>
            <span className="text-foreground font-medium">{entrepreneur.businessCategory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Experience</span>
            <span className="text-foreground font-medium">{entrepreneur.experience}</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-2">About the Business</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{entrepreneur.description}</p>
      </div>

      {/* Specializations */}
      <div className="bg-card rounded-xl p-4 shadow-card">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-2">Specializations</h3>
        <div className="flex flex-wrap gap-2">
          {entrepreneur.specializations.map((s) => (
            <span key={s} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Product Portfolio</h3>
        <div className="grid grid-cols-2 gap-3">
          {entrepreneur.products.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/investor/product/${product.id}`)}
              className="bg-card rounded-xl overflow-hidden shadow-card text-left"
            >
              <img src={product.image} alt={product.name} className="w-full h-28 object-cover" />
              <div className="p-2.5">
                <h4 className="text-xs font-medium text-foreground line-clamp-1">{product.name}</h4>
                <p className="text-xs text-primary font-semibold mt-0.5">{product.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Express Interest */}
      <div className="flex gap-3">
        <button
          onClick={handleInterest}
          className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
        >
          Express Interest
        </button>
        <button
          onClick={handleInterest}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-card rounded-lg border text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <Mail className="h-4 w-4" /> Contact
        </button>
      </div>
    </div>
  );
}
