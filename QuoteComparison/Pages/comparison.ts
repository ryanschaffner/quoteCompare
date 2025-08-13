import React, { useState, useEffect } from "react";
import { QuoteComparison, InsuranceQuote } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import RecommendationEditor from "../components/comparison/RecommendationEditor";
import QuoteSummary from "../components/comparison/QuoteSummary";
import AIComparisonDisplay from "../components/comparison/AIComparisonDisplay";

export default function Comparison() {
  const [comparison, setComparison] = useState(null);
  const [quoteA, setQuoteA] = useState(null);
  const [quoteB, setQuoteB] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  const runAIAnalysis = async (comp, qA, qB) => {
    setIsGeneratingAnalysis(true);
    try {
        const analysisPrompt = `
You are an expert insurance analyst. Analyze the following insurance quote documents and perform these actions in order:

Quote A Details:
Insurer: ${qA.insurer_name || 'Not specified'}
Total Premium: $${qA.total_premium || 'Not available'}
Coverages: ${qA.coverages ? JSON.stringify(qA.coverages, null, 2) : 'No coverages listed'}
Exclusions: ${qA.exclusions ? JSON.stringify(qA.exclusions, null, 2) : 'No exclusions listed'}
Key Features: ${qA.key_features ? JSON.stringify(qA.key_features, null, 2) : 'No key features listed'}

Quote B Details:
Insurer: ${qB.insurer_name || 'Not specified'}
Total Premium: $${qB.total_premium || 'Not available'}
Coverages: ${qB.coverages ? JSON.stringify(qB.coverages, null, 2) : 'No coverages listed'}
Exclusions: ${qB.exclusions ? JSON.stringify(qB.exclusions, null, 2) : 'No exclusions listed'}
Key Features: ${qB.key_features ? JSON.stringify(qB.key_features, null, 2) : 'No key features listed'}

Perform these actions in order:

1. **High-Level Summary:** First, write a brief, neutral, high-level summary of the pros and cons for each quote option. Focus on major differences in price and key coverages. DO NOT recommend one quote over another. Start with a title, e.g., "## High-Level Summary".

2. **Separator:** After the summary, add the text '---SEPARATOR---' on a new line by itself.

3. **Quote Comparison Table:** After the separator, create a comparison table in markdown format. Start with a title "### Quote Comparison". The first column should list features ('Carrier Name', 'Total Premium', and each coverage type). Create a column for each quote. Use "N/A" if a detail isn't found.

4. **Key Differences:** After the table, write a brief, bulleted summary titled "### Key Differences".
`;

        const result = await InvokeLLM({ prompt: analysisPrompt });
        
        // Check if result is a string and contains the separator
        if (typeof result === 'string' && result.includes('---SEPARATOR---')) {
            const [summary, details] = result.split('---SEPARATOR---');
            
            const updatedData = {
                executive_summary: summary.trim(),
                agent_recommendation: details.trim()
            };

            await QuoteComparison.update(comp.id, updatedData);
            setComparison(prev => ({ ...prev, ...updatedData }));
        } else {
            // If no separator found, put everything in agent_recommendation
            const updatedData = {
                executive_summary: "AI analysis completed - see detailed comparison below.",
                agent_recommendation: typeof result === 'string' ? result : JSON.stringify(result)
            };

            await QuoteComparison.update(comp.id, updatedData);
            setComparison(prev => ({ ...prev, ...updatedData }));
        }

    } catch (error) {
        console.error("Error generating AI analysis:", error);
        
        // Update with error message
        const errorData = {
            executive_summary: "Error generating AI analysis. Please try regenerating the analysis.",
            agent_recommendation: `An error occurred while generating the comparison analysis. Error: ${error.message}`
        };
        
        try {
            await QuoteComparison.update(comp.id, errorData);
            setComparison(prev => ({ ...prev, ...errorData }));
        } catch (updateError) {
            console.error("Error updating with error message:", updateError);
        }
    }
    setIsGeneratingAnalysis(false);
  };
  
  useEffect(() => {
    const loadData = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const comparisonId = urlParams.get('id');
        
        if (!comparisonId) {
          setIsLoading(false);
          return;
        }
    
        try {
          // Load comparison
          const comparisons = await QuoteComparison.filter({ id: comparisonId });
          if (comparisons.length === 0) throw new Error("Comparison not found");
          
          const comp = comparisons[0];
          setComparison(comp);
    
          // Load quotes
          const [quoteAData] = await InsuranceQuote.filter({ id: comp.quote_a_id });
          const [quoteBData] = await InsuranceQuote.filter({ id: comp.quote_b_id });
          
          setQuoteA(quoteAData);
          setQuoteB(quoteBData);

          // Auto-generate analysis if it's the default text
          if (comp && comp.executive_summary === "Detailed analysis comparing coverage options, limits, and pricing between the two insurance proposals.") {
            await runAIAnalysis(comp, quoteAData, quoteBData);
          }
        } catch (error) {
          console.error("Error loading comparison:", error);
        }
        
        setIsLoading(false);
      };

    loadData();
  }, []);

  const handleSaveRecommendation = async (recommendation, summary) => {
    if (!comparison) return;
    
    setIsSaving(true);
    try {
      await QuoteComparison.update(comparison.id, {
        agent_recommendation: recommendation,
        executive_summary: summary
      });
      
      setComparison(prev => ({
        ...prev,
        agent_recommendation: recommendation,
        executive_summary: summary
      }));
    } catch (error) {
      console.error("Error saving recommendation:", error);
    }
    setIsSaving(false);
  };

  const generatePDF = async () => {
    if (!comparison || !quoteA || !quoteB) return;

    setIsGeneratingPDF(true);
    try {
      const pdfPrompt = `
You are a professional document designer. Convert the following summary and markdown content into a polished, well-styled HTML document suitable for a client-facing insurance proposal PDF.

**Client:** ${comparison.client_name}
**Proposal:** ${comparison.comparison_name}

---

${comparison.executive_summary}

---

${comparison.agent_recommendation}

---

Use clean, professional styling. Ensure the markdown table is rendered correctly as an HTML table with borders and proper alignment. Use a professional font like Lato or Arial.
`;

      const pdfContent = await InvokeLLM({
        prompt: pdfPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            html_content: { type: "string" },
            filename: { type: "string" }
          }
        }
      });

      // Create a blob and download
      const blob = new Blob([pdfContent.html_content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${comparison.comparison_name.replace(/[^a-z0-9]/gi, '_')}_comparison.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setIsGeneratingPDF(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (!comparison || !quoteA || !quoteB) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Comparison Not Found</h2>
          <p className="text-slate-600 mb-6">The requested comparison could not be loaded.</p>
          <Link to={createPageUrl("Dashboard")}>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-start gap-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" size="icon" className="rounded-xl mt-1">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                {comparison.comparison_name}
              </h1>
              <p className="text-slate-500 font-medium">Client: {comparison.client_name}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Quote A: {quoteA.insurer_name}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Quote B: {quoteB.insurer_name}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => runAIAnalysis(comparison, quoteA, quoteB)}
              disabled={isGeneratingAnalysis}
              variant="outline"
              className="bg-white"
            >
              {isGeneratingAnalysis ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isGeneratingAnalysis ? "Generating..." : "Regenerate Analysis"}
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>

        {/* Quote Summaries */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <QuoteSummary quote={quoteA} title="Quote A" color="green" />
          <QuoteSummary quote={quoteB} title="Quote B" color="blue" />
        </div>

        {/* Recommendation Editor */}
        <div className="mb-8">
          <RecommendationEditor
            recommendation={comparison.agent_recommendation}
            summary={comparison.executive_summary}
            onSave={handleSaveRecommendation}
            isSaving={isSaving}
          />
        </div>

        {/* Detailed Comparison */}
        <div className="mb-8">
          <AIComparisonDisplay markdownContent={comparison.agent_recommendation} />
        </div>
      </div>
    </div>
  );
}