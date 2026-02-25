import { useState } from "react";
import { sampleProducts } from "@/data/mockData";
import type { Product } from "@/data/mockData";
import { Plus, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function ProductShowcasePage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "" });

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price) return;
    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
      image: sampleProducts[0].image,
    };
    setProducts((prev) => [product, ...prev]);
    setShowAdd(false);
    setNewProduct({ name: "", description: "", price: "", category: "" });
    toast({ title: "Product Added!", description: "Your product is now visible in your showcase." });
  };

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
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-xl overflow-hidden shadow-card">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
            <div className="p-3 space-y-1">
              <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-sm text-primary">{product.price}</span>
                <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading">Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-center h-28 bg-accent rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
              <div className="text-center text-muted-foreground">
                <Camera className="h-6 w-6 mx-auto mb-1" />
                <span className="text-xs">Upload Photo</span>
              </div>
            </div>
            <input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
            />
            <div className="flex gap-3">
              <input
                placeholder="Price (₹)"
                value={newProduct.price}
                onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                className="flex-1 px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                className="flex-1 px-3 py-2.5 rounded-lg bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
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
