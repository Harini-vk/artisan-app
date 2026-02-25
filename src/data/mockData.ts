import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

export interface Event {
  id: string;
  name: string;
  category: string;
  date: string;
  description: string;
  longDescription: string;
  image: string;
  location: string;
  organizer: string;
  eligibility: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

export interface Scheme {
  id: string;
  name: string;
  type: string;
  description: string;
  eligibility: string;
  benefits: string;
  link: string;
}

export interface GuidanceTip {
  id: string;
  category: string;
  title: string;
  content: string;
  icon: string;
}

export interface EventApplication {
  eventId: string;
  status: "applied" | "approved" | "past";
  appliedDate: string;
}

export const recommendedEvents: Event[] = [
  {
    id: "1",
    name: "Artisan Craft Fair 2026",
    category: "Craft Fair",
    date: "March 15, 2026",
    description: "Showcase your handmade products at the largest regional craft fair.",
    longDescription: "Join over 200 artisans from across the region at the annual Artisan Craft Fair. This three-day event features dedicated stalls for handmade goods, live craft demonstrations, networking sessions with wholesale buyers, and workshops on pricing and marketing your products.",
    image: event1,
    location: "Convention Center, Downtown",
    organizer: "Women Artisans Collective",
    eligibility: "Women entrepreneurs with handmade products",
  },
  {
    id: "2",
    name: "Jewelry Making Workshop",
    category: "Workshop",
    date: "March 22, 2026",
    description: "Learn advanced jewelry-making techniques from master artisans.",
    longDescription: "A hands-on two-day workshop covering wire wrapping, bead stringing, metal stamping, and resin jewelry. All materials provided. Participants receive a certification upon completion. Limited to 30 seats.",
    image: event2,
    location: "Creative Arts Studio, Sector 12",
    organizer: "Crafters Guild",
    eligibility: "Open to all skill levels",
  },
  {
    id: "3",
    name: "Textile & Weaving Expo",
    category: "Exhibition",
    date: "April 5, 2026",
    description: "Exhibition featuring handwoven textiles and natural dyeing techniques.",
    longDescription: "Explore the rich traditions of handloom weaving and natural dyeing. This expo brings together weavers, dyers, and textile enthusiasts. Includes buyer-seller meet, live demonstrations, and talks on sustainable fashion.",
    image: event3,
    location: "Heritage Hall, Old City",
    organizer: "Textile Board of India",
    eligibility: "Textile artisans and entrepreneurs",
  },
  {
    id: "4",
    name: "Women Entrepreneur Summit",
    category: "Conference",
    date: "April 18, 2026",
    description: "Connect, learn, and grow at the annual women entrepreneur summit.",
    longDescription: "A full-day summit featuring keynote speakers, panel discussions on funding, marketing, and scaling your business. Networking lunch included. Meet mentors and potential investors.",
    image: event1,
    location: "Grand Hotel, Business District",
    organizer: "SheLeads Foundation",
    eligibility: "Women business owners and aspiring entrepreneurs",
  },
];

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Handcrafted Ceramic Bowl Set",
    description: "Set of 4 hand-thrown ceramic bowls with natural glazes",
    price: "₹1,200",
    image: product1,
    category: "Pottery",
  },
  {
    id: "2",
    name: "Macrame Wall Hanging",
    description: "Large handwoven macrame piece with natural cotton cord",
    price: "₹2,500",
    image: product2,
    category: "Macrame",
  },
  {
    id: "3",
    name: "Terracotta Vase",
    description: "Hand-shaped terracotta vase with earthy finish",
    price: "₹800",
    image: product1,
    category: "Pottery",
  },
  {
    id: "4",
    name: "Woven Storage Basket",
    description: "Natural fiber storage basket, handwoven with traditional techniques",
    price: "₹650",
    image: product2,
    category: "Baskets",
  },
];

export const schemes: Scheme[] = [
  {
    id: "1",
    name: "Mudra Loan Scheme",
    type: "Loan",
    description: "Micro-finance loans up to ₹10 lakh for small businesses without collateral.",
    eligibility: "Women entrepreneurs with a viable business plan",
    benefits: "Loans from ₹50,000 to ₹10,00,000 at subsidized interest rates",
    link: "#",
  },
  {
    id: "2",
    name: "Stand-Up India",
    type: "Subsidy",
    description: "Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.",
    eligibility: "Women setting up a greenfield enterprise in manufacturing, services, or trading",
    benefits: "Composite loan covering term loan and working capital",
    link: "#",
  },
  {
    id: "3",
    name: "PMEGP",
    type: "Grant",
    description: "Prime Minister's Employment Generation Programme for micro enterprises.",
    eligibility: "Women above 18 with projects up to ₹25 lakh (manufacturing)",
    benefits: "25-35% subsidy on project cost for women beneficiaries",
    link: "#",
  },
  {
    id: "4",
    name: "Mahila Udyam Nidhi",
    type: "Loan",
    description: "Special fund for women to set up new small-scale ventures.",
    eligibility: "Women entrepreneurs in small-scale industries",
    benefits: "Soft loans up to ₹10 lakh with extended repayment period",
    link: "#",
  },
];

export const guidanceTips: GuidanceTip[] = [
  {
    id: "1",
    category: "Getting Started",
    title: "Register Your Business",
    content: "Start by registering as a sole proprietor or OPC. Apply for GST if turnover exceeds ₹20 lakh. Get an Udyam Registration for MSME benefits.",
    icon: "📋",
  },
  {
    id: "2",
    category: "Getting Started",
    title: "Create a Business Plan",
    content: "Outline your products, target market, pricing strategy, and financial projections. A solid plan helps secure funding and stay focused.",
    icon: "📝",
  },
  {
    id: "3",
    category: "Marketing",
    title: "Build Your Online Presence",
    content: "Create social media profiles on Instagram and Facebook. Share behind-the-scenes content, product stories, and customer testimonials.",
    icon: "📱",
  },
  {
    id: "4",
    category: "Marketing",
    title: "Product Photography Tips",
    content: "Use natural light, clean backgrounds, and multiple angles. Show products in use. Good photos can increase sales by 40%.",
    icon: "📸",
  },
  {
    id: "5",
    category: "Finance",
    title: "Pricing Your Products",
    content: "Calculate material costs + labor + overhead + profit margin (at least 30%). Don't undervalue handmade work. Research competitor pricing.",
    icon: "💰",
  },
  {
    id: "6",
    category: "Growth",
    title: "Participate in Events",
    content: "Craft fairs, exhibitions, and markets are great ways to reach new customers, get feedback, and build your brand presence.",
    icon: "🎪",
  },
];

export const notifications = [
  {
    id: "1",
    title: "New Event Recommended",
    message: "Artisan Craft Fair 2026 matches your interests in pottery and ceramics.",
    time: "2 hours ago",
    read: false,
    type: "event" as const,
  },
  {
    id: "2",
    title: "Application Approved",
    message: "Your application for Jewelry Making Workshop has been approved!",
    time: "1 day ago",
    read: false,
    type: "status" as const,
  },
  {
    id: "3",
    title: "New Scheme Available",
    message: "Check out the Mahila Udyam Nidhi scheme for women entrepreneurs.",
    time: "3 days ago",
    read: true,
    type: "scheme" as const,
  },
  {
    id: "4",
    title: "Event Reminder",
    message: "Textile & Weaving Expo is happening in 2 weeks. Don't forget to prepare!",
    time: "5 days ago",
    read: true,
    type: "event" as const,
  },
];
