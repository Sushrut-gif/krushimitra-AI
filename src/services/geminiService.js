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

  // 1. Primary: Use @google/generative-ai SDK with gemini-1.5-flash
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
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
