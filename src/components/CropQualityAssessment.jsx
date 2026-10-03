import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Tag,
  TrendingUp,
  Lightbulb,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { assessCropQualityWithGemini } from '../services/geminiService';

export default function CropQualityAssessment() {
  // Image selection state
  const [selectedImage, setSelectedImage] = useState(null); // base64 / dataUrl
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // AI assessment state
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [assessmentError, setAssessmentError] = useState('');

  // DOM Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera tracks cleanly
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Open live camera stream
  const handleOpenCamera = async () => {
    setCameraError('');
    setAssessmentError('');
    setAssessmentResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('आपल्या डिव्हाइसवर कॅमेरा सुविधा उपलब्ध नाही किंवा परवानगी नाकारली आहे.');
      return;
    }

    try {
      // Prefer rear/environment camera on mobile phones
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(
        'कॅमेरा सुरू करता आला नाही. कृपया ब्राउझर सेटिंग्जमधून कॅमेरा परवानगी तपासा किंवा थेट फोटो अपलोड करा.'
      );
      setIsCameraActive(false);
    }
  };

  // Attach stream once video element mounts
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => console.log('Video play interrupted:', err));
    }
  }, [isCameraActive]);

  // Capture still photo from live video feed
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSelectedImage(dataUrl);

    // Stop camera stream once captured
    stopCameraStream();
    setAssessmentResult(null);
    setAssessmentError('');
  };

  // Handle Photo selection from device gallery
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setAssessmentError('कृपया फक्त इमेज (फोटो) फाईल निवडा.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setAssessmentResult(null);
      setAssessmentError('');
      stopCameraStream();
    };
    reader.readAsDataURL(file);

    // Reset input value so same photo can be re-selected if needed
    e.target.value = '';
  };

  // Change or reset photo
  const handleChangePhoto = () => {
    stopCameraStream();
    setSelectedImage(null);
    setAssessmentResult(null);
    setAssessmentError('');
    setCameraError('');
  };

  // Run Gemini AI Quality & Price assessment
  const handleAssessQuality = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setAssessmentError('');
    setAssessmentResult(null);

    try {
      const result = await assessCropQualityWithGemini(selectedImage);
      setAssessmentResult(result);
    } catch (err) {
      console.error('Gemini assessment error:', err);
      if (err.message === 'MISSING_API_KEY') {
        setAssessmentError('MISSING_API_KEY');
      } else {
        setAssessmentError('AI विश्लेषणामध्ये त्रुटी आली, कृपया पुन्हा प्रयत्न करा.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Grade color helper
  const getGradeBadge = (grade = '') => {
    const lower = grade.toLowerCase();
    if (lower.includes('उत्तम') || lower.includes('a') || lower.includes('प्रथम') || lower.includes('उच्च')) {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-600/20',
        text: 'उत्तम प्रत (Grade A)',
      };
    }
    if (lower.includes('कमी') || lower.includes('c') || lower.includes('तृतीय') || lower.includes('खराब')) {
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-600/20',
        text: 'कमी प्रत (Grade C)',
      };
    }
    return {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      text: grade || 'मध्यम प्रत (Grade B)',
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
      {/* Emerald accent top border */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 w-full" />

      {/* Hidden file input & canvas */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Card Header */}
      <div className="p-6 sm:p-7 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  AI व्हिजन तंत्रज्ञान
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">• सोलापूर APMC दर सुसंगत</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight mt-0.5">
                मालाची गुणवत्ता तपासा (AI Quality Assessment)
              </h2>
            </div>
          </div>

          <div className="text-xs text-gray-500 hidden md:block text-right">
            फोटोवरून स्वयंचलित प्रतवारी, वैशिष्ट्ये व अपेक्षित दर
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Step 1: Input Action Buttons (When no image and camera inactive) */}
        {!selectedImage && !isCameraActive && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Open Camera Button */}
              <button
                type="button"
                onClick={handleOpenCamera}
                className="group p-6 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80 transition-all text-center flex flex-col items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <span className="block text-base font-bold text-gray-900 group-hover:text-emerald-900">
                    कॅमेरा उघडा (Open Camera)
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    शेतातून किंवा बाजारातून पिकाचा थेट फोटो काढा
                  </span>
                </div>
              </button>

              {/* Upload Photo Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-600 bg-gray-50/50 hover:bg-emerald-50/40 transition-all text-center flex flex-col items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-800 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <span className="block text-base font-bold text-gray-900 group-hover:text-emerald-900">
                    फोटो अपलोड करा (Upload Photo)
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    डिव्हाइस गॅलरीमधील अस्तित्वात असलेला फोटो निवडा
                  </span>
                </div>
              </button>
            </div>

            {/* Helper tips */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>टीप:</strong> अचूक प्रतवारीसाठी डाळिंब, कांदा, सोयाबीन, गहू, द्राक्षे किंवा इतर शेतमालाचा स्वच्छ व पुरेसा प्रकाश असलेला फोटो निवडा.
              </span>
            </div>
          </div>
        )}

        {/* Camera Permission or Initialization Error */}
        {cameraError && !selectedImage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-red-800 underline hover:text-red-950"
              >
                त्याऐवजी गॅलरीमधून फोटो अपलोड करा &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Live Camera View */}
        {isCameraActive && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[460px] mx-auto flex items-center justify-center border-2 border-emerald-500 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-white/80 text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-xs">
                  शेतमाल चौकटीत ठेवा
                </span>
              </div>

              {/* Close Camera button */}
              <button
                type="button"
                onClick={stopCameraStream}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white focus:outline-none"
                title="कॅमेरा बंद करा"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Capture Action Bar */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="inline-flex items-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Camera className="w-5 h-5" />
                <span>फोटो काढा (Capture Photo)</span>
              </button>

              <button
                type="button"
                onClick={stopCameraStream}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
              >
                रद्द करा
              </button>
            </div>
          </div>
        )}

        {/* Image Preview & Assessment Trigger */}
        {selectedImage && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Preview image box */}
              <div className="w-full md:w-5/12 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs max-h-[340px] flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="शेतमालाचा फोटो"
                    className="w-full h-full object-cover max-h-[340px]"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    निवडलेला फोटो
                  </div>
                </div>

                {/* Change photo button */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleChangePhoto}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>फोटो बदला (Change Photo)</span>
                  </button>
                </div>
              </div>

              {/* Assessment Action Column */}
              <div className="w-full md:w-7/12 space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Google Gemini व्हिजन विश्लेषण</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    हा फोटो अत्याधुनिक AI मॉडेलकडे पाठवला जाईल आणि सोलापूर APMC च्या ताज्या दरांसह प्रतवारी अहवाल तयार होईल.
                  </p>
                </div>

                {/* Assess Button */}
                {!assessmentResult && !isLoading && (
                  <button
                    type="button"
                    onClick={handleAssessQuality}
                    className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Sparkles className="w-5 h-5 text-emerald-200" />
                    <span>गुणवत्ता व दर तपासा (Assess Quality & Price)</span>
                  </button>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 text-center space-y-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-900">
                        AI द्वारे मालाची पाहणी सुरू आहे, कृपया थांबा...
                      </p>
                      <p className="text-xs text-gray-500">
                        पिकाची प्रतवारी, रंग, आकार आणि सोलापूर APMC चालू बाजारभावाची पडताळणी होत आहे.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error handling */}
                {assessmentError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm space-y-2">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        {assessmentError === 'MISSING_API_KEY' ? (
                          <div className="space-y-1">
                            <span className="font-bold">Gemini API Key आढळली नाही!</span>
                            <p className="text-xs text-red-700">
                              कृपया प्रोजेक्टच्या <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono">.env</code> फाईलमध्ये{' '}
                              <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono">VITE_GEMINI_API_KEY</code> जोडा आणि सर्व्हर पुन्हा सुरू करा.
                            </p>
                          </div>
                        ) : (
                          <span className="font-medium">{assessmentError}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAssessQuality}
                      className="text-xs font-bold text-red-700 hover:text-red-900 underline block"
                    >
                      पुन्हा प्रयत्न करा &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Results UI */}
            {assessmentResult && (
              <div className="pt-4 border-t border-gray-200 space-y-5 animate-in fade-in-50 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-base sm:text-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>AI गुणवत्ता व बाजारभाव विश्लेषण अहवाल</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    सोलापूर APMC विश्लेषण
                  </span>
                </div>

                {/* Results Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Crop Name & Quality Grade */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">१. पिकाचे नाव</span>
                      <Tag className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-950">
                      {assessmentResult.cropName}
                    </h3>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">२. गुणवत्ता प्रत</span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ring-1 ring-inset ${
                          getGradeBadge(assessmentResult.qualityGrade).badge
                        }`}
                      >
                        {assessmentResult.qualityGrade}
                      </span>
                    </div>
                  </div>

                  {/* Estimated APMC Price Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-900">४. अंदाजे चालू सोलापूर APMC दर</span>
                      <TrendingUp className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-900">
                      {assessmentResult.estimatedPrice}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      * हा दर मालाची गुणवत्ता व चालू बाजार आवकेवर आधारित अंदाजे दर आहे.
                    </p>
                  </div>
                </div>

                {/* Key Characteristics & Features */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ३. प्रमुख वैशिष्ट्ये (रंग, आकार, डाग व निरीक्षण)
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {assessmentResult.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Farmer Advice */}
                {assessmentResult.farmerAdvice && (
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300/80 text-emerald-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-900">
                      <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>५. शेतकऱ्यासाठी तज्ज्ञ सल्ला (Farmer Advice)</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-800">
                      {assessmentResult.farmerAdvice}
                    </p>
                  </div>
                )}

                {/* Action to test another sample */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleChangePhoto}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>दुसऱ्या मालाचा फोटो तपासा</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
