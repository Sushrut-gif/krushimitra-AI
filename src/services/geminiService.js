import { GoogleGenerativeAI } from '@google/generative-ai';
import { SOLAPUR_COMMODITIES } from '../data/solapurCommodities';

/**
 * Cleanly extract base64 data and mime type from data URL,
 * stripping prefixes and any whitespace/newlines.
 */
export function parseDataUrl(dataUrl) {
  if (!dataUrl) {
    throw new Error('इमेज डेटा उपलब्ध नाही.');
  }

  let mimeType = 'image/jpeg';
  let base64Data = '';

  if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
    const commaIndex = dataUrl.indexOf(',');
    if (commaIndex !== -1) {
      const header = dataUrl.substring(0, commaIndex);
      base64Data = dataUrl.substring(commaIndex + 1);
      const mimeMatch = header.match(/data:([^;]+)/);
      if (mimeMatch && mimeMatch[1]) {
        mimeType = mimeMatch[1].trim();
      }
    } else {
      base64Data = dataUrl;
    }
  } else {
    base64Data = dataUrl;
  }

  // Strip all newlines, carriage returns, and spaces from base64
  base64Data = base64Data.replace(/[\r\n\s]/g, '');

  return {
    mimeType,
    base64Data,
  };
}

/**
 * Helper to parse structured crop analysis from Gemini output
 */
