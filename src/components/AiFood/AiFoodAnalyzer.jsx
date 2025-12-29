import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Flame, Beef, Wheat, Droplet, Scan, X, RefreshCw, AlertCircle, Camera, Image as ImageIcon, Type, Scale, Hash, AlignLeft, ChevronDown, ChevronUp, Aperture } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import OpenAI from 'openai'; // OpenAI SDK
import AiNavBarFood from './AiNavBarFood';
import { foodHistory } from '../../utils/foodHistory';
import FooterDash from '../../components/Dashboard/FooterDash';

const AiFoodAnalyzer = () => {
  const [searchParams] = useSearchParams();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [manualInput, setManualInput] = useState({
    name: '',
    weight: '',
    quantity: '',
    description: ''
  });
  const [isManualExpanded, setIsManualExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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

  // Detect Mobile Device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      // Simple regex for mobile detection
      if (/android|iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkMobile();
  }, []);

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
        if (!showResults) setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (file, previewUrl) => {
    setImage(file);
    setImagePreview(previewUrl);
    setShowWebcam(false);
    if (!showResults) setError(null);
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualInput(prev => ({ ...prev, [name]: value }));
  };

  // Handle Camera Click based on Device
  const handleCameraClick = () => {
    if (isMobile) {
      // Use native camera input
      cameraInputRef.current?.click();
    } else {
      // Use standard webcam modal for desktop
      setShowWebcam(true);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); 
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Real analysis using OpenAI
  const handleAnalyze = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      setError("OpenAI API Key is missing. Please add VITE_OPENAI_API_KEY to your .env file.");
      return;
    }

    if (!image && !manualInput.name && !manualInput.description) {
      setError("Please upload an image or enter food details.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setStatusMessage("Analyzing...");

    try {
      let base64DataUrl = null;
      if (image) {
        setStatusMessage("Processing image...");
        base64DataUrl = await fileToBase64(image);
      }

      const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true 
      });

      // Construct Prompt based on inputs
      let userContext = "";
      if (manualInput.name) userContext += `User identifying the food as: "${manualInput.name}". `;
      if (manualInput.weight) userContext += `User estimated weight/amount: "${manualInput.weight}". `;
      if (manualInput.quantity) userContext += `User quantity count: "${manualInput.quantity}". `;
      if (manualInput.description) userContext += `Additional context: "${manualInput.description}". `;
      
      const promptText = `Analyze the provided food input (Image and/or Text) and return the nutritional analysis in STRICT JSON FORMAT.
      
${userContext ? `USER INPUT CONTEXT (PRIORITIZE THIS): ${userContext}` : ""}

The response object must strictly follow this schema:
{
  "dishName": "string",
  "estimatedWeight": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "confidence": number,
  "cookingMethod": "string",
  "healthTip": "string"
}

PRIORITY LOGIC:
1. If an image is provided, use it as the primary source for visual identification.
2. If text details are provided (Name, Weight, etc.), use them to REFINE the analysis (e.g., if user says "Diet Coke", don't analyze as "Coke").
3. If NO image is provided, rely entirely on the text input.

FOOD DETECTION:
Identify all visible food components.
If the input describes non-food, return "dishName": "Non-food detected" and all zeros.

PORTION & WEIGHT ESTIMATION:
Estimate portion size using visible references or user input.
estimatedWeight must be a readable string (e.g., "~420g").

HIDDEN CALORIES:
Include calories from oils, sauces, etc.

FITNESS CONTEXT:
healthTip MUST be practical and gym-focused.
Classify as "Pre-workout", "Post-workout", or "Cutting".

ACCURACY:
Protein and calories are critical.
confidence between 0 and 100.
`;

      const messages = [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
          ],
        },
      ];

      if (base64DataUrl) {
        messages[0].content.push({
          type: "image_url",
          image_url: {
            url: base64DataUrl,
          },
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("Empty response from AI");

      const parsedData = JSON.parse(content);
      
      const finalResult = {
        ...parsedData,
        imagePreview: image ? imagePreview : null, // Store null if no image
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      
      setAnalysisResult(finalResult);
      foodHistory.saveMeal(finalResult);
      setShowResults(true);

    } catch (err) {
      console.error("Analysis failed:", err);
      if (err.message.includes("401")) {
         setError("Invalid API Key. Please check your configuration.");
      } else {
         setError("Failed to analyze. Please try again.");
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
    setManualInput({ name: '', weight: '', quantity: '', description: '' });
    setShowResults(false);
    setIsAnalyzing(false);
    setError(null);
  };

  // Remove current image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (!showResults) setError(null);
  };

  const hasInput = image || manualInput.name || manualInput.description;

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
              Analyze your meals via Photo, Text, or Both using Gemini Vision AI
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

        {/* Wrapper for Inputs & Preview */}
        {!showResults && (
           <div className="space-y-8">
              
              {/* 1. Image Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Camera Option */}
                {/* Always render hidden input for Mobile capability */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleCameraClick}
                   className={`relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-300 border-2 ${imagePreview ? 'border-gray-100 bg-gray-50 opacity-50' : 'border-[#FF8211]/30 bg-orange-50/50 hover:bg-orange-100/50 hover:border-[#FF8211]'}`}
                >
                   <div className="flex flex-col items-center text-center relative z-10">
                      <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                        <Camera className="w-8 h-8 text-[#FF8211]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Take Photo</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {isMobile ? "Use your camera" : "Use webcam"}
                      </p>
                   </div>
                </motion.div>

                {/* Upload Option */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => fileInputRef.current?.click()}
                   className={`relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-300 border-2 ${imagePreview ? 'border-gray-100 bg-gray-50 opacity-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                   <div className="flex flex-col items-center text-center relative z-10">
                      <div className="w-16 h-16 bg-gray-100 rounded-full shadow-inner flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Upload Image</h3>
                      <p className="text-sm text-gray-500 mt-1">From gallery</p>
                   </div>
                </motion.div>
              </div>

               {/* Image Preview Area */}
               <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-black"
                  >
                    <img 
                      src={imagePreview} 
                      alt="Selected" 
                      className="w-full h-64 md:h-80 object-cover opacity-90"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-20"
                    >
                      <X className="w-5 h-5 text-gray-800" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Image selected
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 2. Manual Input Section */}
              <motion.div 
                layout
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div 
                  onClick={() => setIsManualExpanded(!isManualExpanded)}
                  className="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                         <Type className="w-5 h-5 text-[#FF8211]" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">More Details (Optional)</h3>
                        <p className="text-xs text-gray-500">Add name, weight, or description manually</p>
                      </div>
                   </div>
                   {isManualExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>

                <AnimatePresence>
                  {isManualExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 pt-2 border-t border-gray-100"
                    >
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name */}
                          <div className="space-y-1">
                             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Food Name</label>
                             <div className="relative">
                               <Type className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                               <input 
                                  type="text"
                                  name="name"
                                  value={manualInput.name}
                                  onChange={handleManualInputChange}
                                  placeholder="e.g., Grilled Chicken Salad"
                                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] outline-none transition-all placeholder:text-gray-400 text-gray-800"
                               />
                             </div>
                          </div>

                          {/* Weight & Quantity Row */}
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Weight</label>
                                <div className="relative">
                                  <Scale className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                  <input 
                                      type="text"
                                      name="weight"
                                      value={manualInput.weight}
                                      onChange={handleManualInputChange}
                                      placeholder="e.g. 200g"
                                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] outline-none transition-all placeholder:text-gray-400 text-gray-800"
                                  />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Quantity</label>
                                <div className="relative">
                                  <Hash className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                  <input 
                                      type="text"
                                      name="quantity"
                                      value={manualInput.quantity}
                                      onChange={handleManualInputChange}
                                      placeholder="e.g. 1 bowl"
                                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] outline-none transition-all placeholder:text-gray-400 text-gray-800"
                                  />
                                </div>
                             </div>
                          </div>

                          {/* Description - Full Width */}
                          <div className="md:col-span-2 space-y-1">
                             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Description / Ingredients</label>
                             <div className="relative">
                               <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                               <input 
                                  type="text"
                                  name="description"
                                  value={manualInput.description}
                                  onChange={handleManualInputChange}
                                  placeholder="e.g. Contains avocado, no dressing, extra spicy"
                                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8211]/20 focus:border-[#FF8211] outline-none transition-all placeholder:text-gray-400 text-gray-800"
                               />
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Button */}
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !hasInput}
                  className="w-full bg-gradient-to-r from-[#FF8211] to-orange-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>{statusMessage || "Analyzing..."}</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-6 h-6" />
                      {image ? "Analyze Image & Details" : "Analyze Text Details"}
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-400 mt-3">
                  {image ? "Your photo takes priority" : "Enter details or upload a photo"}
                </p>
              </motion.div>

           </div>
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
            
            {/* Show Image used if available */}
             {imagePreview && (
                <div className="mt-8 opacity-50 text-center">
                    <p className="text-sm text-gray-400">Analysis based on uploaded image</p>
                </div>
             )}

          </motion.div>
        )}
        </div>

        {/* Webcam Modal */}
        <AnimatePresence>
          {showWebcam && (
            <WebcamModal 
              onClose={() => setShowWebcam(false)} 
              onCapture={handleCapture} 
            />
          )}
        </AnimatePresence>

      </div>
      <FooterDash />
    </>
  );
};

// Internal Webcam Modal Component
const WebcamModal = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let currentStream = null;
    const startCamera = async () => {
      try {
        const constraints = { 
          video: { 
            facingMode: 'user', // Default to user (selfie) for laptops
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Camera access denied. Please check your permissions.");
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // Mirror the context so the capture matches the preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
         if (blob) {
            // Create a File object
            const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
            const previewUrl = canvas.toDataURL("image/jpeg");
            onCapture(file, previewUrl);
         }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        
        {/* Close Button */}
        <button 
           onClick={onClose}
           className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
           <X className="w-5 h-5" />
        </button>

        {/* Video Feed */}
        <div className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
           {error ? (
              <div className="text-center p-8">
                 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                 <p className="text-red-400 font-medium">{error}</p>
                 <button onClick={onClose} className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Close</button>
              </div>
           ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]" 
              />
           )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-900 flex items-center justify-center gap-6">
           {!error && (
             <button
               onClick={capturePhoto}
               className="w-20 h-20 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
             >
                <div className="w-16 h-16 bg-[#FF8211] rounded-full flex items-center justify-center">
                   <Aperture className="w-8 h-8 text-white" />
                </div>
             </button>
           )}
        </div>
      </div>
    </motion.div>
  );
};

//Nutrition Card Component (Unchanged)
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
