'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle2, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

interface SmartScanProps {
  onComplete: (points: number) => void;
  onBack: () => void;
}

interface ScanResult {
  grade: 'A' | 'B' | 'C';
  debrisDetected: boolean;
  reasoning: string;
  purityPercentage: number;
  waterContent: 'Low' | 'Medium' | 'High';
}

export default function SmartScan({ onComplete, onBack }: SmartScanProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      analyzeImage(reader.result as string, file.type);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string, mimeType: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is missing.");

      const ai = new GoogleGenAI({ apiKey });
      
      // Extract base64 data without the data:image/... prefix
      const base64Data = base64Image.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            parts: [
              { 
                text: `You are an AI trained to analyze Used Cooking Oil (UCO) for recycling based on Malaysian standards.
                Analyze this image and provide:
                1. grade: "A" (Premium UCO: Light color, clear, minimal food particles/water), "B" (Standard UCO: Brownish, some food particles, typical household use), or "C" (Low-grade UCO: Dark brown/black, thick, high debris, high water content).
                2. debrisDetected: true or false (if there are significant food particles).
                3. reasoning: A short 1-sentence explanation of why you gave this grade.
                4. purityPercentage: A number from 0 to 100 representing the estimated purity of the oil.
                5. waterContent: "Low", "Medium", or "High" representing the estimated water content.` 
              },
              { 
                inlineData: { 
                  mimeType: mimeType, 
                  data: base64Data 
                } 
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              grade: { type: Type.STRING, description: "A, B, or C" },
              debrisDetected: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING },
              purityPercentage: { type: Type.NUMBER },
              waterContent: { type: Type.STRING }
            },
            required: ["grade", "debrisDetected", "reasoning", "purityPercentage", "waterContent"]
          }
        }
      });

      if (response.text) {
        const parsedResult = JSON.parse(response.text) as ScanResult;
        setResult(parsedResult);
      } else {
        throw new Error("No response from AI.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClaimPoints = () => {
    if (!result) return;
    // Award points based on grade
    const pointsMap = { 'A': 50, 'B': 30, 'C': 10 };
    onComplete(pointsMap[result.grade]);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onBack} className="p-2 bg-white/20 rounded-full backdrop-blur-md">
          <ArrowLeft size={24} />
        </button>
        <div className="font-semibold tracking-wide">AI SMART SCAN</div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6">
        {!image ? (
          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            <div className="w-64 h-64 border-2 border-dashed border-green-500/50 rounded-3xl flex flex-col items-center justify-center bg-green-500/10 text-green-400 p-6 text-center">
              <Camera size={48} className="mb-4 opacity-80" />
              <p className="font-medium">Position your oil container in frame</p>
              <p className="text-xs opacity-70 mt-2">Ensure good lighting for accurate grading</p>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-green-500 text-black font-bold text-lg py-4 rounded-full flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
            >
              <Upload size={24} />
              Take Photo or Upload
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="relative flex-1 rounded-3xl overflow-hidden mt-16 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Scanned Oil" className="w-full h-full object-cover" />
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 size={48} className="text-green-500 animate-spin mb-4" />
                  <p className="text-lg font-medium animate-pulse">Analyzing Purity...</p>
                </div>
              )}
            </div>

            <AnimatePresence>
              {result && !isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white text-gray-900 rounded-3xl p-6 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Analysis Complete</h3>
                      <p className="text-sm text-gray-500">EcoDrop Vision AI</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                      result.grade === 'A' ? 'bg-green-100 text-green-600' : 
                      result.grade === 'B' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {result.grade}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Grade Banner */}
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
                      result.grade === 'A' ? 'bg-green-50 border-green-200' : 
                      result.grade === 'B' ? 'bg-yellow-50 border-yellow-200' : 
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl font-black shrink-0 ${
                        result.grade === 'A' ? 'bg-green-100 text-green-600' : 
                        result.grade === 'B' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-red-100 text-red-600'
                      }`}>
                        {result.grade}
                      </div>
                      <div>
                        <h4 className={`font-bold text-lg ${
                          result.grade === 'A' ? 'text-green-800' : 
                          result.grade === 'B' ? 'text-yellow-800' : 
                          'text-red-800'
                        }`}>
                          {result.grade === 'A' ? 'Premium UCO' : result.grade === 'B' ? 'Standard UCO' : 'Low-grade UCO'}
                        </h4>
                        <p className={`text-sm leading-tight mt-1 ${
                          result.grade === 'A' ? 'text-green-700' : 
                          result.grade === 'B' ? 'text-yellow-700' : 
                          'text-red-700'
                        }`}>
                          {result.reasoning}
                        </p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Purity</div>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200" />
                            <circle 
                              cx="32" cy="32" r="28" 
                              stroke="currentColor" 
                              strokeWidth="6" 
                              fill="transparent" 
                              strokeDasharray="175.9" 
                              strokeDashoffset={175.9 - (175.9 * result.purityPercentage) / 100}
                              className={result.purityPercentage >= 80 ? 'text-green-500' : result.purityPercentage >= 50 ? 'text-yellow-500' : 'text-red-500'} 
                            />
                          </svg>
                          <span className="font-bold text-lg text-gray-900 relative z-10">{result.purityPercentage}%</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Water</div>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                          result.waterContent === 'Low' ? 'border-green-100 bg-green-50 text-green-600' :
                          result.waterContent === 'Medium' ? 'border-yellow-100 bg-yellow-50 text-yellow-600' :
                          'border-red-100 bg-red-50 text-red-600'
                        }`}>
                          <span className="font-bold text-sm uppercase tracking-wide">{result.waterContent}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Warnings */}
                    {result.debrisDetected && (
                      <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                        <AlertTriangle size={20} className="text-orange-500 mt-0.5 shrink-0" />
                        <div>
                          <h5 className="font-semibold text-orange-800 text-sm">Debris Detected</h5>
                          <p className="text-xs text-orange-700 mt-1 leading-relaxed">Please filter your oil next time to achieve a higher grade and earn more points.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleClaimPoints}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                  >
                    <span>Claim {result.grade === 'A' ? 50 : result.grade === 'B' ? 30 : 10} Points</span>
                    <ArrowLeft size={18} className="rotate-180" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && !isAnalyzing && (
              <div className="bg-red-500 text-white p-4 rounded-2xl mb-6">
                <p className="font-medium">{error}</p>
                <button 
                  onClick={() => setImage(null)}
                  className="mt-2 text-sm underline"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
