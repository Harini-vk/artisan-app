export interface OrganizerEvent {
  id: string;
  name: string;
  category: string;
  date: string;
  description: string;
  location: string;
  active: boolean;
  invitedEntrepreneurs: string[];
  applications: EventApplication[];
}

export interface EventApplication {
  entrepreneurId: string;
  entrepreneurName: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

export interface OrganizerNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const organizerEvents: OrganizerEvent[] = [
  {
    id: "oe1",
    name: "Artisan Craft Fair 2026",
    category: "Craft Fair",
    date: "March 15, 2026",
    description: "Showcase handmade products at the largest regional craft fair for women artisans.",
    location: "Convention Center, Downtown",
    active: true,
    invitedEntrepreneurs: ["Priya Sharma", "Anita Desai"],
    applications: [
      { entrepreneurId: "e1", entrepreneurName: "Priya Sharma", status: "approved", appliedDate: "Feb 10, 2026" },
      { entrepreneurId: "e3", entrepreneurName: "Meera Joshi", status: "pending", appliedDate: "Feb 18, 2026" },
    ],
  },
  {
    id: "oe2",
    name: "Textile & Weaving Expo",
    category: "Exhibition",
    date: "April 5, 2026",
    description: "Exhibition featuring handwoven textiles and natural dyeing techniques.",
    location: "Heritage Hall, Old City",
    active: true,
    invitedEntrepreneurs: ["Anita Desai"],
    applications: [
      { entrepreneurId: "e2", entrepreneurName: "Anita Desai", status: "approved", appliedDate: "Feb 5, 2026" },
    ],
  },
  {
    id: "oe3",
    name: "Beauty & Wellness Showcase",
    category: "Showcase",
    date: "May 10, 2026",
    description: "A curated event for organic beauty and wellness products.",
    location: "Wellness Hub, Green Park",
    active: false,
    invitedEntrepreneurs: [],
    applications: [],
  },
];

export const organizerNotifications: OrganizerNotification[] = [
  { id: "on1", title: "New Application", message: "Meera Joshi applied for Artisan Craft Fair 2026.", time: "1 hour ago", read: false },
  { id: "on2", title: "Event Reminder", message: "Textile & Weaving Expo is in 6 weeks. Review invitations.", time: "1 day ago", read: false },
  { id: "on3", title: "Application Updated", message: "Priya Sharma confirmed attendance for Craft Fair.", time: "2 days ago", read: true },
  { id: "on4", title: "System Update", message: "New event categories available for creation.", time: "5 days ago", read: true },
];

export const eventCategories = ["Craft Fair", "Workshop", "Exhibition", "Conference", "Showcase", "Market"];
