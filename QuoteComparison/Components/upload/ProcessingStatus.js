import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProcessingStatus({ status, progress, error }) {
  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-6 h-6 text-red-500" />;
    if (status === "complete") return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    return <Loader2 className="w-6 h-6 animate-spin text-amber-500" />;
  };

  const getStatusText = () => {
    if (error) return "Error processing file";
    if (status === "complete") return "Processing complete";
    if (status === "extracting") return "Extracting quote data...";
    if (status === "uploading") return "Uploading file...";
    return "Processing...";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium text-slate-900">{getStatusText()}</p>
            {!error && status !== "complete" && (
              <p className="text-sm text-slate-500">Please wait while we process your quote</p>
            )}
          </div>
        </div>
        
        {!error && status !== "complete" && (
          <Progress value={progress} className="h-2" />
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}