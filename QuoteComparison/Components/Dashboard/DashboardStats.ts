import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardStats({ comparisons, isLoading }) {
  const stats = [
    {
      title: "Total Comparisons",
      value: comparisons.length,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Draft Comparisons",
      value: comparisons.filter(c => c.status === "draft").length,
      icon: Clock,
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    },
    {
      title: "Ready for Review",
      value: comparisons.filter(c => c.status === "ready_for_review").length,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Sent to Clients",
      value: comparisons.filter(c => c.status === "sent_to_client").length,
      icon: CheckCircle2,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                {isLoading ? (
                  <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                ) : (
                  stat.value
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}