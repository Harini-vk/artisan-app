import { useState } from "react";
import { guidanceTips } from "@/data/mockData";
import { ChevronDown, ChevronUp } from "lucide-react";

const categories = [...new Set(guidanceTips.map((t) => t.category))];

export default function GuidancePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground">Business Guidance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tips to start, manage, and grow your business
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="space-y-3">
          <h3 className="font-heading text-base font-semibold text-foreground">{cat}</h3>
          <div className="space-y-2">
            {guidanceTips
              .filter((t) => t.category === cat)
              .map((tip) => {
                const expanded = expandedId === tip.id;
                return (
                  <div
                    key={tip.id}
                    className="bg-card rounded-xl shadow-card overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(expanded ? null : tip.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tip.icon}</span>
                        <span className="font-medium text-foreground text-sm">{tip.title}</span>
                      </div>
                      {expanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {expanded && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed pl-10">
                          {tip.content}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
