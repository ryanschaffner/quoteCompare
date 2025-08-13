import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

export default function RecommendationEditor({ recommendation, summary, onSave, isSaving }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecommendation, setEditedRecommendation] = useState(recommendation);
  const [editedSummary, setEditedSummary] = useState(summary);

  const handleSave = () => {
    onSave(editedRecommendation, editedSummary);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRecommendation(recommendation);
    setEditedSummary(summary);
    setIsEditing(false);
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-white to-amber-50 border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-500" />
            Agent Recommendation & Summary
          </CardTitle>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Executive Summary</Label>
          {isEditing ? (
            <Textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              placeholder="Provide a high-level overview of both quote options..."
              className="min-h-[100px] border-slate-200 focus:border-amber-500 resize-none"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-white/80 rounded-lg border border-slate-200"
            >
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {summary || "No executive summary provided yet."}
              </p>
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Professional Recommendation</Label>
          {isEditing ? (
            <Textarea
              value={editedRecommendation}
              onChange={(e) => setEditedRecommendation(e.target.value)}
              placeholder="Share your professional recommendation based on the quote comparison..."
              className="min-h-[120px] border-slate-200 focus:border-amber-500 resize-none"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-white/80 rounded-lg border border-slate-200"
            >
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {recommendation || "No recommendation provided yet."}
              </p>
            </motion.div>
          )}
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end gap-3 pt-4 border-t border-slate-200"
          >
            <Button
              onClick={handleCancel}
              variant="outline"
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}