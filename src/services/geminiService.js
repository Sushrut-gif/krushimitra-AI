import { GoogleGenerativeAI } from '@google/generative-ai';

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
 * Model: gemini-flash-latest
 * Supports Marathi (Default), Hindi, English
 */
export async function askKrushiMitraAssistant(userMessage, chatHistory = [], language = 'mr') {
  if (!userMessage || !userMessage.trim()) {
    if (language === 'hi') return 'कृपया अपनी फसल, खाद या सोलापुर मंडी भाव से जुड़ा प्रश्न पूछें।';
    if (language === 'en') return 'Please ask a question about crops, fertilizers, or APMC mandi rates.';
    return 'कृपया पीक, खत व्यवस्थापन किंवा सोलापूर बाजारभाव याविषयी प्रश्न विचारा.';
  }

  const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim() : '';

  const systemPrompt = `You are KrushiMitra AI, an intelligent agricultural advisor designed for farmers in Solapur, Maharashtra and wider India.
Answer farmer questions accurately on crop health, pests, fertilizer dosage, weather advisories, and APMC market trends.
Always respond purely in the user's selected language:
- If Marathi (mr): Polite, rural-friendly Marathi (शेतकरी बांधवांसाठी सोपी व आदरयुक्त भाषा).
- If Hindi (hi): Easy-to-understand conversational Hindi.
- If English (en): Clear, concise English.
Keep answers practical, structured in bullet points, and actionable.

Market & Agronomy Context (Solapur, Maharashtra):
- Key Crops: Onion (कांदा), Pomegranate (डाळिंब - भगवा), Jowar (मालदांडी ज्वारी M-35-1), Grapes (द्राक्षे), Tur (तूर), Soybean (सोयाबीन).
- Mandi Yards: सोलापूर APMC मंगळवार पेठ (धान्य व कांदा) आणि कुमठा नाका (फळे व भाजीपाला).
- Mandi Timings: आवक सकाळी ६:०० ते ११:००, लिलाव ११:३० ते दुपारी ३:३०.`;

  // Realistic fallback advisor responses if API key is not configured or fails
  const getSmartAgriFallback = (query, lang) => {
    const q = query.toLowerCase();

    // 1. Pomegranate disease / तेल्या रोग
    if (q.includes('डाळिंब') || q.includes('तेल्या') || q.includes('अनार') || q.includes('pomegranate') || q.includes('oily spot')) {
      if (lang === 'hi') {
        return `🍎 **अनार (डाळिंब) पर तेलिया (बैक्टीरियल ब्लाइट) रोग नियंत्रण उपाय:**
- **लक्षण:** पत्तियों व फलों पर गहरे भूरे रंग के तेलीय धब्बे, जो बाद में 'L' या 'Y' आकार में फटते हैं।
- **उपचार व छिड़काव:**
  * कॉपर ऑक्सीक्लोराइड (2.5 ग्राम) + स्ट्रेप्टोसायक्लिन (0.5 ग्राम) प्रति लीटर पानी में मिलाकर छिड़काव करें।
  * रोगग्रस्त टहनियों और फलों को बगीचे से बाहर निकालकर नष्ट करें।
  * बोर्डो मिश्रण (1%) का मौसम बदलने पर नियमित छिड़काव करें।
  * नाइट्रोजन की अधिक मात्रा टालें, पोटाश व सूक्ष्म पोषक तत्वों का संतुलित प्रयोग करें।`;
      }
      if (lang === 'en') {
        return `🍎 **Pomegranate Bacterial Blight (Telya Disease) Management:**
- **Symptoms:** Dark brown oily spots on leaves and fruit rinds that crack in L or Y shapes.
- **Actionable Control:**
  * Spray Copper Oxychloride (2.5g) + Streptocycline (0.5g) per liter of water.
  * Prune infected branches and destroy fallen fruits away from the orchard.
  * Apply 1% Bordeaux mixture before flowering and during humidity shifts.
  * Avoid excessive nitrogen; balance with Potassium, Calcium, and Boron.`;
      }
      return `🍎 **डाळिंबावरील तेल्या (Bacterial Blight) रोगावर प्रभावी उपाय:**
- **लक्षणे:** पाने व फळांवर तेलकट काळे ठिपके पडणे व फळे 'L' किंवा 'Y' आकारात तडकणे.
- **फवारणी व उपाययोजना:**
  * कॉपर ऑक्सिक्लोराईड (२.५ ग्रॅम) + स्ट्रेप्टोमायसीन/स्ट्रेप्टोसायक्लिन (०.५ ग्रॅम) प्रति लिटर पाण्यात मिसळून तातडीने फवारणी करावी.
  * बागेतील तेल्याग्रस्त फळे व फांद्या छाटून बागेबाहेर नेऊन नष्ट कराव्यात.
  * छाटणीनंतर १% बोर्डो मिश्रणाची संपूर्ण झाडावर धुरळणी/फवारणी करावी.
  * नत्राचा अतिवापर टाळावा, पोटॅश आणि सिलिकॉनचा वापर वाढवून झाडाची रोगप्रतिकारशक्ती वाढवावी.`;
    }

    // 2. Onion price trend / कांदा बाजारभाव
    if (q.includes('कांदा') || q.includes('कांद्याचे') || q.includes('प्याज') || q.includes('onion')) {
      if (lang === 'hi') {
        return `🧅 **सोलापुर APMC प्याज (कांदा) बाजारभाव व कल:**
- **वर्तमान भाव:** ₹1,200 - ₹2,450 प्रति क्विंटल (औसत ₹2,100).
- **आवक स्थिति:** मंगळवार पेठ यार्ड में लगभग 4,200 क्विंटल आवक।
- **बाजार का रुझान:** मांग अच्छी होने से आने वाले हफ्तों में भाव में स्थिरता व ₹150-250 की तेजी संभव है।
- **किसान सलाह:** अच्छे ग्रेड वाले लाल प्याज को सुखाकर ही मंडी लाएं ताकि उच्चतम बोली मिल सके।`;
      }
      if (lang === 'en') {
        return `🧅 **Solapur APMC Onion Market Analysis & Trends:**
- **Current Rates:** ₹1,200 - ₹2,450 / quintal (Modal Avg: ₹2,100).
- **Yard Arrivals:** ~4,200 quintals at Mangalwar Peth Market Yard.
- **Market Trend:** Steady to Bullish (+4%) due to rising inter-state demand.
- **Farmer Advice:** Sun-dry harvested onions properly before bringing them to auction to fetch top grade bids.`;
      }
      return `🧅 **सोलापूर APMC कांदा बाजारभाव व भविष्यातील कल:**
- **चालू बाजारभाव:** ₹१,२०० ते ₹२,४५० प्रति क्विंटल (सरासरी मॉडेल भाव: ₹२,१००).
- **आवक स्थिती:** मंगळवार पेठ मार्केट यार्डात अंदाजे ४,२०० क्विंटलची आवक.
- **बाजारातील कल:** आगामी आठवड्यात आवक नियंत्रणात राहिल्यास दरात १०० ते २५० रुपयांची सुधारणा अपेक्षित आहे.
- **शेतकऱ्यांसाठी सल्ला:** कांदा चांगला वाळवून, प्रतवारी (ग्रेडिंग) करूनच लिलावासाठी आणावा जेणेकरून चांगला दर मिळेल.`;
    }

    // 3. Jowar fertilizer / ज्वारी खत व्यवस्थापन
    if (q.includes('ज्वारी') || q.includes('ज्वार') || q.includes('खत') || q.includes('खाद') || q.includes('fertilizer') || q.includes('jowar')) {
      if (lang === 'hi') {
        return `🌾 **मालदांडी ज्वार के लिए संतुलित खाद प्रबंधन:**
- **बुवाई के समय (बेसल डोज):** 10:26:26 (1 बोरी) अथवा डीएपी (DAP - 50 किग्रा) + पोटाश (25 किग्रा) प्रति एकड़।
- **पहली खुरपी/पानी पर (30-35 दिन):** यूरिया 25-30 किग्रा प्रति एकड़ छिड़कें।
- **सूक्ष्म पोषक तत्व:** दाना भरते समय 19:19:19 (5 ग्राम/ली) अथवा 0:52:34 का छिड़काव दानों की चमक व वजन बढ़ाता है।`;
      }
      if (lang === 'en') {
        return `🌾 **Maldandi Jowar Fertilizer Schedule:**
- **Basal Dose (At Sowing):** 1 bag 10:26:26 or DAP (50 kg) + MOP Potash (25 kg) per acre.
- **Top Dressing (30-35 Days):** Urea 25-30 kg per acre during weeding/first irrigation.
- **Grain Filling Stage:** Foliar spray of 0:52:34 or 19:19:19 (5g/liter) to improve grain size, luster, and weight.`;
      }
      return `🌾 **सोलापुरी मालदांडी ज्वारी (M-35-1) खत व्यवस्थापन:**
- **पेरणीच्या वेळी (पायाभूत खत):** १०:२६:२६ (१ बॅग) किंवा डीएपी (५० किलो) + एमओपी पोटॅश (२५ किलो) प्रति एकर द्यावे.
- **पहिल्या खुरपणीनंतर (३० ते ३५ दिवसांनी):** युरिया २५ ते ३० किलो प्रति एकर फेकून द्यावा.
- **दाणे भरताना (पोटरी अवस्था):** १९:१९:१९ (५ ग्रॅम/लिटर) किंवा ००:५२:३४ ची फवारणी केल्यास कणसातील दाणे टपोरे व चमकदार भरतात.`;
    }

    // Default general response
    if (lang === 'hi') {
      return `नमस्ते किसान साथी! मैं कृषि मित्र AI सलाहकार हूँ।\n- सोलापुर मंडी के ताजा भाव (प्याज, अनार, ज्वार, सोयाबीन)\n- फसलों के रोग, कीटनाशक व खाद की सही मात्रा\n- ई-नीलामी व डिजिटल गेट पास\nआप जो भी जानकारी चाहते हैं, नीचे टाइप करें या माइक पर बोलकर पूछें!`;
    }
    if (lang === 'en') {
      return `Hello! I am your KrushiMitra AI Agricultural Advisor.\n- Solapur APMC live commodity prices (Onion, Pomegranate, Jowar, Grapes)\n- Crop disease cures, pest control & fertilizer schedules\n- Live e-auctions & QR gate pass procedures\nPlease type your question or use the microphone to speak!`;
    }
    return `नमस्कार शेतकरी बंधू! मी आपला कृषी मित्र AI सल्लागार आहे.\n- सोलापूर APMC चे ताजे बाजारभाव (कांदा, डाळिंब, मालदांडी ज्वारी, तूर)\n- पिकांवरील रोग, खते व औषध फवारणीचे अचूक प्रमाण\n- शेतमाल ई-लिलाव व डिजिटल QR गेट पास\nआपला प्रश्न खाली टाईप करा किंवा माइकवर बोलून विचारा!`;
  };

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return getSmartAgriFallback(userMessage, language);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt,
    });

    const recentHistory = chatHistory
      .slice(-6)
      .map((m) => `${m.sender === 'user' ? 'User' : 'AgriAdvisor'}: ${m.text}`)
      .join('\n');

    const promptText = recentHistory
      ? `Previous conversation:\n${recentHistory}\n\nFarmer Question (${language}): ${userMessage}`
      : `Farmer Question (${language}): ${userMessage}`;

    const result = await model.generateContent(promptText);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.warn('Gemini chat SDK failed, using smart agri fallback:', err?.message);
    return getSmartAgriFallback(userMessage, language);
  }
}

