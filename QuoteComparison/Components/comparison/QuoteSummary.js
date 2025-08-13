import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, DollarSign, Shield, ExternalLink } from "lucide-react";

export default function QuoteSummary({ quote, title, color }) {
  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-500"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-500"
    }
  };

  const colors = colorClasses[color] || colorClasses.green;

  return (
    <Card className={`${colors.bg} ${colors.border} border-2 shadow-lg`}>
      <CardHeader>
        <CardTitle className={`${colors.text} text-xl flex items-center gap-2`}>
          <Shield className={`w-5 h-5 ${colors.icon}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className={`w-5 h-5 ${colors.icon}`} />
            <div>
              <p className="font-bold text-slate-900 text-lg">{quote.insurer_name}</p>
              <p className="text-sm text-slate-600">{quote.policy_period}</p>
            </div>
          </div>
          {quote.file_url && (
            <a
              href={quote.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg ${colors.bg} hover:bg-opacity-80 transition-colors`}
            >
              <ExternalLink className={`w-4 h-4 ${colors.icon}`} />
            </a>
          )}
        </div>

        {quote.total_premium && (
          <div className="text-center py-4 bg-white/60 rounded-lg">
            <DollarSign className={`w-6 h-6 ${colors.icon} mx-auto mb-1`} />
            <p className={`text-3xl font-bold ${colors.text}`}>
              ${quote.total_premium.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">Total Annual Premium</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {quote.coverages?.length || 0}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Coverages</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {quote.exclusions?.length || 0}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Exclusions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {quote.key_features?.length || 0}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Features</p>
          </div>
        </div>

        {quote.key_features && quote.key_features.length > 0 && (
          <div className="pt-4 border-t border-white/60">
            <p className="font-medium text-slate-900 mb-2">Key Features</p>
            <div className="flex flex-wrap gap-2">
              {quote.key_features.slice(0, 4).map((feature, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${colors.border} ${colors.text} bg-white/60 text-xs`}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}