import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, DollarSign, Calendar, Shield } from "lucide-react";

export default function QuotePreview({ quote, title }) {
  if (!quote) return null;

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-900">{quote.insurer_name}</p>
            <p className="text-sm text-slate-500">{quote.file_name}</p>
          </div>
        </div>

        {quote.total_premium && (
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${quote.total_premium.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">Total Premium</p>
            </div>
          </div>
        )}

        {quote.policy_period && (
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">{quote.policy_period}</p>
              <p className="text-sm text-slate-500">Policy Period</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              {quote.coverages?.length || 0}
            </p>
            <p className="text-sm text-slate-500">Coverages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              {quote.exclusions?.length || 0}
            </p>
            <p className="text-sm text-slate-500">Exclusions</p>
          </div>
        </div>

        {quote.key_features && quote.key_features.length > 0 && (
          <div className="pt-4 border-t">
            <p className="font-medium text-slate-900 mb-2">Key Features</p>
            <div className="flex flex-wrap gap-2">
              {quote.key_features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
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