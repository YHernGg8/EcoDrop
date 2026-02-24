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
  oilType: 'Vegetable' | 'Animal Fat' | 'Mixed' | 'Unknown';
}

interface ScanError {
  message: string;
  suggestion: string;
}

export default function SmartScan({ onComplete, onBack }: SmartScanProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
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
      if (!apiKey) {
        setError({
          message: "System Configuration Error",
          suggestion: "Gemini API key is missing. Please check your environment variables."
        });
        return;
      }

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
                5. waterContent: "Low", "Medium", or "High" representing the estimated water content.
                6. oilType: "Vegetable", "Animal Fat", "Mixed", or "Unknown" based on the visual characteristics of the oil.`
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
              waterContent: { type: Type.STRING },
              oilType: { type: Type.STRING }
            },
            required: ["grade", "debrisDetected", "reasoning", "purityPercentage", "waterContent", "oilType"]
          }
        }
      });

      if (response.text) {
        const parsedResult = JSON.parse(response.text) as ScanResult;
        
        // Check if AI actually found oil
        if (parsedResult.reasoning.toLowerCase().includes("no oil") || 
            parsedResult.reasoning.toLowerCase().includes("cannot see") ||
            parsedResult.reasoning.toLowerCase().includes("blurry")) {
          setError({
            message: "Analysis Unclear",
            suggestion: "The AI couldn't clearly identify the oil. Please ensure the photo is well-lit and the oil is clearly visible in a transparent container."
          });
          return;
        }

        setResult(parsedResult);
      } else {
        throw new Error("Empty response");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("fetch")) {
        setError({
          message: "Connection Error",
          suggestion: "Please check your internet connection and try again."
        });
      } else {
        setError({
          message: "Analysis Failed",
          suggestion: "Something went wrong during the AI analysis. Please try taking a clearer photo."
        });
      }
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

  const handleScanAgain = () => {
    setImage(null);
    setResult(null);
    setError(null);
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
            
            <motion.button 
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-500 text-black font-bold text-lg py-4 rounded-full flex items-center justify-center gap-2 hover:bg-green-400 transition-all shadow-lg active:shadow-inner"
            >
              <Upload size={24} />
              Take Photo or Upload
            </motion.button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="relative flex-1 rounded-3xl overflow-hidden mt-16 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Scanned Oil" className="w-full h-full object-cover" />
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center overflow-hidden">
                  {/* Scanning Beam Animation */}
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute left-0 right-0 h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-20"
                  />
                  
                  {/* Scanning Grid Overlay */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" 
                    style={{ 
                      backgroundImage: 'linear-gradient(rgba(34,197,94,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.2) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} 
                  />

                  <div className="relative z-30 flex flex-col items-center bg-black/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                    <div className="relative mb-6">
                      <Loader2 size={64} className="text-green-500 animate-spin opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Camera size={32} className="text-green-500" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">EcoDrop Vision AI</h3>
                    <p className="text-green-400 text-sm font-medium animate-pulse mb-6">Analyzing Oil Purity...</p>
                    
                    {/* Simulated Progress Bar */}
                    <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="h-full bg-green-500"
                      />
                    </div>
                    
                    <div className="mt-8">
                      <button 
                        onClick={() => {
                          // A more robust solution would cancel the API request
                          setIsAnalyzing(false);
                          setImage(null);
                          setError(null);
                        }}
                        className="text-white/50 text-xs font-semibold uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {result && !isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white text-gray-900 rounded-t-3xl p-6 pb-24 shadow-2xl absolute bottom-0 left-0 right-0 z-20 max-h-[85vh] overflow-y-auto custom-scrollbar"
                >
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0" />
                  
                  <div className="flex justify-between items-start mb-6">
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
                    <div className="grid grid-cols-3 gap-3">
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
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Oil Type</div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 text-gray-800">
                          <span className="font-bold text-sm text-center leading-tight">{result.oilType}</span>
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

                  <div className="flex items-center gap-3 mt-6">
                    <motion.button 
                      onClick={handleScanAgain}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Scan Again
                    </motion.button>
                    <motion.button 
                      onClick={handleClaimPoints}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex flex-col items-center justify-center shadow-lg shadow-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <span>Earn {result.grade === 'A' ? 50 : result.grade === 'B' ? 30 : 10} Points</span>
                        <ArrowLeft size={18} className="rotate-180" />
                      </div>
                      <span className="text-[10px] font-medium opacity-60 uppercase tracking-wider">Pending Verification</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white text-gray-900 rounded-3xl p-6 shadow-2xl border-t-4 border-red-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="font-bold text-lg">{error.message}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {error.suggestion}
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setError(null);
                      if (image && fileInputRef.current) {
                        // Re-analyze existing image
                        const mimeType = image.split(';')[0].split(':')[1];
                        analyzeImage(image, mimeType);
                      }
                    }}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Retry Analysis
                  </button>
                  <button 
                    onClick={() => {
                      setImage(null);
                      setError(null);
                    }}
                    className="w-full bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Take New Photo
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