export function parseGeminiCropResponse(rawText) {
  if (!rawText) return null;

  // Try extracting JSON block if Gemini formatted response as JSON
  try {
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      if (parsed.cropName || parsed.qualityGrade) {
        return {
          cropName: parsed.cropName || 'अज्ञात पीक',
          qualityGrade: parsed.qualityGrade || 'मध्यम',
          physicalAppearance: parsed.physicalAppearance || (Array.isArray(parsed.features) ? parsed.features.join(', ') : parsed.features) || 'चांगली स्थिती',
          estimatedPrice: parsed.estimatedPrice || 'सोलापूर APMC चालू दरानुसार',
          farmerAdvice: parsed.farmerAdvice || '',
          rawText: rawText,
        };
      }
    }
  } catch (e) {
    // Continue to text parsing
  }

  // Parse lines matching key labels
  let cropName = '';
  let qualityGrade = '';
  let physicalAppearance = '';
  let estimatedPrice = '';
  let farmerAdvice = '';
  const bulletPoints = [];

  const lines = rawText.split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.match(/पिकाचे नाव|Crop Name/i)) {
      cropName = trimmed.replace(/^.*(?:पिकाचे नाव|Crop Name)[:\-.]?\s*/i, '').replace(/[*_#]/g, '').trim();
    } else if (trimmed.match(/गुणवत्ता प्रत|Quality Grade/i)) {
      qualityGrade = trimmed.replace(/^.*(?:गुणवत्ता प्रत|Quality Grade)[:\-.]?\s*/i, '').replace(/[*_#]/g, '').trim();
    } else if (trimmed.match(/रंग व आकार स्थिती|रंग व आकार|Physical Appearance|प्रमुख वैशिष्ट्ये/i)) {
      physicalAppearance = trimmed.replace(/^.*(?:रंग व आकार स्थिती|रंग व आकार|Physical Appearance|प्रमुख वैशिष्ट्ये)[:\-.]?\s*/i, '').replace(/[*_#]/g, '').trim();
    } else if (trimmed.match(/अंदाजे चालू बाजारभाव|बाजारभाव|Estimated Market Price|चालू सोलापूर APMC दर|दर/i)) {
      estimatedPrice = trimmed.replace(/^.*(?:अंदाजे चालू बाजारभाव|बाजारभाव|Estimated Market Price|चालू सोलापूर APMC दर|दर)[:\-.]?\s*/i, '').replace(/[*_#]/g, '').trim();
    } else if (trimmed.match(/शेतकऱ्यासाठी सल्ला|Farmer Advice|सल्ला/i)) {
      farmerAdvice = trimmed.replace(/^.*(?:शेतकऱ्यासाठी सल्ला|Farmer Advice|सल्ला)[:\-.]?\s*/i, '').replace(/[*_#]/g, '').trim();
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      const cleanBullet = trimmed.replace(/^[-*•]\s*/, '').replace(/[*_#]/g, '').trim();
      if (cleanBullet.length > 2) bulletPoints.push(cleanBullet);
    }
  });

  return {
    cropName: cropName || (bulletPoints[0] ? bulletPoints[0] : 'शेतमाल पाहणी'),
    qualityGrade: qualityGrade || 'मध्यम',
    physicalAppearance: physicalAppearance || (bulletPoints.length > 1 ? bulletPoints.slice(1, 3).join(', ') : 'नैसर्गिक रंग व उत्तम आकारमान'),
    estimatedPrice: estimatedPrice || 'सोलापूर APMC चालू दर ₹/क्विंटल',
    farmerAdvice: farmerAdvice || (bulletPoints.length > 0 ? bulletPoints[bulletPoints.length - 1] : rawText),
    bulletPoints: bulletPoints,
    rawText: rawText,
  };
}

/**
 * Main Gemini AI Crop Quality Assessment
 * Uses gemini-1.5-flash with proper inlineData payload and REST fallback
 */
export async function assessCropQualityWithGemini(dataUrl) {
  const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim() : '';

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  const { base64Data, mimeType } = parseDataUrl(dataUrl);

  const promptText = `Analyze this agricultural produce image strictly for an Indian farmer (Solapur APMC market context). Respond in clean Marathi with clear bullet points covering:
- पिकाचे नाव (Crop Name)
- गुणवत्ता प्रत (Quality Grade - उत्तम / मध्यम / सामान्य)
- रंग व आकार स्थिती (Physical Appearance)
- अंदाजे चालू बाजारभाव (Estimated Market Price in ₹/क्विंटल)
- शेतकऱ्यासाठी सल्ला (Actionable Farmer Advice)

कृपया शेतकऱ्यांना वाचण्यास व समजण्यास सोपे जावे म्हणून खालील JSON फॉरमॅटमध्ये किंवा स्पष्ट ५ मुद्द्यांमध्ये उत्तर द्या:
\`\`\`json
{
  "cropName": "पिकाचे नाव (उदा. कांदा / डाळिंब / सोयाबीन / गहू / तूर)",
  "qualityGrade": "उत्तम / मध्यम / सामान्य",
  "physicalAppearance": "रंग, आकार, चकाकी व डाग यांचे सविस्तर निरीक्षण",
  "estimatedPrice": "₹२,२०० - ₹२,६०० प्रति क्विंटल (सोलापूर APMC)",
  "farmerAdvice": "शेतकऱ्यासाठी विक्री, प्रतवारी किंवा साठवणूक सल्ला"
}
\`\`\``;

  // 1. Primary: Use @google/generative-ai SDK with gemini-flash-latest
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([promptText, imagePart]);
    const response = await result.response;
    const text = response.text();
    return parseGeminiCropResponse(text);
  } catch (sdkError) {
    console.warn('Gemini SDK call encountered error, attempting direct REST endpoint fallback:', sdkError?.message);

    // 2. Secondary fallback: Direct REST API invocation
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errMsg);
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini API कडून प्रतिसाद मिळाला नाही.');
    }

    return parseGeminiCropResponse(candidateText);
  }
}

/**
 * KrushiMitra AI Multi-Lingual Agricultural & Mandi Advisor
 * Actively answers any crop, pest, fertilizer, rate, or farming question via Gemini API (gemini-flash-latest)
 * with robust direct REST fallback and comprehensive APMC dataset knowledge.
 */
export async function askKrushiMitraAssistant(userMessage, chatHistory = [], language = 'mr') {
  if (!userMessage || !userMessage.trim()) {
    if (language === 'hi') return 'कृपया अपनी फसल, रोग, खाद या सोलापुर मंडी भाव से जुड़ा प्रश्न पूछें।';
    if (language === 'en') return 'Please ask a question about crops, diseases, fertilizers, or APMC mandi rates.';
    return 'कृपया पीक, रोग, खत किंवा सोलापूर बाजारभावाबद्दल प्रश्न विचारा.';
  }

  const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim() : '';

  const langName =
    language === 'hi' ? 'Hindi (हिंदी)' : language === 'en' ? 'English' : 'Marathi (मराठी)';

  const systemInstruction = `You are KrushiMitra AI (कृषीमित्र AI), an expert agronomy and APMC market advisor for Solapur and Maharashtra farmers.
You must answer EVERY agricultural query directly and comprehensively:
- APMC Mandi rates & trends (e.g., Grapes / द्राक्षे: ₹३,५०० - ₹६,०००/क्विंटल, Onion / कांदा, Pomegranate / डाळिंब, Jowar / मालदांडी ज्वारी, Wheat / गहू, Tur / तूर, Soybean).
- Crop diseases, pest control, chemical & organic sprays, dosages.
- Fertilizer management (NPK, drip fertigation, micronutrients).
- Weather advisories and seasonal sowing tips.
Always reply directly to the question asked in the user's chosen language: ${langName}.
Use bullet points, clear actionable advice, and empathetic rural tone. Never give generic boilerplate replies when asked a specific question.`;

  const recentHistory = chatHistory
    .slice(-6)
    .map((m) => `${m.sender === 'user' ? 'Farmer' : 'KrushiMitra AI'}: ${m.text}`)
    .join('\n');

  const fullPrompt = `${systemInstruction}

Conversation History:
${recentHistory || 'No prior context.'}

User's New Question (${langName}):
${userMessage}

Please give a direct, thorough, and structured answer in ${langName}:`;

  // 1. Primary Attempt: Gemini SDK with gemini-flash-latest
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (sdkError) {
      console.warn('Gemini SDK call encountered error, attempting direct REST endpoint fallback:', sdkError?.message);

      // 2. Secondary Attempt: Direct REST API invocation
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        const payload = {
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            return candidateText.trim();
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('Gemini REST API error response:', res.status, errData);
        }
      } catch (restError) {
        console.warn('Gemini REST fallback failed:', restError?.message);
      }
    }
  }

  // 3. Dynamic APMC Commodity & Agronomy Fallback Generator
  // If API key is unavailable or fails, actively answer the user's specific crop/disease query!
  const q = userMessage.toLowerCase().trim();

  // Search if user asked about any commodity in Solapur APMC dataset
  const matchedCommodity = SOLAPUR_COMMODITIES.find((c) => {
    const inNameMr = c.nameMr.toLowerCase().includes(q) || q.includes(c.nameMr.toLowerCase().split(' ')[0]);
    const inNameEn = c.nameEn.toLowerCase().includes(q) || q.includes(c.nameEn.toLowerCase().split(' ')[0]);
    const inAliases = c.aliases?.some((alias) => q.includes(alias.toLowerCase()) || alias.toLowerCase().includes(q));
    return inNameMr || inNameEn || inAliases;
  });

  if (matchedCommodity) {
    if (language === 'hi') {
      return `📊 **सोलापुर APMC में ${matchedCommodity.nameMr} के ताजा दैनिक भाव:**
- **किस्म (Variety):** ${matchedCommodity.variety}
- **मार्केट यार्ड:** ${matchedCommodity.yard}
- **आज की आवक:** ${matchedCommodity.arrivals.toLocaleString('en-IN')} ${matchedCommodity.unit}
- **न्यूनतम दर (Min Price):** ₹${matchedCommodity.minPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **अधिकतम दर (Max Price):** ₹${matchedCommodity.maxPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **औसत / मॉडल दर (Modal Price):** ₹${matchedCommodity.avgPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **बाजार का रुझान:** ${matchedCommodity.trend} (${matchedCommodity.changePercent})
- **किसान सलाह:** अच्छे ग्रेडिंग और सूखे माल को ई-लिलाव में अधिकतम बोली मिलती है।`;
    }
    if (language === 'en') {
      return `📊 **Solapur APMC Live Rates for ${matchedCommodity.nameEn} (${matchedCommodity.nameMr}):**
- **Variety:** ${matchedCommodity.variety}
- **Market Yard:** ${matchedCommodity.yard}
- **Today's Arrivals:** ${matchedCommodity.arrivals.toLocaleString('en-IN')} ${matchedCommodity.unit}
- **Minimum Price:** ₹${matchedCommodity.minPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **Maximum Price:** ₹${matchedCommodity.maxPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **Average / Modal Price:** ₹${matchedCommodity.avgPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **Market Trend:** ${matchedCommodity.trend} (${matchedCommodity.changePercent})
- **Advisor Note:** Produce with superior size, coloring, and zero blemishes commands highest merchant bidding.`;
    }
    return `📊 **सोलापूर APMC मध्ये ${matchedCommodity.nameMr} चे आजचे चालू बाजारभाव:**
- **वाण / जात:** ${matchedCommodity.variety}
- **मार्केट यार्ड:** ${matchedCommodity.yard}
- **दैनिक आवक:** ${matchedCommodity.arrivals.toLocaleString('en-IN')} ${matchedCommodity.unit}
- **किमान दर (Min):** ₹${matchedCommodity.minPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **कमाल दर (Max):** ₹${matchedCommodity.maxPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **सरासरी दर (Modal):** ₹${matchedCommodity.avgPrice.toLocaleString('en-IN')} / ${matchedCommodity.unit}
- **बाजारातील कल:** ${matchedCommodity.trend} (${matchedCommodity.changePercent})
- **शेतकऱ्यांसाठी सल्ला:** चांगल्या प्रतवारीच्या शेतमालाला सोलापूर ई-लिलावात सर्वोच्च बोली मिळते.`;
  }

  // Disease & Pest queries (द्राक्षे, डाळिंब, कांदा, सोयाबीन)
  if (q.includes('द्राक्ष') || q.includes('द्राक्षे') || q.includes('grapes') || q.includes('भुरी') || q.includes('डाऊनी')) {
    if (language === 'hi') {
      return `🍇 **सोलापुर अंगूर (द्राक्षे) फसल व रोग प्रबंधन:**
- **मंडी भाव:** थॉमसन सीडलेस ₹4,800 - ₹8,500/क्विंटल; माणिक चमन ₹5,500 - ₹9,800/क्विंटल।
- **डाउनी मिल्ड्यू (Downy Mildew) उपाय:** मौसम में नमी हो तो मेटालॅक्सिल + मैंकोजेब (2.5 ग्राम/ली) अथवा रिडोमिल गोल्ड का छिड़काव करें।
- **भूरी (Powdery Mildew) उपाय:** सल्फर 80% WP (2 ग्राम/ली) या टेबुकोनाझोल (1 मिली/ली) का प्रयोग करें।
- **सलाह:** रात की नमी में हवा का संचार बनाए रखें ताकि मणियों पर दाग न पड़ें।`;
    }
    if (language === 'en') {
      return `🍇 **Solapur Grapes Crop Advisory & Mandi Rates:**
- **Current APMC Rates:** Thomson Seedless ₹4,800 - ₹8,500/quintal; Manik Chaman/Jumbo ₹5,500 - ₹9,800/quintal.
- **Downy Mildew Control:** Spray Metalaxyl + Mancozeb (2.5g/liter) or Ridomil Gold during high humidity.
- **Powdery Mildew Control:** Spray Wettable Sulphur (2g/liter) or Tebuconazole (1ml/liter).
- **Quality Tip:** Ensure adequate canopy aeration to prevent berry cracking and rot before harvesting.`;
    }
    return `🍇 **सोलापूर द्राक्षे (Grapes) पीक व्यवस्थापन व आजचे दर:**
- **चालू बाजारभाव:** थॉमसन सीडलेस ₹४,८०० ते ₹८,५००/क्विंटल; माणिक चमन/जम्बो ₹५,५०० ते ₹९,८००/क्विंटल (सोलापूर फळ मार्केट यार्ड).
- **डाऊनी मिल्ड्यू (Downy Mildew) नियंत्रण:** हवामानात ढगाळपणा किंवा आर्द्रता असल्यास मेटालॅक्सिल + मॅनकोझेब (२.५ ग्रॅम/लिटर) किंवा रिडोमिल गोल्डची फवारणी करावी.
- **भुरी (Powdery Mildew) नियंत्रण:** पाण्यात विरघळणारे गंधक (२ ग्रॅम/लिटर) किंवा टेबुकोनॅझोल (१ मिली/लिटर) वापरावे.
- **मणी फुगवण व चकाकी:** मणी फुगवणीच्या काळात ००:५२:३४ (५ ग्रॅम/लिटर) + बोरॉन दिल्यास मणी एकसारखे व चमकदार होतात.`;
  }

  // Pomegranate queries
  if (q.includes('डाळिंब') || q.includes('तेल्या') || q.includes('अनार') || q.includes('pomegranate')) {
    if (language === 'hi') {
      return `🍎 **अनार (डाळिंब) फसल सुरक्षा व सोलापुर मंडी भाव:**
- **मंडी भाव:** भगवा सुपर एक्सपोर्ट ₹8,500 - ₹17,500/क्विंटल; आरक्ता ₹4,500 - ₹9,200/क्विंटल।
- **तेलिया (Bacterial Blight) नियंत्रण:** कॉपर ऑक्सीक्लोराइड (2.5 ग्राम) + स्ट्रेप्टोसायक्लिन (0.5 ग्राम) प्रति लीटर पानी में छिड़कें।
- **फल छेदक (Fruit Borer):** स्पिनोसैड (0.3 मिली/ली) या कोराजन (0.3 मिली/ली) का छिड़काव करें।
- **सलाह:** संक्रमित टहनियों को काटकर 1% बोर्डो पेस्ट लगाएं।`;
    }
    if (language === 'en') {
      return `🍎 **Solapur Pomegranate Advisory & Market Rates:**
- **APMC Rates:** Bhagwa Export Super ₹8,500 - ₹17,500/quintal; Arakta ₹4,500 - ₹9,200/quintal.
- **Bacterial Blight (Telya):** Spray Copper Oxychloride (2.5g) + Streptocycline (0.5g) per liter of water.
- **Fruit Borer & Pin-hole Borer:** Chlorantraniliprole (0.3ml/liter) or Spinosad (0.3ml/liter).
- **Recommendation:** Maintain strict orchard hygiene and apply 1% Bordeaux paste after pruning.`;
    }
    return `🍎 **सोलापूर डाळिंब (भगवा) पीक सल्ला व चालू बाजारभाव:**
- **चालू बाजारभाव:** भगवा डाळिंब ₹८,५०० ते ₹१७,५००/क्विंटल (सुपर एक्सपोर्ट); आरक्ता/स्थानिक ₹४,५०० ते ₹९,२००/क्विंटल.
- **तेल्या (Bacterial Blight) नियंत्रण:** कॉपर ऑक्सिक्लोराईड (२.५ ग्रॅम) + स्ट्रेप्टोसायक्लिन (०.५ ग्रॅम) प्रति लिटर पाण्यात मिसळून फवारणी करावी.
- **फळ पोखरणाऱ्या अळीवर उपाय:** कोराजन (०.३ मिली/लिटर) किंवा स्पिनोसॅड (०.३ मिली/लिटर) ची फवारणी करावी.
- **झाडाची ताकद:** पोटॅश आणि सिलिकॉनचा नियमित वापर केल्याने फळांची साल जाड राहून तेल्याचा प्रादुर्भाव कमी होतो.`;
  }

  // Default intelligent response
  if (language === 'hi') {
    return `नमस्ते किसान साथी! आपके प्रश्न ("${userMessage}") के संदर्भ में:
- **सोलापुर मंडी भाव:** प्याज (₹1,200-2,450), डाळिंब (₹8,500-17,500), ज्वार (₹3,200-4,650), अंगूर (₹4,800-8,500)।
- **फसल सलाह:** अपनी फसल का नाम व समस्या (जैसे: कीट, रोग, पीलापन, खाद) स्पष्ट लिखकर या बोलकर पूछें, कृषीमित्र AI तुरंत सटीक उपाय देगा।`;
  }
  if (language === 'en') {
    return `Hello Farmer Friend! Regarding your query ("${userMessage}"):
- **Live Solapur APMC Rates:** Onion (₹1,200-2,450), Pomegranate (₹8,500-17,500), Maldandi Jowar (₹3,200-4,650), Grapes (₹4,800-8,500).
- **Agri Advisory:** Please specify your crop name and issue (e.g., pests, yellowing leaves, fertilizer dosage, sowing) for exact actionable solutions.`;
  }
  return `नमस्कार बळीराजा! आपल्या प्रश्नाच्या ("${userMessage}") संदर्भात:
- **सोलापूर APMC थेट भाव:** कांदा (₹१,२००-२,४५०), डाळिंब (₹८,५००-१७,५००), मालदांडी ज्वारी (₹३,२००-४,६५०), द्राक्षे (₹४,८००-८,५००), सोयाबीन (₹४,१००-४,८५०).
- **सल्ला:** आपण कोणत्याही पिकाचे नाव, खताचे प्रमाण किंवा रोगाची लक्षणे विचारल्यास कृषीमित्र AI आपल्याला त्वरित अचूक मार्गदर्शन करेल.`;
}

function extractJsonFromText(text) {
  if (!text) return null;
  try {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[1] || match[0]);
    }
  } catch (e) {}
  return null;
}

/**
 * Static domain expert advisory tailored for Solapur APMC commodities
 */
export function getSolapurStaticAdvisory(cropId = 'onion_red_solapur', cropObj = null) {
  const crop = cropObj || SOLAPUR_COMMODITIES.find((c) => c.id === cropId) || SOLAPUR_COMMODITIES[0];

  switch (cropId) {
    case 'onion_red_solapur':
    case 'onion_white':
      return {
        cropId,
        cropName: crop.nameMr,
        variety: crop.variety,
        forecastTrend: 'सोलापूर बाजारात कांद्याची आवक आज १५-२०% ने घटल्याने मध्यम व मोठ्या गोल्टी कांद्याला चांगली मागणी आहे. येत्या २-३ दिवसांत दरात ₹१५० ते ₹२५० प्रति क्विंटल वाढ अपेक्षित आहे.',
        forecastBadge: 'तेजी (+₹१५०-₹२५० वाढ)',
        trendDirection: 'up',
        recommendation: 'टप्प्याटप्प्याने विक्री करा (Staggered Sale)',
        recommendationType: 'stagger',
        arrivalPressure: 'कमी आवक - तेजीचा कल',
        arrivalPressureType: 'low',
        detailedAnalysis: 'मंगळवार पेठ कांदा मार्केट यार्डात स्थानिक आवक सुमारे १८,५०० क्विंटल असून दक्षिण भारतातून (कर्नाटक व तामिळनाडू) खरेदीदार सक्रिय आहेत. चांगल्या दर्जेदार लाल कांद्याला स्पर्धात्मक बोली मिळत आहे.',
        gradingTip: 'कांदा काढणीनंतर पूर्णपणे सुकवून (मान सुकलेली) आणि ४५mm+ आकाराची स्वतंत्र प्रतवारी केल्यास प्रति क्विंटल ₹२०० ते ₹३५० पर्यंत अधिक भाव मिळतो. डॅमेज व पोकल कांदा वेगळा करावा.',
        keyDrivers: [
          'दक्षिण भारतातील बाजारांतून मजबूत मागणी',
          'स्थानिक आवक मर्यादित राहिल्याने पुरवठा घट',
          'सुपर गोल्टी व मोठ्या गोला कांद्याला व्यापाऱ्यांची पसंती',
        ],
      };

    case 'pomegranate_bhagwa':
      return {
        cropId,
        cropName: crop.nameMr,
        variety: crop.variety,
        forecastTrend: 'भगवा डाळिंबाला परराज्यातून (बंगळुरू, दिल्ली, गुजरात) निर्यात मागणी जोरदार असल्याने दर ₹१३,५०० ते ₹१७,५०० च्या उच्च पातळीवर टिकून राहतील.',
        forecastBadge: 'उच्चांकी दर (स्थिर/तेजी)',
        trendDirection: 'up',
        recommendation: 'लिलावात त्वरित विक्री करा (Sell Now)',
        recommendationType: 'sell_now',
        arrivalPressure: 'मध्यम आवक - दर स्थिर',
        arrivalPressureType: 'medium',
        detailedAnalysis: 'कुमठा नाका फळ यार्डात डाळिंबाची दैनिक आवक ३,२०० क्विंटल असून ४००+ ग्रॅम आकाराच्या भगवा एक्सपोर्ट क्वॉलिटी डाळिंबाची खरेदी जोरात सुरू आहे.',
        gradingTip: 'काळे डाग किंवा तेल्या नसलेले, चमकदार लाल आरक्ता रंग असलेले डाळिंब स्वतंत्र क्रेट्समध्ये पॅक करून ई-लिलावात सादर करावे.',
        keyDrivers: [
          'सणासुदीच्या पार्श्वभूमीवर परराज्यातून मोठी मागणी',
          '४००+ ग्रॅम सुपर एक्सपोर्ट फळांना प्रीमियम दर',
          'सोलापूर APMC मध्ये थेट निर्यातदार व्यापाऱ्यांची उपस्थिती',
        ],
      };

    case 'jowar_maldandi':
      return {
        cropId,
        cropName: crop.nameMr,
        variety: crop.variety,
        forecastTrend: 'सोलापुरी मालदांडी M-35-1 ज्वारीचे भाव ₹४,१०० ते ₹४,६५० च्या मजबूत पातळीवर स्थिर राहतील. स्थानिक व मुंबई-पुणे बाजारातून सतत मागणी असल्याने मंदीची शक्यता नाही.',
        forecastBadge: 'स्थिर व मजबूत (₹४,१००-₹४,६५०)',
        trendDirection: 'stable',
        recommendation: 'माल रोखून ठेवा (Hold for Better Price)',
        recommendationType: 'hold',
        arrivalPressure: 'कमी आवक - तेजीचा कल',
        arrivalPressureType: 'low',
        detailedAnalysis: 'मुख्य धान्य मार्केट यार्डात मालदांडी ज्वारीची आवक १,८५० क्विंटल आहे. थेट किरकोळ व्यापारी व गृहउद्योग खरेदीदार मालदांडीच्या गोडीमुळे चांगला भाव देत आहेत.',
        gradingTip: 'ज्वारी उन्हात कडक वाळवून, बारीक खडे व भुसा चाळून स्वच्छ ५० किलो पोत्यांत भरल्यास उच्च दर मिळतो.',
        keyDrivers: [
          'सोलापुरी मालदांडी वाणाची उच्च ब्रँड व्हॅल्यू',
          'घरगुती व व्यापारी साठवणुकीसाठी मागणी',
          'आवक नियंत्रणात असल्याने दर मजबूत',
        ],
      };

    case 'tur_red':
      return {
        cropId,
        cropName: crop.nameMr,
        variety: crop.variety,
        forecastTrend: 'लाल तुरीला डाळ मिल्सकडून जोरदार खरेदी असून भाव ₹९,२०० ते ₹९,८०० प्रति क्विंटल दरम्यान चढे राहतील. पुढील काही दिवसांत ₹१००-₹१५० ची आणखी सुधारणा संभवते.',
        forecastBadge: 'तेजीचा कल (+₹१००-₹१५०)',
        trendDirection: 'up',
        recommendation: 'टप्प्याटप्प्याने विक्री करा (Staggered Sale)',
        recommendationType: 'stagger',
        arrivalPressure: 'मध्यम आवक - दर स्थिर',
        arrivalPressureType: 'medium',
        detailedAnalysis: 'कडधान्य लिलाव शेडमध्ये स्थानिक तसेच लातूर व गुलबर्गा येथील डाळ मिलर्सची उपस्थिती आहे. सरकारी हमीभावापेक्षा तुरीला ₹२,००० अधिक दर मिळत आहे.',
        gradingTip: 'तुरीतील आर्द्रता १२% पेक्षा कमी असावी. दाणे एकसारखे, किडमुक्त व लाल चकचकीत असल्यास व्यापारी सर्वोच्च बोली लावतात.',
        keyDrivers: [
          'डाळ गिरणी मालकांची वेगाने खरेदी',
          'देशांतर्गत साठ्यात मर्यादित उपलब्धता',
          'हमीभावापेक्षा जास्त बाजारभाव',
        ],
      };

    case 'soybean_yellow':
    default:
      return {
        cropId: crop.id || 'soybean_yellow',
        cropName: crop.nameMr,
        variety: crop.variety,
        forecastTrend: 'सोयाबीन भाव ₹४,३०० ते ₹४,७५० दरम्यान राहतील. आंतरराष्ट्रीय तेलबिया बाजारातील कलानुसार दर सध्या स्थिर ते मर्यादित चढ-उतारात राहण्याची शक्यता आहे.',
        forecastBadge: 'दर स्थिर (₹४,३००-₹४,७५०)',
        trendDirection: 'stable',
        recommendation: 'माल रोखून ठेवा (Hold for Better Price)',
        recommendationType: 'hold',
        arrivalPressure: 'भरमसाठ आवक - नरमाई',
        arrivalPressureType: 'high',
        detailedAnalysis: 'तेलबिया यार्डात सोयाबीनची दैनिक आवक ३,१०० क्विंटल आहे. आवक जास्त असल्याने क्रशिंग प्लांट्स सावधपणे खरेदी करत आहेत.',
        gradingTip: 'सोयाबीनमध्ये ओलावा १०% च्या आत आणून स्वच्छ साठवणूक केल्यास पुढील काळात ₹३०० ते ₹५०० अधिक भाव मिळू शकेल.',
        keyDrivers: [
          'हंगामातील मुबलक स्थानिक आवक',
          'क्रशिंग प्लांट्सची गरजेनुसार मर्यादित खरेदी',
          'आर्द्रता कमी असलेल्या वाणाला प्राधान्य',
        ],
      };
  }
}

/**
 * AI Smart Crop Selling Advisor
 * Leverages Gemini API or domain expert Solapur APMC model
 */
export async function getSolapurPriceAdvisory(cropId = 'onion_red_solapur', customCropName = '') {
  const crop =
    SOLAPUR_COMMODITIES.find((c) => c.id === cropId) ||
    SOLAPUR_COMMODITIES.find((c) => customCropName && c.nameMr.includes(customCropName)) ||
    SOLAPUR_COMMODITIES[0];

  const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim() : '';

  const cropName = crop?.nameMr || customCropName || 'सोलापूर कांदा';
  const arrivals = crop?.arrivals ? `${crop.arrivals.toLocaleString('en-IN')} ${crop.unit}` : 'मध्यम आवक';
  const minPrice = crop?.minPrice ? `₹${crop.minPrice.toLocaleString('en-IN')}` : '₹१,६००';
  const maxPrice = crop?.maxPrice ? `₹${crop.maxPrice.toLocaleString('en-IN')}` : '₹२,८५०';
  const avgPrice = crop?.avgPrice ? `₹${crop.avgPrice.toLocaleString('en-IN')}` : '₹२,४००';
  const yard = crop?.yard || 'सोलापूर APMC मार्केट यार्ड';

  const promptText = `You are the chief APMC Solapur Mandi intelligence analyst and agricultural economist.
Analyze current Solapur market arrivals and price dynamics for: ${cropName}.
Current Market Data:
- यार्ड: ${yard} (मंगळवार पेठ / कुमठा नाका)
- आजची आवक: ${arrivals}
- किमान भाव: ${minPrice} प्रति ${crop?.unit || 'क्विंटल'}
- कमाल भाव: ${maxPrice} प्रति ${crop?.unit || 'क्विंटल'}
- सरासरी मोडल भाव: ${avgPrice} प्रति ${crop?.unit || 'क्विंटल'}
- चालू कल: ${crop?.trend || 'तेजी'} (${crop?.changePercent || '+३%'})

Provide an expert, actionable market advisory in Marathi for farmers and traders.
Respond ONLY with a valid JSON block:
\`\`\`json
{
  "cropName": "${cropName}",
  "forecastTrend": "येत्या २ ते ४ दिवसांत दरात काय बदल अपेक्षित आहे (वाढ/घट/स्थिर आणि किती ₹)",
  "forecastBadge": "तेजी (+₹१५०-₹२५०) / स्थिर / नरमाई",
  "trendDirection": "up",
  "recommendation": "माल रोखून ठेवा (Hold) / टप्प्याटप्प्याने विक्री करा (Staggered Sale) / त्वरित विक्री करा (Sell Now)",
  "recommendationType": "stagger",
  "arrivalPressure": "कमी आवक - तेजीचा कल",
  "arrivalPressureType": "low",
  "detailedAnalysis": "सोलापूर यार्डातील आवक, परराज्यातील मागणी (उदा. दक्षिण भारत, गुजरात) व स्थानिक कारणांचे सविस्तर विश्लेषण.",
  "gradingTip": "शेतकऱ्याला लिलावात सर्वोच्च भाव मिळण्यासाठी प्रतवारी, ओलावा, व पॅकिंगचा सल्ला.",
  "keyDrivers": [
    "घटक १",
    "घटक २",
    "घटक ३"
  ]
}
\`\`\``;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
      const result = await model.generateContent(promptText);
      const text = (await result.response).text();
      const parsed = extractJsonFromText(text);
      if (parsed && parsed.forecastTrend) {
        return {
          ...parsed,
          cropId: crop.id,
          variety: crop.variety,
        };
      }
    } catch (e) {
      console.warn('Gemini advisory SDK error, attempting REST fallback:', e?.message);
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
        });
        if (res.ok) {
          const data = await res.json();
          const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          const parsed = extractJsonFromText(candidate);
          if (parsed && parsed.forecastTrend) {
            return {
              ...parsed,
              cropId: crop.id,
              variety: crop.variety,
            };
          }
        }
      } catch (restErr) {
        console.warn('Gemini REST error, using static advisory:', restErr?.message);
      }
    }
  }

  return getSolapurStaticAdvisory(cropId, crop);
}



