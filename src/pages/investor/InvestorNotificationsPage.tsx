import { investorNotifications } from "@/data/investorData";
import { Building2, MessageCircle, TrendingUp } from "lucide-react";

const typeIcons = {
  business: <Building2 className="h-5 w-5" />,
  response: <MessageCircle className="h-5 w-5" />,
  update: <TrendingUp className="h-5 w-5" />,
};

export default function InvestorNotificationsPage() {
  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <h2 className="font-heading text-xl font-bold text-foreground">Notifications</h2>

      <div className="space-y-3">
        {investorNotifications.map((n) => (
          <div
            key={n.id}
            className={`bg-card rounded-xl p-4 shadow-card flex gap-3 ${!n.read ? "border-l-4 border-l-primary" : ""}`}
          >
            <span className={`p-2 rounded-lg h-fit ${!n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {typeIcons[n.type]}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
              <span className="text-xs text-muted-foreground/60 mt-2 block">{n.time}</span>
            </div>
            {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
