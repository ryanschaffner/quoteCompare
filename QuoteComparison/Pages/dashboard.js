import React, { useState, useEffect } from "react";
import { QuoteComparison } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, FileText, BarChart3, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import DashboardStats from "../components/dashboard/DashboardStats";
import ComparisonCard from "../components/dashboard/ComparisonCard";

export default function Dashboard() {
  const [comparisons, setComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = async () => {
    setIsLoading(true);
    try {
      const fetchedComparisons = await QuoteComparison.list("-created_date");
      setComparisons(fetchedComparisons);
    } catch (error) {
      console.error("Error loading comparisons:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteComparison = async (comparisonId) => {
    try {
      await QuoteComparison.delete(comparisonId);
      loadComparisons();
    } catch (error) {
      console.error("Error deleting comparison:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                    Insurance Quote Analysis
                  </h1>
                  <p className="text-slate-300 text-lg font-medium">
                    Professional comparison tools for informed decisions
                  </p>
                </div>
                <Link to={createPageUrl("Upload")}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-5 h-5 mr-2" />
                    New Comparison
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <DashboardStats comparisons={comparisons} isLoading={isLoading} />

        {/* Comparisons List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Comparisons</h2>
            <Badge variant="outline" className="bg-white/80 text-slate-600">
              {comparisons.length} total
            </Badge>
          </div>

          <div className="grid gap-6">
            <AnimatePresence>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : comparisons.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No comparisons yet</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Start by uploading two insurance quotes to create your first professional comparison.
                  </p>
                  <Link to={createPageUrl("Upload")}>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Comparison
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                comparisons.map((comparison) => (
                  <ComparisonCard
                    key={comparison.id}
                    comparison={comparison}
                    onDelete={handleDeleteComparison}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}