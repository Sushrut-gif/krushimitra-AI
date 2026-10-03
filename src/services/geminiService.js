import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Cleanly extract base64 data and mime type from data URL
 */
export function parseDataUrl(dataUrl) {
  const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      mimeType: matches[1],
      base64Data: matches[2],
    };
  }
  // Default fallback
  const base64 = dataUrl.split(',')[1] || dataUrl;
  return {
    mimeType: 'image/jpeg',
    base64Data: base64,
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
          features: Array.isArray(parsed.features) ? parsed.features : [parsed.features].filter(Boolean),
          estimatedPrice: parsed.estimatedPrice || 'दर उपलब्ध नाही',
          farmerAdvice: parsed.farmerAdvice || '',
          rawText: rawText,
        };
      }
    }
  } catch (e) {
    // If JSON parsing fails, continue to text parsing
  }

  // Parse lines matching key labels
  let cropName = '';
  let qualityGrade = '';
  let features = [];
  let estimatedPrice = '';
  let farmerAdvice = '';

  const lines = rawText.split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.includes('पिकाचे नाव') || trimmed.includes('१.')) {
      cropName = trimmed.replace(/^.*(?:पिकाचे नाव|१\.)[:\-.]?\s*/, '').replace(/[*_#]/g, '');
    } else if (trimmed.includes('गुणवत्ता प्रत') || trimmed.includes('२.')) {
      qualityGrade = trimmed.replace(/^.*(?:गुणवत्ता प्रत|२\.)[:\-.]?\s*/, '').replace(/[*_#]/g, '');
    } else if (trimmed.includes('प्रमुख वैशिष्ट्ये') || trimmed.includes('३.')) {
      const feat = trimmed.replace(/^.*(?:प्रमुख वैशिष्ट्ये|३\.)[:\-.]?\s*/, '').replace(/[*_#]/g, '');
      if (feat) features.push(feat);
    } else if (trimmed.includes('सोलापूर APMC दर') || trimmed.includes('४.')) {
      estimatedPrice = trimmed.replace(/^.*(?:दर|४\.)[:\-.]?\s*/, '').replace(/[*_#]/g, '');
    } else if (trimmed.includes('शेतकऱ्यासाठी सल्ला') || trimmed.includes('५.')) {
      farmerAdvice = trimmed.replace(/^.*(?:सल्ला|५\.)[:\-.]?\s*/, '').replace(/[*_#]/g, '');
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      const bullet = trimmed.replace(/^[-*•]\s*/, '').replace(/[*_#]/g, '');
      if (bullet.length > 2) features.push(bullet);
    }
  });

  return {
    cropName: cropName || 'शेतमाल पाहणी',
    qualityGrade: qualityGrade || 'विश्लेषण पूर्ण',
    features: features.length > 0 ? features : ['फोटोवरून गुणवत्ता तपासणी करण्यात आली आहे.'],
    estimatedPrice: estimatedPrice || 'सोलापूर APMC चालू बाजारभावानुसार',
    farmerAdvice: farmerAdvice || rawText,
    rawText: rawText,
  };
}

/**
 * Main Gemini AI Crop Quality Assessment
 */
export async function assessCropQualityWithGemini(dataUrl) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  const { base64Data, mimeType } = parseDataUrl(dataUrl);

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-2.5-flash / gemini-1.5-flash for multimodal vision capabilities
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `या शेतमालाच्या फोटोचे विश्लेषण करा आणि मराठीत खालीलप्रमाणे रिझल्ट द्या: १. पिकाचे नाव, २. गुणवत्ता प्रत (उदा. उत्तम, मध्यम, कमी), ३. प्रमुख वैशिष्ट्ये (उदा. रंग, आकार, डाग), ४. अंदाजे चालू सोलापूर APMC दर (प्रति क्विंटल) आणि ५. शेतकऱ्यासाठी सल्ला.

कृपया शेतकऱ्यांना वाचण्यास सोपे जावे म्हणून खालीलप्रमाणे नेमके JSON फॉरमॅटमध्ये उत्तर द्या:
\`\`\`json
{
  "cropName": "पिकाचे नाव (उदा. कांदा / डाळिंब / सोयाबीन / गहू / तूर)",
  "qualityGrade": "उत्तम / मध्यम / कमी",
  "features": [
    "वैशिष्ट्य १ (रंग व चकाकी)",
    "वैशिष्ट्य २ (आकार व वजन)",
    "वैशिष्ट्य ३ (डाग किंवा इतर निरीक्षण)"
  ],
  "estimatedPrice": "अंदाजे चालू सोलापूर APMC दर (उदा. ₹२,२०० - ₹२,५०० प्रति क्विंटल)",
  "farmerAdvice": "शेतकऱ्यासाठी महत्त्वाचा विक्री व साठवणूक सल्ला"
}
\`\`\``;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const rawText = response.text();

  return parseGeminiCropResponse(rawText);
}
