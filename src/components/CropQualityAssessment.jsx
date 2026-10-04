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
  Eye,
  Info,
  Gavel,
  Edit3,
  Check,
} from 'lucide-react';
import {
  assessCropQualityWithGemini,
  getFallbackCropAssessment,
} from '../services/geminiService';
import { compressImage } from '../utils/imageCompressor';

export default function CropQualityAssessment({ onListProduce }) {
  // Image selection state
  const [selectedImage, setSelectedImage] = useState(null); // base64 / dataUrl
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // AI assessment state
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [assessmentError, setAssessmentError] = useState('');
  const [showFallbackToast, setShowFallbackToast] = useState(false);

  // Manual adjustment state (Fallback mode or user override)
  const [isManualEditOpen, setIsManualEditOpen] = useState(false);
  const [editableCropName, setEditableCropName] = useState('');
  const [editableGrade, setEditableGrade] = useState('Grade A (उत्तम प्रत)');

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
      setCameraError('आपल्या डिव्हाइसवर कॅमेरा सुविधा उपलब्ध नाही किंवा ब्राउझरने परवानगी नाकारली आहे.');
      return;
    }

    try {
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
      console.error('Camera access error:', err?.message || err);
      setCameraError(
        'कॅमेरा सुरू करता आला नाही. कृपया ब्राउझरमध्ये कॅमेरा परवानगी तपासा किंवा थेट फोटो अपलोड करा.'
      );
      setIsCameraActive(false);
    }
  };

  // Attach stream once video element mounts
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => console.log('Video play interrupted:', err?.message || err));
    }
  }, [isCameraActive]);

  // Capture still photo from live video feed
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Downscale via canvas (max width 600px, quality 0.6)
    const originalWidth = video.videoWidth || 640;
    const originalHeight = video.videoHeight || 480;
    const maxWidth = 600;
    const targetWidth = Math.min(originalWidth, maxWidth);
    const targetHeight = Math.round((originalHeight * targetWidth) / originalWidth);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
    setSelectedImage(dataUrl);

    stopCameraStream();
    setAssessmentResult(null);
    setAssessmentError('');
  };

  // Handle Photo selection from device gallery
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAssessmentError('कृपया फक्त इमेज (फोटो) फाईल निवडा.');
      return;
    }

    try {
      const compressed = await compressImage(file, 600, 0.6);
      setSelectedImage(compressed);
      setAssessmentResult(null);
      setAssessmentError('');
      stopCameraStream();
    } catch (err) {
      console.warn('Assessment file compression fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setAssessmentResult(null);
        setAssessmentError('');
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }

    e.target.value = '';
  };

  // Change or reset photo
  const handleChangePhoto = () => {
    stopCameraStream();
    setSelectedImage(null);
    setAssessmentResult(null);
    setAssessmentError('');
    setCameraError('');
    setShowFallbackToast(false);
    setIsManualEditOpen(false);
  };

  // Run Gemini AI Quality & Price assessment with 100% try-catch and zero-crash fallback
  const handleAssessQuality = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setAssessmentError('');
    setAssessmentResult(null);
    setShowFallbackToast(false);

    try {
      const result = await assessCropQualityWithGemini(selectedImage);
      const finalResult = result || getFallbackCropAssessment();
      setAssessmentResult(finalResult);
      setEditableCropName(finalResult?.cropName || 'सोलापूर शेतमाल');
      setEditableGrade(finalResult?.qualityGrade || finalResult?.grade || 'Grade A');

      if (finalResult?.isFallback) {
        setShowFallbackToast(true);
        setTimeout(() => setShowFallbackToast(false), 6000);
      }
    } catch (err) {
      console.warn('AI Crop Quality Assessment error caught (activating graceful fallback):', err);
      const fallback = getFallbackCropAssessment('AI कोटा संपल्यामुळे किंवा सर्व्हर व्यस्त असल्यामुळे मानक APMC ग्रेडिंग लागू केली आहे.');
      setAssessmentResult(fallback);
      setEditableCropName(fallback.cropName);
      setEditableGrade(fallback.qualityGrade);
      setShowFallbackToast(true);
      setTimeout(() => setShowFallbackToast(false), 6000);
    } finally {
      setIsLoading(false);
    }
  };

  // Grade color helper
  const getGradeBadge = (grade = '') => {
    const lower = (grade || '').toLowerCase();
    if (lower.includes('उत्तम') || lower.includes('a') || lower.includes('प्रथम') || lower.includes('उच्च')) {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-600/20',
        text: 'उत्तम प्रत (Grade A)',
      };
    }
    if (lower.includes('सामान्य') || lower.includes('कमी') || lower.includes('c') || lower.includes('तृतीय')) {
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-600/20',
        text: 'सामान्य प्रत (Grade C)',
      };
    }
    return {
      badge: 'bg-blue-50 text-blue-800 border-blue-200 ring-blue-500/20',
      text: grade || 'मध्यम प्रत (Grade B)',
    };
  };

  const currentCropName = editableCropName || assessmentResult?.cropName || 'सोलापूर शेतमाल';
  const currentGrade = editableGrade || assessmentResult?.qualityGrade || 'Grade A';

  return (
    <div className="relative">
      {/* Non-blocking Toast Warning: "AI सर्व्हर व्यस्त आहे (Fallback Mode सक्रिय)." */}
      {showFallbackToast && (
        <div className="mx-4 mb-2 p-3 bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-xs animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-100 shrink-0" />
            <span>AI सर्व्हर व्यस्त आहे (Fallback Mode सक्रिय). मानक APMC निकष लागू केले आहेत.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowFallbackToast(false)}
            className="p-1 hover:bg-amber-600 rounded text-amber-100 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hidden file input & canvas */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Step 1: Sleek Actionable Scan / Upload Bar (When no image and camera inactive) */}
      {!selectedImage && !isCameraActive && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mx-4 my-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">शेतमाल गुणवत्ता व दर तपासणी</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Gemini Vision
            </span>
          </div>

          {/* Action Grid (Touch target 48px) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleOpenCamera}
              className="h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-100" />
              <span>📷 कॅमेरा उघडा</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>📁 फोटो निवडा</span>
            </button>
          </div>

          <div className="text-center mt-3 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onListProduce && onListProduce({})}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              किंवा मॅन्युअल तपशील भरा &rarr;
            </button>
          </div>
        </div>
      )}

      {(isCameraActive || selectedImage) && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mx-4 my-2 p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">AI गुणवत्ता विश्लेषण कक्ष</span>
            </div>
            <button
              type="button"
              onClick={handleChangePhoto}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              रद्द करा ✕
            </button>
          </div>

        {/* Camera Permission or Initialization Error */}
        {cameraError && !selectedImage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{cameraError}</p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-red-800 underline hover:text-red-950 cursor-pointer"
                >
                  गॅलरीमधून फोटो निवडा &rarr;
                </button>
                {onListProduce && (
                  <button
                    type="button"
                    onClick={() => onListProduce({})}
                    className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                  >
                    फोटोशिवाय मॅन्युअल नोंदणी करा &rarr;
                  </button>
                )}
              </div>
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
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white focus:outline-none cursor-pointer"
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
                className="inline-flex items-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>फोटो काढा (Capture Photo)</span>
              </button>

              <button
                type="button"
                onClick={stopCameraStream}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
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
                    <span>Gemini Flash कृषी व्हिजन मॉडेल</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    शेतमालाच्या फोटोचे सविस्तर विश्लेषण करून सोलापूर APMC संदर्भात अचूक प्रतवारी, रंग-आकार स्थिती, चालू बाजारभाव आणि सल्ला दिला जाईल.
                  </p>
                </div>

                {/* Assess Button */}
                {!assessmentResult && !isLoading && (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleAssessQuality}
                      className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-emerald-200" />
                      <span>गुणवत्ता व दर तपासा (Assess Quality & Price)</span>
                    </button>

                    {onListProduce && (
                      <button
                        type="button"
                        onClick={() =>
                          onListProduce({
                            image: selectedImage,
                            cropName: 'सोलापूर शेतमाल',
                            qualityGrade: 'Grade A',
                          })
                        }
                        className="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                      >
                        AI तपासणी वगळा आणि थेट फॉर्म भरा &rarr;
                      </button>
                    )}
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 text-center space-y-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-900">
                        मालाची तपासणी सुरू आहे, कृपया थांबा...
                      </p>
                      <p className="text-xs text-gray-500">
                        पिकाची प्रतवारी, रंग, आकार आणि सोलापूर APMC चालू बाजारभावाची पडताळणी होत आहे.
                      </p>
                    </div>
                  </div>
                )}

                {/* Optional assessment error if any */}
                {assessmentError && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>{assessmentError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Results UI */}
            {assessmentResult && (
              <div className="pt-4 border-t border-gray-200 space-y-5 animate-in fade-in-50 duration-300">
                {/* Fallback Banner: "AI विश्लेषण तात्पुरते अनुपलब्ध. मॅन्युअल ग्रेडिंग निवडा." */}
                {assessmentResult?.isFallback && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                            AI विश्लेषण तात्पुरते अनुपलब्ध. मॅन्युअल ग्रेडिंग निवडा.
                          </h4>
                          <p className="text-xs text-amber-800 mt-0.5">
                            {assessmentResult?.note || 'AI सर्व्हर व्यस्त असल्यामुळे मानक APMC प्रतवारी (Grade A) लागू केली आहे.'}
                            खाली दिलेले पिकाचे नाव व प्रत आपण हवी तशी बदलू शकता.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsManualEditOpen(!isManualEditOpen)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs hover:bg-amber-100 cursor-pointer shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isManualEditOpen ? 'पूर्ण झाले' : 'बदल करा'}</span>
                      </button>
                    </div>

                    {/* Inline Manual Form Controls */}
                    {isManualEditOpen && (
                      <div className="pt-3 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-amber-900 mb-1">
                            पिकाचे नाव (Crop Name):
                          </label>
                          <input
                            type="text"
                            value={editableCropName}
                            onChange={(e) => setEditableCropName(e.target.value)}
                            placeholder="उदा. सोलापुरी लाल कांदा / डाळिंब"
                            className="w-full text-xs bg-white border border-amber-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-amber-900 mb-1">
                            प्रतवारी निवडा (Grade):
                          </label>
                          <select
                            value={editableGrade}
                            onChange={(e) => setEditableGrade(e.target.value)}
                            className="w-full text-xs bg-white border border-amber-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="Grade A">Grade A (उत्तम प्रत - सुपर)</option>
                            <option value="Grade B">Grade B (मध्यम प्रत - सरासरी)</option>
                            <option value="Grade C">Grade C (सामान्य प्रत - चालू)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-base sm:text-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>
                      {assessmentResult?.isFallback
                        ? 'प्रमाणित सोलापूर APMC प्रतवारी अहवाल'
                        : 'AI गुणवत्ता व बाजारभाव विश्लेषण अहवाल'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    सोलापूर APMC संदर्भ
                  </span>
                </div>

                {/* Results Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Crop Name & Quality Grade */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">पिकाचे नाव (Crop Name)</span>
                      <Tag className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-extrabold text-gray-950">
                        {currentCropName}
                      </h3>
                      {!isManualEditOpen && (
                        <button
                          type="button"
                          onClick={() => setIsManualEditOpen(true)}
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                        >
                          बदला
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">गुणवत्ता प्रत (Quality Grade)</span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ring-1 ring-inset ${
                          getGradeBadge(currentGrade).badge
                        }`}
                      >
                        {currentGrade}
                      </span>
                    </div>

                    {assessmentResult?.moisture && (
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>ओलावा प्रमाण (Moisture):</span>
                        <span className="font-bold text-gray-800">{assessmentResult.moisture}</span>
                      </div>
                    )}
                  </div>

                  {/* Estimated APMC Price Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-900">
                        अंदाजे चालू बाजारभाव (Estimated Market Price)
                      </span>
                      <TrendingUp className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-900">
                      {assessmentResult?.estimatedPrice || assessmentResult?.estimatedPriceRange || '₹२,२०० - ₹२,५०० / क्विंटल'}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      * सोलापूर APMC चालू आवक व दर्जानुसार अपेक्षित भाव (₹/क्विंटल).
                    </p>
                  </div>
                </div>

                {/* Physical Appearance */}
                {assessmentResult?.physicalAppearance && (
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        रंग व आकार स्थिती (Physical Appearance)
                      </span>
                      <Eye className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      {assessmentResult.physicalAppearance}
                    </p>
                  </div>
                )}

                {/* Additional Bullet Points */}
                {Array.isArray(assessmentResult?.bulletPoints) && assessmentResult.bulletPoints.length > 0 && (
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 shadow-xs space-y-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      प्रमुख निरीक्षणे (Key Observations)
                    </span>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {assessmentResult.bulletPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Farmer Advice */}
                {assessmentResult?.farmerAdvice && (
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300/80 text-emerald-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-900">
                      <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>शेतकऱ्यासाठी सल्ला (Actionable Farmer Advice)</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-800">
                      {assessmentResult.farmerAdvice}
                    </p>
                  </div>
                )}

                {/* Bottom Action Bar: List for Bidding + Test Another */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleChangePhoto}
                    className="order-2 sm:order-1 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>दुसऱ्या मालाचा फोटो तपासा</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onListProduce) {
                        onListProduce({
                          cropName: currentCropName,
                          qualityGrade: currentGrade,
                          image: selectedImage,
                          estimatedPrice: assessmentResult?.estimatedPrice || assessmentResult?.estimatedPriceRange,
                          notes: assessmentResult?.note || assessmentResult?.physicalAppearance,
                        });
                      }
                    }}
                    className="order-1 sm:order-2 inline-flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 group cursor-pointer"
                  >
                    <Gavel className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
                    <span>हा माल लिलावासाठी नोंदवा (List This Produce for Bidding)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      )}
    </div>
  );
}

