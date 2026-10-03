import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { StepByStepSolution } from '../../types/calculator';
import { Sparkles, Send, Upload, CornerDownLeft, Loader2, CheckCircle2, HelpCircle, FileText } from 'lucide-react';

interface AIAssistantProps {
  onSendToTape: (expr: string, result: string) => void;
  onSendToDisplay: (result: string) => void;
}

const SAMPLE_PROMPTS = [
  'Solve for x: 3x² + 5x - 2 = 0',
  'Find the integral ∫ x · e^x dx',
  'A $120 item is 25% off with 8% tax. What is the final total?',
  'Calculate loan payment for $300,000 at 5.5% over 30 years',
  'Find eigenvalues of matrix [[2, 1], [1, 2]]',
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ onSendToTape, onSendToDisplay }) => {
  const [promptText, setPromptText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<StepByStepSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage({ base64: base64String, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async (queryToUse?: string) => {
    const q = queryToUse || promptText;
    if (!q.trim() && !selectedImage) return;

    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      // Instantiate Gemini SDK
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are OmniCalc AI Math Expert. Solve mathematical expressions, word problems, calculus, physics formulas, matrix algebra, and statistics.
Return a structured JSON response matching this TypeScript schema:
{
  "title": string,
  "overview": string,
  "steps": [
    {
      "stepNumber": number,
      "explanation": string,
      "expression": string,
      "result": string
    }
  ],
  "finalAnswer": string,
  "relatedConcepts": [string]
}
Do NOT include markdown formatting wrappers outside the raw JSON object itself. Just output valid JSON.`;

      const contents: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];
      
      if (selectedImage) {
        contents.push({
          inlineData: {
            data: selectedImage.base64,
            mimeType: selectedImage.mimeType,
          },
        });
      }

      contents.push({
        text: q || 'Solve the math equation shown in the image step by step.',
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      const parsed: StepByStepSolution = JSON.parse(responseText);
      setSolution(parsed);
    } catch (err: unknown) {
      console.error('Gemini API Error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to solve problem. Please check your connection and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-3 max-w-3xl mx-auto">
      {/* Top AI Solver Header */}
      <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI Step-by-Step Math Solver</h3>
            <p className="text-xs text-slate-400">Ask word problems, calculus, physics, or upload an equation photo</p>
          </div>
        </div>
      </div>

      {/* Input Box & Photo Picker */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type your math question or equation... (e.g. 'Solve 2x² + 7x - 15 = 0' or 'Calculate the volume of a sphere with r=5')"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
          />

          {/* Image Upload Preview */}
          {selectedImage && (
            <div className="flex items-center justify-between bg-slate-950/80 border border-cyan-500/40 rounded-lg px-3 py-1.5 mt-2">
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Photo Attached for AI Analysis
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-xs text-rose-400 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Attach Photo</span>
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </label>

          <button
            onClick={() => handleSolve()}
            disabled={loading || (!promptText.trim() && !selectedImage)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-40 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Solving...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Solve with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Prompt Chips */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="text-[11px] font-mono text-slate-500 mb-1.5">Try a sample question:</div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setPromptText(sample);
                  handleSolve(sample);
                }}
                className="px-2.5 py-1 text-[11px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors text-left"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800 rounded-2xl p-4 text-xs font-mono text-rose-300">
          {error}
        </div>
      )}

      {/* Solution Display Cards */}
      {solution && (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
          {/* Solution Header */}
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {solution.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1">{solution.overview}</p>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {solution.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono text-xs"
              >
                <div className="text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                  Step {step.stepNumber}
                </div>
                <p className="text-slate-300 font-sans text-xs">{step.explanation}</p>
                {step.expression && (
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2 rounded-lg text-cyan-200 font-bold overflow-x-auto">
                    {step.expression}
                  </div>
                )}
                {step.result && (
                  <div className="text-right text-slate-400 font-bold text-[11px]">
                    → {step.result}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final Answer Banner */}
          <div className="bg-gradient-to-r from-emerald-950/50 to-cyan-950/50 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                Final Answer
              </div>
              <div className="text-lg font-mono font-bold text-slate-100 mt-0.5">
                {solution.finalAnswer}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSendToDisplay(solution.finalAnswer)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition-colors"
              >
                Use in Calculator
              </button>
              <button
                onClick={() => onSendToTape(promptText || 'AI Query', solution.finalAnswer)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition-colors"
              >
                Save to Tape
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
