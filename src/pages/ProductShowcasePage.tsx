import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/data/mockData";
import { Plus, Camera, Package } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function ProductShowcasePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "", image: "" });

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      if (!user) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("entrepreneur_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        const mapped: Product[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image || "",
          category: p.category,
        }));
        setProducts(mapped);
      }
      if (error) console.error("Error fetching products:", error);
      setLoading(false);
    }
    fetchProducts();
  }, [user]);

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price || !user) return;

    const { data, error } = await supabase
      .from("products")
      .insert({
        entrepreneur_id: user.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image || null,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    if (data) {
      setProducts((prev) => [
        {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image || "",
          category: data.category,
        },
        ...prev,
      ]);
    }
    setShowAdd(false);
    setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
    toast({ title: "Product Added!", description: "Your product is now visible in your showcase." });
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading products...</div>;
  }

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">My Products</h2>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products listed</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-card rounded-xl overflow-hidden shadow-card">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-accent flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="p-3 space-y-1">
                <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-sm text-primary">{product.price}</span>
                  {product.category && (
                    <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No products yet. Add your first product!</p>
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading">Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Image URL (optional)</label>
              <input
                placeholder="e.g. https://example.com/image.jpg"
                value={newProduct.image}
                onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">Leave blank to use a default placeholder</p>
            </div>
            <input
              placeholder="e.g. Handcrafted Ceramic Bowl"
              value={newProduct.name}
              onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="e.g. Set of 4 hand-thrown bowls with natural glazes"
              value={newProduct.description}
              onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
            />
            <div className="flex gap-3">
              <input
                placeholder="e.g. ₹1,200"
                value={newProduct.price}
                onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                className="flex-1 px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                className="flex-1 px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Category</option>
                <option value="Pottery">Pottery</option>
                <option value="Textiles">Textiles</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Food Products">Food Products</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Art & Decor">Art & Decor</option>
                <option value="Woodcraft">Woodcraft</option>
                <option value="Leather">Leather</option>
                <option value="Baskets">Baskets</option>
                <option value="Macrame">Macrame</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Add Product
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
