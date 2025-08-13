import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadZone({ title, onFileUpload, isProcessing, quote, onRemove }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-200 hover:border-amber-400 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Processing PDF...</p>
              <p className="text-sm text-slate-400">Extracting quote data</p>
            </motion.div>
          ) : quote ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-slate-900">{quote.insurer_name || "Quote Uploaded"}</h3>
                <p className="text-sm text-slate-600">{quote.file_name}</p>
                {quote.total_premium && (
                  <p className="text-lg font-bold text-green-600">
                    ${quote.total_premium.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-slate-400">Coverages</p>
                  <p className="font-semibold text-slate-700">
                    {quote.coverages?.length || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Exclusions</p>
                  <p className="font-semibold text-slate-700">
                    {quote.exclusions?.length || 0}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={onRemove}
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-amber-500" />
              </div>
              
              <h3 className="font-semibold text-slate-900 mb-2">Upload Insurance Quote</h3>
              <p className="text-sm text-slate-500 mb-6">
                Drag and drop your PDF quote or click to browse
              </p>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose PDF File
              </Button>
              
              <p className="text-xs text-slate-400 mt-4">
                Only PDF files are supported
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}