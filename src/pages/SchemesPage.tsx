import { schemes } from "@/data/mockData";
import { ExternalLink, BadgeCheck, Banknote, Gift, CreditCard } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  Loan: <Banknote className="h-5 w-5" />,
  Subsidy: <CreditCard className="h-5 w-5" />,
  Grant: <Gift className="h-5 w-5" />,
};

export default function SchemesPage() {
  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground">Government Schemes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Loans, subsidies & programs for women entrepreneurs
        </p>
      </div>

      <div className="space-y-4">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="bg-card rounded-xl p-4 shadow-card space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-primary/10 text-primary">
                  {typeIcons[scheme.type] || <BadgeCheck className="h-5 w-5" />}
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{scheme.name}</h3>
                  <span className="text-xs text-muted-foreground font-medium">{scheme.type}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{scheme.description}</p>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Eligibility: </span>
                <span className="text-muted-foreground">{scheme.eligibility}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Benefits: </span>
                <span className="text-muted-foreground">{scheme.benefits}</span>
              </div>
            </div>

            <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Learn More <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
