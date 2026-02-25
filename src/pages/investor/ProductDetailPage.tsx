import { useParams, useNavigate } from "react-router-dom";
import { allProducts } from "@/data/investorData";
import { ArrowLeft, User } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <div className="px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      {/* Image */}
      <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />

      <div className="px-4 py-5 space-y-4">
        <div>
          <span className="text-xs font-medium bg-accent text-accent-foreground px-2.5 py-1 rounded-full">{product.category}</span>
          <h2 className="font-heading text-xl font-bold text-foreground mt-3">{product.name}</h2>
          <p className="font-heading text-lg font-semibold text-primary mt-1">{product.price}</p>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Entrepreneur link */}
        <button
          onClick={() => navigate(`/investor/entrepreneur/${product.entrepreneurId}`)}
          className="w-full flex items-center gap-3 bg-card rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow"
        >
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-foreground">{product.entrepreneurName}</p>
            <p className="text-xs text-muted-foreground">View Entrepreneur Profile →</p>
          </div>
        </button>
      </div>
    </div>
  );
}
