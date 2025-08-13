import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Calendar, User, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ComparisonCard({ comparison, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ready_for_review":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "sent_to_client":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Draft";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                {comparison.comparison_name}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {comparison.client_name || "No client specified"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(comparison.created_date), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(comparison.status)} border font-medium px-3 py-1`}>
              {formatStatus(comparison.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparison.executive_summary && (
              <p className="text-slate-600 text-sm line-clamp-2">
                {comparison.executive_summary}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">2 quotes compared</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(comparison.id)}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Link to={createPageUrl(`Comparison?id=${comparison.id}`)}>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}