import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Flame, Beef, Wheat, Droplet, Scan, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import AiNavBarFood from './AiNavBarFood';
import { foodHistory } from '../../utils/foodHistory';
import FooterDash from '../../components/Dashboard/FooterDash';

const AiFoodAnalyzer = () => {
  const [searchParams] = useSearchParams();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Load from history if ID in URL
  useEffect(() => {
    const mealId = searchParams.get('id');
    if (mealId) {
      const savedMeal = foodHistory.getMealById(mealId);
      if (savedMeal) {
        setImagePreview(savedMeal.imagePreview);
        setAnalysisResult(savedMeal);
        setShowResults(true);
      }
    }
  }, [searchParams]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file.");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setShowResults(false);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Safe JSON extraction
  const extractJSON = (text) => {
    try {
      // 1. Try direct parse
      return JSON.parse(text);
    } catch (e) {
      // 2. Try to find JSON object structure
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (e2) {
          console.error("Failed to extract JSON:", e2);
        }
      }
      return null;
    }
  };

  // Real analysis using Gemini REST API with Model Discovery
  const handleAnalyze = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
      return;
    }

    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setStatusMessage("Preparing image...");

    try {
      const base64Data = await fileToBase64(image);

      // Step 1: Discover available models, prioritizing Gemini 1.5 Flash
      setStatusMessage("Finding best AI model...");
      console.log("🔍 Discovering available models...");
      
      let targetModel = 'gemini-1.5-flash'; // STRICT DEFAULT as requested
      let apiVersion = 'v1beta'; 
      
      try {
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (listResponse.ok) {
          const listData = await listResponse.json();
          const models = listData.models || [];
          
          // Check if gemini-1.5-flash is strictly available
          const flashModel = models.find(m => m.name.includes('gemini-1.5-flash') && m.supportedGenerationMethods?.includes('generateContent'));
          
          if (flashModel) {
            targetModel = flashModel.name.replace('models/', '');
            console.log(`✅ Gemini 1.5 Flash validated: ${targetModel}`);
          } else {
             console.warn("Gemini 1.5 Flash not explicitly listed in v1beta, falling back to other vision models");
             // Fallback to other vision models only if Flash isn't there
             const visionModel = models.find(m => 
                (m.name.includes('flash') || m.name.includes('pro-vision') || m.name.includes('gemini-1.5')) &&
                m.supportedGenerationMethods?.includes('generateContent')
              );
              if (visionModel) {
                targetModel = visionModel.name.replace('models/', '');
              }
          }
        } else {
           console.log("v1beta list failed, defaulting to gemini-1.5-flash on v1beta blind");
        }
      } catch (e) {
        console.warn("Model discovery failed, using default:", e);
      }

      // Step 2: Call the API with the discovered model
      setStatusMessage(`Analyzing with ${targetModel}...`);
      
      const endpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${targetModel}:generateContent?key=${apiKey}`;
      
      const promptText = `Analyze this food image and provide nutritional information in STRICT JSON format.
      The JSON must have this exact structure:
      {
        "dishName": string,
        "calories": number,
        "protein": number,
        "carbs": number,
        "fats": number,
        "confidence": number,
        "healthTip": string
      }
      Rules:
      - Return ONLY the JSON object.
      - Do NOT include markdown formatting, backticks, or any conversational text.
      - If multiple items are present, estimate totals for the entire plate.
      - Provide a specific, actionable health tip relevant to a gym-goer or fitness enthusiast for this meal.
      - If the image does not contain food, set dishName to "Non-food detected" and all values to 0.`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: promptText },
              {
                inline_data: {
                  mime_type: image.type,
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("API Error Response:", errText);
        throw new Error(`API Error ${response.status}: ${errText}`);
      }

      const responseData = await response.json();
      
      // Step 3: Parse Result
      const candidate = responseData.candidates?.[0];
      if (!candidate) throw new Error("No analysis generated");
      
      const resultText = candidate.content?.parts?.[0]?.text;
      if (!resultText) throw new Error("Empty response from AI");

      const parsedData = extractJSON(resultText);
      if (!parsedData) throw new Error("Failed to parse nutrition data from AI response");

      const finalResult = {
        ...parsedData,
        imagePreview,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      
      setAnalysisResult(finalResult);
      foodHistory.saveMeal(finalResult);
      setShowResults(true);

    } catch (err) {
      console.error("Analysis failed:", err);
      if (err.message.includes("404") || err.message.includes("not found")) {
         setError("The AI model is currently unavailable or the API key has restricted access. Please check your API key.");
      } else if (err.message.includes("API Key")) {
        setError("Invalid API Key configuration.");
      } else {
        setError("Failed to analyze image. Please try again or use a different image.");
      }
    } finally {
      setIsAnalyzing(false);
      setStatusMessage("");
    }
  };

  // Reset to initial state
  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setShowResults(false);
    setIsAnalyzing(false);
    setError(null);
  };

  // Remove current image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setShowResults(false);
    setError(null);
  };

  return (
    <>
      <AiNavBarFood />
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8211] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                AI Food Analyzer
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Analyze your meals and track nutrition effortlessly using Gemini Vision AI
            </p>
          </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Upload Card */}
        {!imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 cursor-pointer hover:border-[#FF8211] hover:bg-orange-50/30 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-[#FF8211]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload a food image
                  </h3>
                  <p className="text-gray-500 mb-1">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    JPG, PNG, WebP supported
                  </p>
                </div>
              </div>
            </label>
          </motion.div>
        )}

        {/* Image Preview & Analyze Button */}
        {imagePreview && !showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 md:h-96 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex gap-4 flex-col sm:flex-row">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-[#FF8211] to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{statusMessage || "Analyzing..."}</span>
                      </>
                    ) : (
                      <>
                        <Scan className="w-5 h-5" />
                        Analyze Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Dish Name & Confidence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {analysisResult?.dishName}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">Confidence:</span>
                    <div className="flex-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisResult?.confidence}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#FF8211] to-orange-500"
                      />
                    </div>
                    <span className="text-sm font-bold text-[#FF8211]">
                      {analysisResult?.confidence}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Analysis
                </button>
              </div>

              {/* Health Tip */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FF8211] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#FF8211] mb-1 uppercase tracking-wide">
                      Health Tip for Gym-Goers
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {analysisResult?.healthTip}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Nutrition Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <NutritionCard
                icon={Flame}
                label="Calories"
                value={analysisResult?.calories}
                unit="kcal"
                delay={0}
                color="from-red-500 to-orange-500"
              />
              <NutritionCard
                icon={Beef}
                label="Protein"
                value={analysisResult?.protein}
                unit="g"
                delay={0.1}
                color="from-blue-500 to-cyan-500"
              />
              <NutritionCard
                icon={Wheat}
                label="Carbs"
                value={analysisResult?.carbs}
                unit="g"
                delay={0.2}
                color="from-amber-500 to-yellow-500"
              />
              <NutritionCard
                icon={Droplet}
                label="Fats"
                value={analysisResult?.fats}
                unit="g"
                delay={0.3}
                color="from-green-500 to-emerald-500"
              />
            </div>
          </motion.div>
        )}
        </div>
      </div>
      <FooterDash />
    </>
  );
};

//Nutrition Card Component
const NutritionCard = ({ icon: Icon, label, value, unit, delay, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer group"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>
      
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <span className="text-lg font-medium text-gray-500">{unit}</span>
      </div>
    </motion.div>
  );
};

export default AiFoodAnalyzer;
