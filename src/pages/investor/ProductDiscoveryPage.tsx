import { useState } from "react";
import { Search } from "lucide-react";
import { allProducts, productCategories } from "@/data/investorData";
import type { EntrepreneurProduct } from "@/data/investorData";
import { useNavigate } from "react-router-dom";

export default function ProductDiscoveryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const filtered = allProducts.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground">Discover Products</h2>
        <p className="text-sm text-muted-foreground mt-1">Browse handmade products from entrepreneurs</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {productCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap text-xs font-medium px-3 py-2 rounded-full transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((product) => (
          <button
            key={product.id}
            onClick={() => navigate(`/investor/product/${product.id}`)}
            className="bg-card rounded-xl overflow-hidden shadow-card text-left hover:shadow-elevated transition-shadow"
          >
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
            <div className="p-3 space-y-1">
              <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
              <p className="text-xs text-muted-foreground">{product.entrepreneurName}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-sm text-primary">{product.price}</span>
                <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">{product.category}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No products found</p>
        </div>
      )}
    </div>
  );
}
