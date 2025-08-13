import React, { useState } from "react";
import { InsuranceQuote, QuoteComparison } from "@/entities/all";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Upload as UploadIcon, FileText, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

import UploadZone from "../components/upload/UploadZone";
import QuotePreview from "../components/upload/QuotePreview";

export default function Upload() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Setup, 2: Upload, 3: Review
  const [comparisonName, setComparisonName] = useState("");
  const [clientName, setClientName] = useState("");
  const [quotes, setQuotes] = useState([null, null]);
  const [processing, setProcessing] = useState([false, false]);
  const [error, setError] = useState("");
  const [isCreatingComparison, setIsCreatingComparison] = useState(false);

  const handleFileUpload = async (file, index) => {
    setProcessing(prev => {
      const newProcessing = [...prev];
      newProcessing[index] = true;
      return newProcessing;
    });
    setError("");

    try {
      // Upload file
      const { file_url } = await UploadFile({ file });
      
      // Extract data from PDF
      const extractionResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            insurer_name: { type: "string" },
            policy_period: { type: "string" },
            total_premium: { type: "number" },
            coverages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  coverage_type: { type: "string" },
                  limit: { type: "string" },
                  deductible: { type: "string" },
                  premium: { type: "number" }
                }
              }
            },
            exclusions: {
              type: "array",
              items: { type: "string" }
            },
            key_features: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      if (extractionResult.status === "success") {
        setQuotes(prev => {
          const newQuotes = [...prev];
          newQuotes[index] = {
            quote_name: `Quote ${String.fromCharCode(65 + index)}`,
            file_url,
            file_name: file.name,
            ...extractionResult.output
          };
          return newQuotes;
        });
      } else {
        throw new Error(extractionResult.details || "Failed to extract data from PDF");
      }
    } catch (error) {
      setError(`Error processing ${file.name}: ${error.message}`);
    }

    setProcessing(prev => {
      const newProcessing = [...prev];
      newProcessing[index] = false;
      return newProcessing;
    });
  };

  const canProceedToReview = () => {
    return quotes[0] && quotes[1] && !processing[0] && !processing[1];
  };

  const handleCreateComparison = async () => {
    if (!canProceedToReview() || !comparisonName.trim()) return;

    setIsCreatingComparison(true);
    try {
      // Create comparison record
      const comparison = await QuoteComparison.create({
        comparison_name: comparisonName.trim(),
        client_name: clientName.trim() || "Not specified",
        agent_recommendation: "Please review both quotes and provide your professional recommendation here.",
        executive_summary: "Detailed analysis comparing coverage options, limits, and pricing between the two insurance proposals."
      });

      // Create quote records
      const quoteA = await InsuranceQuote.create({
        ...quotes[0],
        comparison_id: comparison.id
      });

      const quoteB = await InsuranceQuote.create({
        ...quotes[1],
        comparison_id: comparison.id
      });

      // Update comparison with quote IDs
      await QuoteComparison.update(comparison.id, {
        quote_a_id: quoteA.id,
        quote_b_id: quoteB.id
      });

      // Navigate to comparison view
      navigate(createPageUrl(`Comparison?id=${comparison.id}`));
    } catch (error) {
      setError("Error creating comparison: " + error.message);
      setIsCreatingComparison(false);
    }
  };

  const removeQuote = (index) => {
    setQuotes(prev => {
      const newQuotes = [...prev];
      newQuotes[index] = null;
      return newQuotes;
    });
  };

  return (
    <div className="min-h-screen p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">New Quote Comparison</h1>
            <p className="text-slate-500 font-medium">Upload and analyze insurance quotes side-by-side</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { num: 1, label: "Setup", icon: FileText },
              { num: 2, label: "Upload Quotes", icon: UploadIcon },
              { num: 3, label: "Review & Compare", icon: CheckCircle2 }
            ].map(({ num, label, icon: Icon }, index) => (
              <div key={num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  step >= num 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 font-medium ${
                  step >= num ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {label}
                </span>
                {index < 2 && <ArrowRight className="w-4 h-4 mx-4 text-slate-300" />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Comparison Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="comparison-name" className="text-slate-700 font-medium">
                      Comparison Name *
                    </Label>
                    <Input
                      id="comparison-name"
                      value={comparisonName}
                      onChange={(e) => setComparisonName(e.target.value)}
                      placeholder="e.g., ABC Corp Commercial Insurance Renewal 2024"
                      className="border-slate-200 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-name" className="text-slate-700 font-medium">
                      Client Name
                    </Label>
                    <Input
                      id="client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client or business name"
                      className="border-slate-200 focus:border-amber-500"
                    />
                  </div>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!comparisonName.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 rounded-xl"
                  >
                    Continue to Upload
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <UploadZone
                  title="Quote A"
                  onFileUpload={(file) => handleFileUpload(file, 0)}
                  isProcessing={processing[0]}
                  quote={quotes[0]}
                  onRemove={() => removeQuote(0)}
                />
                <UploadZone
                  title="Quote B"
                  onFileUpload={(file) => handleFileUpload(file, 1)}
                  isProcessing={processing[1]}
                  quote={quotes[1]}
                  onRemove={() => removeQuote(1)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedToReview()}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl"
                >
                  Review Comparison
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <QuotePreview quote={quotes[0]} title="Quote A" />
                <QuotePreview quote={quotes[1]} title="Quote B" />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Upload
                </Button>
                <Button
                  onClick={handleCreateComparison}
                  disabled={isCreatingComparison}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 rounded-xl"
                >
                  {isCreatingComparison ? "Creating..." : "Create Comparison"}
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}