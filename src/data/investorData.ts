import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

export interface Entrepreneur {
  id: string;
  name: string;
  businessName: string;
  businessCategory: string;
  experience: string;
  description: string;
  specializations: string[];
  products: EntrepreneurProduct[];
}

export interface EntrepreneurProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  entrepreneurId: string;
  entrepreneurName: string;
}

export interface InvestorNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "business" | "response" | "update";
}

export const entrepreneurs: Entrepreneur[] = [
  {
    id: "e1",
    name: "Priya Sharma",
    businessName: "Priya's Pottery Studio",
    businessCategory: "Handmade Crafts",
    experience: "3-5 years",
    description: "Artisan pottery studio specializing in hand-thrown ceramics with natural glazes. Each piece is unique and crafted with care using traditional techniques passed down through generations.",
    specializations: ["Ceramics", "Pottery", "Natural Glazes"],
    products: [],
  },
  {
    id: "e2",
    name: "Anita Desai",
    businessName: "Weave & Wonder",
    businessCategory: "Textile Products",
    experience: "5-10 years",
    description: "Handwoven textiles using organic cotton and natural dyes. Creating sustainable fashion pieces and home décor that celebrate India's rich textile heritage.",
    specializations: ["Handloom", "Natural Dyes", "Sustainable Fashion"],
    products: [],
  },
  {
    id: "e3",
    name: "Meera Joshi",
    businessName: "Nature's Touch Wellness",
    businessCategory: "Beauty and Wellness",
    experience: "1-3 years",
    description: "Handmade skincare and wellness products using Ayurvedic ingredients. All products are cruelty-free, organic, and packaged sustainably.",
    specializations: ["Skincare", "Ayurvedic", "Organic Products"],
    products: [],
  },
];

export const allProducts: EntrepreneurProduct[] = [
  {
    id: "p1",
    name: "Handcrafted Ceramic Bowl Set",
    description: "Set of 4 hand-thrown ceramic bowls with natural glazes. Each bowl is unique with subtle variations in color and texture.",
    price: "₹1,200",
    image: product1,
    category: "Handmade Crafts",
    entrepreneurId: "e1",
    entrepreneurName: "Priya Sharma",
  },
  {
    id: "p2",
    name: "Macrame Wall Hanging",
    description: "Large handwoven macrame piece with natural cotton cord. Perfect for living room or bedroom décor.",
    price: "₹2,500",
    image: product2,
    category: "Handmade Crafts",
    entrepreneurId: "e1",
    entrepreneurName: "Priya Sharma",
  },
  {
    id: "p3",
    name: "Organic Cotton Stole",
    description: "Hand-dyed organic cotton stole with block printing. Lightweight and perfect for all seasons.",
    price: "₹1,800",
    image: product2,
    category: "Textile Products",
    entrepreneurId: "e2",
    entrepreneurName: "Anita Desai",
  },
  {
    id: "p4",
    name: "Terracotta Vase",
    description: "Hand-shaped terracotta vase with an earthy matte finish. Ideal for dried flowers and home décor.",
    price: "₹800",
    image: product1,
    category: "Handmade Crafts",
    entrepreneurId: "e1",
    entrepreneurName: "Priya Sharma",
  },
  {
    id: "p5",
    name: "Herbal Face Serum",
    description: "Ayurvedic face serum with kumkumadi oil blend. Suitable for all skin types, naturally sourced ingredients.",
    price: "₹950",
    image: product2,
    category: "Beauty and Wellness",
    entrepreneurId: "e3",
    entrepreneurName: "Meera Joshi",
  },
  {
    id: "p6",
    name: "Handloom Cushion Covers",
    description: "Set of 2 handloom cushion covers with geometric patterns. Made with natural dyes on organic cotton.",
    price: "₹1,400",
    image: product1,
    category: "Textile Products",
    entrepreneurId: "e2",
    entrepreneurName: "Anita Desai",
  },
];

// Link products to entrepreneurs
entrepreneurs.forEach((e) => {
  e.products = allProducts.filter((p) => p.entrepreneurId === e.id);
});

export const productCategories = [
  "All",
  "Handmade Crafts",
  "Textile Products",
  "Food Products",
  "Beauty and Wellness",
  "Art and Decor",
];

export const investorNotifications: InvestorNotification[] = [
  {
    id: "in1",
    title: "New Business Listed",
    message: "Priya's Pottery Studio has listed new handcrafted ceramic products in your interest area.",
    time: "1 hour ago",
    read: false,
    type: "business",
  },
  {
    id: "in2",
    title: "Interest Response",
    message: "Anita Desai from Weave & Wonder has responded to your interest request.",
    time: "4 hours ago",
    read: false,
    type: "response",
  },
  {
    id: "in3",
    title: "Category Update",
    message: "3 new products added in 'Beauty and Wellness' category this week.",
    time: "1 day ago",
    read: true,
    type: "update",
  },
  {
    id: "in4",
    title: "New Entrepreneur",
    message: "A new entrepreneur specializing in organic food products has joined ArtisanHub.",
    time: "2 days ago",
    read: true,
    type: "business",
  },
];
