// Comprehensive cascading location data for all 36 districts of Maharashtra
// Priority districts (Solapur, Pune, Satara, Sangli, Kolhapur, Ahmednagar, etc.) placed first.

export const MAHARASHTRA_LOCATIONS = [
  // 1. Solapur (Priority 1)
  {
    id: 'solapur',
    nameMr: 'सोलापूर',
    nameEn: 'Solapur',
    priority: 1,
    talukas: [
      {
        id: 'north_solapur',
        nameMr: 'उत्तर सोलापूर',
        nameEn: 'North Solapur',
        villages: ['शेळगी', 'तिर्हे', 'बाळे', 'कोंडी', 'मार्डी', 'केगाव', 'देगाव', 'कवठे', 'नान्नज', 'हिप्परगा', 'हगलूर'],
      },
      {
        id: 'south_solapur',
        nameMr: 'दक्षिण सोलापूर',
        nameEn: 'South Solapur',
        villages: ['मंद्रूप', 'होटगी', 'बोरामणी', 'वळसंग', 'कुंभारी', 'मुस्ती', 'वडकबाळ', 'कंदलगाव', 'औज', 'होसूर'],
      },
      {
        id: 'barshi',
        nameMr: 'बार्शी',
        nameEn: 'Barshi',
        villages: ['वैराग', 'पांगरी', 'उपळे (दुमाला)', 'नारी', 'खांडवी', 'रातंजन', 'गौडगाव', 'दहितणे', 'सुरडी', 'मानेगाव'],
      },
      {
        id: 'pandharpur',
        nameMr: 'पंढरपूर',
        nameEn: 'Pandharpur',
        villages: ['करकंब', 'कासेगाव', 'भोसे', 'पुळूज', 'पटवर्धन कुरोली', 'कोर्ठा', 'तांडोर', 'शेगाव', 'शिरढोण', 'गाडेगाव', 'तुंगत'],
      },
      {
        id: 'sangola',
        nameMr: 'सांगोला',
        nameEn: 'Sangola',
        villages: ['महूद', 'नाझरे', 'जवळा', 'वाढेगाव', 'कोळे', 'मेडशिंगी', 'कटफळ', 'अचकदाणी', 'सोनंद', 'मंगेवाडी'],
      },
      {
        id: 'madha',
        nameMr: 'माढा',
        nameEn: 'Madha',
        villages: ['कुर्डूवाडी', 'टेंभुर्णी', 'मोडनिंब', 'अरण', 'रोपळे', 'दारफळ', 'उपळवटे', 'शिराळ', 'वेनेगाव', 'लऊळ'],
      },
      {
        id: 'mohol',
        nameMr: 'मोहोळ',
        nameEn: 'Mohol',
        villages: ['अनगर', 'कामती', 'पेनूर', 'कुरूल', 'कोन्हेरी', 'वाघोली', 'पोखरापूर', 'बेगमपूर', 'शेटफळ', 'सोहाळे'],
      },
      {
        id: 'karmala',
        nameMr: 'करमाळा',
        nameEn: 'Karmala',
        villages: ['जेऊर', 'केत्तूर', 'कोर्टी', 'वांगी', 'पांडे', 'दहिगाव', 'रोशेवाडी', 'वीट', 'उमरड', 'पोथरे'],
      },
      {
        id: 'mangalwedha',
        nameMr: 'मंगळवेढा',
        nameEn: 'Mangalwedha',
        villages: ['आंधळगाव', 'भोसे', 'मरवडे', 'हुलजंती', 'मारापूर', 'बोराळे', 'शिरनांदगी', 'लेंडवे चिंचाळे', 'डोणज'],
      },
      {
        id: 'akkalkot',
        nameMr: 'अक्कलकोट',
        nameEn: 'Akkalkot',
        villages: ['वागदरी', 'मैंदर्गी', 'चपळगाव', 'तडवळ', 'किणी', 'हंद्राळ', 'तोळणूर', 'करजगी', 'शेगाव'],
      },
      {
        id: 'malshiras',
        nameMr: 'माळशिरस',
        nameEn: 'Malshiras',
        villages: ['अकलूज', 'नातेपुते', 'महाळुंग', 'वेळापूर', 'पिळिव', 'बोरगाव', 'सदाशिवनगर', 'दहीगाव', 'मांडवे', 'खुडूस'],
      },
    ],
  },

  // 2. Pune (Priority 2)
  {
    id: 'pune',
    nameMr: 'पुणे',
    nameEn: 'Pune',
    priority: 2,
    talukas: [
      {
        id: 'baramati',
        nameMr: 'बारामती',
        nameEn: 'Baramati',
        villages: ['माळेगाव बुद्रुक', 'सोमेश्वरनगर', 'सुपा', 'वडगाव निंबाळकर', 'शिरवली', 'पणदरे', 'ढाकाळे', 'काटेवाडी', 'मोरगाव'],
      },
      {
        id: 'haveli',
        nameMr: 'हवेली',
        nameEn: 'Haveli',
        villages: ['उरुळी कांचन', 'लोणी काळभोर', 'वाघोली', 'थेऊर', 'खडकवासला', 'कोंढवे धावडे', 'नांदेड सिटी', 'केसनंद'],
      },
      {
        id: 'indapur',
        nameMr: 'इंदापूर',
        nameEn: 'Indapur',
        villages: ['बावडा', 'निमगाव केतकी', 'पळसदेव', 'भिगवण', 'वालचंदनगर', 'लासुर्णे', 'शेटफळगढे', 'काझड'],
      },
      {
        id: 'daund',
        nameMr: 'दौंड',
        nameEn: 'Daund',
        villages: ['पाटस', 'यवत', 'वरवंड', 'केडगाव', 'खामगाव', 'बोरीपार्धी', 'पारगाव', 'मलठण'],
      },
      {
        id: 'shirur',
        nameMr: 'शिरूर',
        nameEn: 'Shirur',
        villages: ['शिक्रापूर', 'रांजणगाव गणपती', 'तळेगाव ढमढेरे', 'मांडवगण फराटा', 'न्हावरे', 'कोरेगाव भीमा'],
      },
      {
        id: 'junnar',
        nameMr: 'जुन्नर',
        nameEn: 'Junnar',
        villages: ['ओतूर', 'नारायणगाव', 'आळेफाटा', 'वारूळवाडी', 'धुमेवाडी', 'बेल्हे', 'राजुरी'],
      },
      {
        id: 'khed',
        nameMr: 'खेड (राजगुरुनगर)',
        nameEn: 'Khed Rajgurunagar',
        villages: ['चाकण', 'आळंदी', 'कडूस', 'वाडा', 'पाईट', 'शिरोली', 'रोहकल'],
      },
      {
        id: 'ambegaon',
        nameMr: 'आंबेगाव',
        nameEn: 'Ambegaon',
        villages: ['मंचर', 'घोडेगाव', 'पारगाव शिंगवे', 'कवठे', 'डिंभे', 'अवसरी बुद्रुक'],
      },
      {
        id: 'purandar',
        nameMr: 'पुरंदर (सासवड)',
        nameEn: 'Purandar Saswad',
        villages: ['सासवड', 'जेजुरी', 'वीर', 'वाल्हा', 'दिवे', 'नाझरे', 'राजेवाडी'],
      },
      {
        id: 'bhor',
        nameMr: 'भोर',
        nameEn: 'Bhor',
        villages: ['नसरापूर', 'किकवी', 'शिरवळ परिसर', 'भोळे', 'शिंदेवाडी', 'अंबवडे'],
      },
      {
        id: 'maval',
        nameMr: 'मावळ',
        nameEn: 'Maval',
        villages: ['तळेगाव दाभाडे', 'वडगाव मावळ', 'लोणावळा ग्रामीण', 'कान्हे', 'कामशेत'],
      },
      {
        id: 'mulshi',
        nameMr: 'मुळशी',
        nameEn: 'Mulshi',
        villages: ['पौड', 'पिरंगुट', 'हिंजवडी ग्रामीण', 'मुठा', 'कोळवण'],
      },
      {
        id: 'velhe',
        nameMr: 'वेल्हे',
        nameEn: 'Velhe',
        villages: ['वेल्हे बुद्रुक', 'पाबे', 'केळवद', 'पानशेत परिसर'],
      },
    ],
  },

  // 3. Satara (Priority 3)
  {
    id: 'satara',
    nameMr: 'सातारा',
    nameEn: 'Satara',
    priority: 3,
    talukas: [
      {
        id: 'satara_t',
        nameMr: 'सातारा',
        nameEn: 'Satara',
        villages: ['नागेवाडी', 'शेंद्रे', 'दरे', 'कुडाळ परिसर', 'वर्णे', 'अंबवडे'],
      },
      {
        id: 'karad',
        nameMr: 'कराड',
        nameEn: 'Karad',
        villages: ['उंब्रज', 'मलकापूर', 'मसूर', 'कोयना वसाहत', 'शेणोली', 'तांबवे', 'काले'],
      },
      {
        id: 'phaltan',
        nameMr: 'फलटण',
        nameEn: 'Phaltan',
        villages: ['तरडगाव', 'बरड', 'गिरवी', 'वाठार', 'साखरवाडी', 'राजाळे', 'होळ'],
      },
      {
        id: 'koregaon',
        nameMr: 'कोरेगाव',
        nameEn: 'Koregaon',
        villages: ['रहिमतपूर', 'वाठार स्टेशन', 'पिंपोडे बुद्रुक', 'किन्हई', 'शिरढोण'],
      },
      {
        id: 'wai',
        nameMr: 'वाई',
        nameEn: 'Wai',
        villages: ['भुईंज', 'सुरूर', 'पाचवड', 'बावधन', 'धोम', 'मेणवली'],
      },
      {
        id: 'khatav',
        nameMr: 'खटाव (वडूज)',
        nameEn: 'Khatav Vaduj',
        villages: ['वडूज', 'मायणी', 'औंध', 'पुसेगाव', 'पुसेसावळी', 'काटगुण'],
      },
      {
        id: 'maan',
        nameMr: 'माण (दहिवडी)',
        nameEn: 'Maan Dahiwadi',
        villages: ['दहिवडी', 'म्हसवड', 'गोंदवले बुद्रुक', 'मलवडी', 'पळशी'],
      },
      {
        id: 'khandala',
        nameMr: 'खंडाळा (शिरवळ)',
        nameEn: 'Khandala Shirwal',
        villages: ['शिरवळ', 'लोणंद', 'खंडाळा', 'अहिरे', 'नायगाव'],
      },
      {
        id: 'patan',
        nameMr: 'पाटण',
        nameEn: 'Patan',
        villages: ['ढेबेवाडी', 'तारळे', 'चाफळ', 'मल्हारपेठ', 'येरफळे'],
      },
      {
        id: 'jawali',
        nameMr: 'जावळी (मेढा)',
        nameEn: 'Jawali Medha',
        villages: ['मेढा', 'कुडाळ', 'केळघर', 'करहर'],
      },
      {
        id: 'mahabaleshwar',
        nameMr: 'महाबळेश्वर',
        nameEn: 'Mahabaleshwar',
        villages: ['पाचगणी ग्रामीण', 'ताप Cast', 'प्रतापगड परिसर'],
      },
    ],
  },

  // 4. Sangli (Priority 4)
  {
    id: 'sangli',
    nameMr: 'सांगली',
    nameEn: 'Sangli',
    priority: 4,
    talukas: [
      {
        id: 'miraj',
        nameMr: 'मिरज',
        nameEn: 'Miraj',
        villages: ['माळभाग', 'कुपवाड', 'म्हैसाळ', 'एरंडोली', 'आरग', 'बेळंकी', 'बिसूर'],
      },
      {
        id: 'tasgaon',
        nameMr: 'तासगाव',
        nameEn: 'Tasgaon',
        villages: ['सावळज', 'मणेराजुरी', 'विसापूर', 'येळावी', 'चिंचणी', 'बोरगाव'],
      },
      {
        id: 'walwa',
        nameMr: 'वाळवा (इस्लामपूर)',
        nameEn: 'Walwa Islampur',
        villages: ['इस्लामपूर', 'पेठ', 'बाहे', 'बहे बोरगाव', 'कासेगाव', 'वाटेगाव', 'ताकारी'],
      },
      {
        id: 'khanapur',
        nameMr: 'खानापूर (विटा)',
        nameEn: 'Khanapur Vita',
        villages: ['विटा', 'भाळवणी', 'लेंगरे', 'पारे', 'करंजे', 'गार्डी'],
      },
      {
        id: 'atpadi',
        nameMr: 'आटपाडी',
        nameEn: 'Atpadi',
        villages: ['दिघंची', 'खरसुंडी', 'नेलकरंजी', 'शेटफळे', 'घाणंद'],
      },
      {
        id: 'jat',
        nameMr: 'जत',
        nameEn: 'Jat',
        villages: ['उमदी', 'डफळापूर', 'संख', 'माडग्याळ', 'मुचंडी', 'शेगाव'],
      },
      {
        id: 'palus',
        nameMr: 'पलूस',
        nameEn: 'Palus',
        villages: ['कुंडल', 'रामानंदनगर', 'तुपारी', 'भिलवडी', 'बुर्ली'],
      },
      {
        id: 'kadegaon',
        nameMr: 'कडेगाव',
        nameEn: 'Kadegaon',
        villages: ['कडेपूर', 'शिरगाव', 'चिंचणी', 'वांगी', 'सोहोली'],
      },
      {
        id: 'shirala',
        nameMr: 'शिराळा',
        nameEn: 'Shirala',
        villages: ['शिरशी', 'कोकरुड', 'मांगले', 'चरण', 'वारणावती'],
      },
      {
        id: 'kavathe_mahankal',
        nameMr: 'कवठे महांकाळ',
        nameEn: 'Kavathe Mahankal',
        villages: ['कुची', 'ढालगाव', 'देशिंग', 'नांगोळे', 'बोरगाव'],
      },
    ],
  },

  // 5. Kolhapur (Priority 5)
  {
    id: 'kolhapur',
    nameMr: 'कोल्हापूर',
    nameEn: 'Kolhapur',
    priority: 5,
    talukas: [
      {
        id: 'karveer',
        nameMr: 'करवीर',
        nameEn: 'Karveer',
        villages: ['उचगाव', 'गांधीनगर', 'कळंबा', 'शिरोली', 'वडणगे', 'गोकुळ शिरगाव'],
      },
      {
        id: 'hatkanangale',
        nameMr: 'हातकणंगले',
        nameEn: 'Hatkanangale',
        villages: ['इचलकरंजी ग्रामीण', 'हुपरी', 'रुई', 'यड्राव', 'कोरोची', 'कबणूर'],
      },
      {
        id: 'shirol',
        nameMr: 'शिरोळ',
        nameEn: 'Shirol',
        villages: ['जयसिंगपूर', 'कुरुंदवाड', 'नृसिंहवाडी', 'दानोळी', 'हेरवाड'],
      },
      {
        id: 'panhala',
        nameMr: 'पन्हाळा',
        nameEn: 'Panhala',
        villages: ['कोडोली', 'बांबवडे', 'पोर्ले', 'माले', 'कळे'],
      },
      {
        id: 'kagal',
        nameMr: 'कागल',
        nameEn: 'Kagal',
        villages: ['मुरगूड', 'सिद्धनेर्ली', 'बस्तवडे', 'सेनापती कापशी', 'कसबा सांगाव'],
      },
      {
        id: 'radhanagari',
        nameMr: 'राधानगरी',
        nameEn: 'Radhanagari',
        villages: ['भोगावती', 'राशिवडे', 'कौलव', 'तारळे', 'सरवडे'],
      },
      {
        id: 'gadhinglaj',
        nameMr: 'गडहिंग्लज',
        nameEn: 'Gadhinglaj',
        villages: ['नेसरी', 'हरळी बुद्रुक', 'भडगाव', 'महागाव'],
      },
      {
        id: 'bhudargad',
        nameMr: 'भुदरगड (गारगोटी)',
        nameEn: 'Bhudargad Gargoti',
        villages: ['गारगोटी', 'कडगाव', 'पिंपळगाव', 'आकुर्डे'],
      },
      {
        id: 'shahuwadi',
        nameMr: 'शाहूवाडी',
        nameEn: 'Shahuwadi',
        villages: ['मलकापूर', 'बांबवडे', 'आंबा', 'येळवण जुगाई'],
      },
      {
        id: 'ajra',
        nameMr: 'आजरा',
        nameEn: 'Ajra',
        villages: ['उत्तूर', 'पेरणोली', 'मलिग्रे', 'चाफोली'],
      },
      {
        id: 'chandgad',
        nameMr: 'चंदगड',
        nameEn: 'Chandgad',
        villages: ['तुर्केवाडी', 'शिनोळी', 'हेरे', 'कोवाड'],
      },
      {
        id: 'gaganbawda',
        nameMr: 'गगनबावडा',
        nameEn: 'Gaganbawda',
        villages: ['बावडा', 'मांडुकली', 'अणदूर', 'खेरी'],
      },
    ],
  },

  // 6. Ahmednagar / Ahilyanagar (Priority 6)
  {
    id: 'ahmednagar',
    nameMr: 'अहमदनगर (अहिल्यानगर)',
    nameEn: 'Ahmednagar Ahilyanagar',
    priority: 6,
    talukas: [
      {
        id: 'nagar',
        nameMr: 'नगर',
        nameEn: 'Nagar',
        villages: ['भालवणी', 'चास', 'नागापूर', 'केडगाव परिसर', 'रुईछत्तीशी', 'जेऊर'],
      },
      {
        id: 'sangamner',
        nameMr: 'संगमनेर',
        nameEn: 'Sangamner',
        villages: ['आश्वी', 'धांदरफळ', 'तळेगाव', 'जोर्वे', 'समनापूर', 'घुलेवाडी'],
      },
      {
        id: 'kopargaon',
        nameMr: 'कोपरगाव',
        nameEn: 'Kopargaon',
        villages: ['पोहेगाव', 'सुरेगाव', 'कोळपेवाडी', 'धारणगाव', 'दहिगाव बोलका'],
      },
      {
        id: 'shrirampur',
        nameMr: 'श्रीरामपूर',
        nameEn: 'Shrirampur',
        villages: ['बेलापूर', 'टाकळीभान', 'उंदीरगाव', 'खंडाळा', 'माळवाडगाव'],
      },
      {
        id: 'rahata',
        nameMr: 'राहाता (शिर्डी)',
        nameEn: 'Rahata Shirdi',
        villages: ['शिर्डी', 'साकुरी', 'लोणी बुद्रुक', 'बाभळेश्वर', 'पुणतांबा'],
      },
      {
        id: 'rahuri',
        nameMr: 'राहुरी',
        nameEn: 'Rahuri',
        villages: ['वांबोरी', 'देवळाली प्रवरा', 'गुहा', 'ब्राह्मणी', 'बारागाव नांदूर'],
      },
      {
        id: 'shrigonda',
        nameMr: 'श्रीगोंदा',
        nameEn: 'Shrigonda',
        villages: ['बेलवंडी', 'मांडवगण', 'काष्टी', 'पेडगाव', 'देवदैठण'],
      },
      {
        id: 'parner',
        nameMr: 'पारनेर',
        nameEn: 'Parner',
        villages: ['राळेगणसिद्धी', 'टाकळी ढोकेश्वर', 'सुपा', 'पळशी', 'वाडेगव्हाण'],
      },
      {
        id: 'karjat_ah',
        nameMr: 'कर्जत',
        nameEn: 'Karjat',
        villages: ['मिरजगाव', 'राशिन', 'माही जळगाव', 'कोरेगाव', 'कुलधरण'],
      },
      {
        id: 'jamkhed',
        nameMr: 'जामखेड',
        nameEn: 'Jamkhed',
        villages: ['खर्डा', 'नान्नज', 'जवळा', 'अरणगाव', 'साकत'],
      },
      {
        id: 'nevasa',
        nameMr: 'नेवासा',
        nameEn: 'Nevasa',
        villages: ['घोडेगाव', 'कुकाणा', 'सोनई', 'सलाबतपूर', 'वडाळा'],
      },
      {
        id: 'shevgaon',
        nameMr: 'शेवगाव',
        nameEn: 'Shevgaon',
        villages: ['बोधेगाव', 'एरंडगाव', 'भातकुडगाव', 'मुंगी'],
      },
      {
        id: 'pathardi',
        nameMr: 'पाथर्डी',
        nameEn: 'Pathardi',
        villages: ['तिसगाव', 'करंजी', 'माणिकदौंडी', 'टाकळी मानूर'],
      },
      {
        id: 'akole',
        nameMr: 'अकोले',
        nameEn: 'Akole',
        villages: ['राजूर', 'कोतूळ', 'समशेरपूर', 'ब्राह्मणवाडा'],
      },
    ],
  },

  // 7. Nashik
  {
    id: 'nashik',
    nameMr: 'नाशिक',
    nameEn: 'Nashik',
    priority: 7,
    talukas: [
      {
        id: 'nashik_t',
        nameMr: 'नाशिक',
        nameEn: 'Nashik',
        villages: ['गंगापूर', 'माखमलाबाद', 'पिंपळगाव गरुडेश्वर', 'पाथर्डी', 'गिरणारे'],
      },
      {
        id: 'niphad',
        nameMr: 'निफाड',
        nameEn: 'Niphad',
        villages: ['पिंपळगाव बसवंत', 'ओझर', 'लासलगाव', 'सायखेडा', 'रानवड'],
      },
      {
        id: 'dindori',
        nameMr: 'दिंडोरी',
        nameEn: 'Dindori',
        villages: ['वणी', 'नानाशी', 'उमराळे', 'मोहाडी', 'वरखेडा'],
      },
      {
        id: 'sinnar',
        nameMr: 'सिन्नर',
        nameEn: 'Sinnar',
        villages: ['मुसळगाव', 'डुबेरे', 'पांढुर्ली', 'नायगाव', 'वावी'],
      },
      {
        id: 'yeola',
        nameMr: 'येवला',
        nameEn: 'Yeola',
        villages: ['अंदरसूल', 'नगरसूल', 'पाटोदा', 'राजापूर'],
      },
      {
        id: 'malegaon',
        nameMr: 'मालेगाव',
        nameEn: 'Malegaon',
        villages: ['दाभाडी', 'झोडगे', 'सौंदाणे', 'वडनेर खाकुर्डी'],
      },
      {
        id: 'chandwad',
        nameMr: 'चांदवड',
        nameEn: 'Chandwad',
        villages: ['वडनेर भैरव', 'राहुड', 'धोडांबे', 'शिरसाणे'],
      },
      {
        id: 'kalwan',
        nameMr: 'कळवण',
        nameEn: 'Kalwan',
        villages: ['अभोंणा', 'मानूर', 'कनाशी', 'दरेगाव'],
      },
      {
        id: 'baglan',
        nameMr: 'बागलाण (सटाणा)',
        nameEn: 'Baglan Satana',
        villages: ['सटाणा', 'ताहाराबाद', 'डांगसौंदाणे', 'विखार'],
      },
      {
        id: 'deola',
        nameMr: 'देवळा',
        nameEn: 'Deola',
        villages: ['लोहोणेर', 'वाखारी', 'मेशी', 'खर्डे'],
      },
      {
        id: 'nandgaon',
        nameMr: 'नांदगाव',
        nameEn: 'Nandgaon',
        villages: ['मनमाड ग्रामीण', 'न्यायडोंगरी', 'वेहेळगाव', 'हिसवळ'],
      },
      {
        id: 'igatpuri',
        nameMr: 'इगतपुरी',
        nameEn: 'Igatpuri',
        villages: ['घोटी बुद्रुक', 'टाकेद', 'भावली', 'वाघोबे'],
      },
      {
        id: 'trimbakeshwar',
        nameMr: 'त्र्यंबकेश्वर',
        nameEn: 'Trimbakeshwar',
        villages: ['तळेगाव', 'वेल्हे', 'अंबोली', 'हर्षेवाडी'],
      },
      {
        id: 'surgana',
        nameMr: 'सुरगाणा',
        nameEn: 'Surgana',
        villages: ['बोरगाव', 'उंबरठाण', 'हतगड'],
      },
      {
        id: 'peint',
        nameMr: 'पेठ',
        nameEn: 'Peint',
        villages: ['जोगमोडी', 'कोहोर', 'हरसूल परिसर'],
      },
    ],
  },

  // 8. Chhatrapati Sambhajinagar
  {
    id: 'chhatrapati_sambhajinagar',
    nameMr: 'छत्रपती संभाजीनगर (औरंगाबाद)',
    nameEn: 'Chhatrapati Sambhajinagar Aurangabad',
    priority: 8,
    talukas: [
      {
        id: 'sambhajinagar_t',
        nameMr: 'छत्रपती संभाजीनगर',
        nameEn: 'Sambhajinagar',
        villages: ['चिकलठाणा', 'हर्सूल', 'कौडगाव', 'दौलताबाद', 'शेंद्रा'],
      },
      {
        id: 'paithan',
        nameMr: 'पैठण',
        nameEn: 'Paithan',
        villages: ['बिडकीन', 'वाळूज', 'पाचोड', 'ढोरकीन', 'नांदूर'],
      },
      {
        id: 'gangapur',
        nameMr: 'गंगापूर',
        nameEn: 'Gangapur',
        villages: ['लाडगाव', 'रांजणगाव', 'तुर्काबाद', 'भेंडाळा'],
      },
      {
        id: 'vaijapur',
        nameMr: 'वैजापूर',
        nameEn: 'Vaijapur',
        villages: ['शिऊर', 'लाडगाव', 'भगूर', 'घायगाव'],
      },
      {
        id: 'sillod',
        nameMr: 'सिल्लोड',
        nameEn: 'Sillod',
        villages: ['अजिंठा', 'अंभई', 'भराडी', 'गोळेगाव'],
      },
      {
        id: 'kannad',
        nameMr: 'कन्नड',
        nameEn: 'Kannad',
        villages: ['चापानेर', 'पिशोर', 'चिंचोली', 'करंजखेड'],
      },
      {
        id: 'khuldabad',
        nameMr: 'खुलताबाद',
        nameEn: 'Khuldabad',
        villages: ['वेरूळ', 'बाजारसावंगी', 'सुलतानपूर', 'गल्लेबोरगाव'],
      },
      {
        id: 'soegaon',
        nameMr: 'सोयगाव',
        nameEn: 'Soegaon',
        villages: ['जरंडी', 'गालिबोरगाव', 'सावळदबारा'],
      },
      {
        id: 'phulambri',
        nameMr: 'फुलंब्री',
        nameEn: 'Phulambri',
        villages: ['वडोदबाजार', 'आळंद', 'गणोरी', 'पिंपळगाव गांगदेव'],
      },
    ],
  },

  // 9. Latur
  {
    id: 'latur',
    nameMr: 'लातूर',
    nameEn: 'Latur',
    priority: 9,
    talukas: [
      {
        id: 'latur_t',
        nameMr: 'लातूर',
        nameEn: 'Latur',
        villages: ['मुरुड', 'भादा', 'गातेगाव', 'गंगापूर', 'तांदुळजा'],
      },
      {
        id: 'ausa',
        nameMr: 'औसा',
        nameEn: 'Ausa',
        villages: ['किल्लारी', 'मातोळा', 'बेलकुंड', 'लामजना', 'आशोकनगर'],
      },
      {
        id: 'udgir',
        nameMr: 'उदगीर',
        nameEn: 'Udgir',
        villages: ['नाळगीर', 'हेरोळ', 'वाढवणा', 'देवरजन'],
      },
      {
        id: 'ahmedpur',
        nameMr: 'अहमदपूर',
        nameEn: 'Ahmedpur',
        villages: ['शिरूर ताजबंद', 'किनगाव', 'रुई', 'हडोळती'],
      },
      {
        id: 'nilanga',
        nameMr: 'निलंगा',
        nameEn: 'Nilanga',
        villages: ['कासार बालकुंदा', 'औराद शहाजानी', 'शिरूर अनंतपाळ परिसर'],
      },
      {
        id: 'chakur',
        nameMr: 'चाकूर',
        nameEn: 'Chakur',
        villages: ['नळेगाव', 'वडवळ नागनाथ', 'चापोली', 'लातूर रोड'],
      },
      {
        id: 'renapur',
        nameMr: 'रेणापूर',
        nameEn: 'Renapur',
        villages: ['पोहरेगाव', 'पानगाव', 'खरोळा', 'फावडेवाडी'],
      },
      {
        id: 'deoni',
        nameMr: 'देवणी',
        nameEn: 'Deoni',
        villages: ['बोरोळ', 'वलांडी', 'दवणहिप्परगा'],
      },
      {
        id: 'shirur_anantpal',
        nameMr: 'शिरूर अनंतपाळ',
        nameEn: 'Shirur Anantpal',
        villages: ['हिप्पळगाव', 'ताकळी', 'आनंदवाडी'],
      },
      {
        id: 'jalkot',
        nameMr: 'जळकोट',
        nameEn: 'Jalkot',
        villages: ['धर्मापुरी', 'घोणसी', 'अतनूर'],
      },
    ],
  },

  // 10. Dharashiv / Osmanabad
  {
    id: 'dharashiv',
    nameMr: 'धाराशिव (उस्मानाबाद)',
    nameEn: 'Dharashiv Osmanabad',
    priority: 10,
    talukas: [
      {
        id: 'dharashiv_t',
        nameMr: 'धाराशिव',
        nameEn: 'Dharashiv',
        villages: ['ढोकी', 'तेर', 'येडशी', 'पडोळी', 'उमरगा'],
      },
      {
        id: 'tuljapur',
        nameMr: 'तुळजापूर',
        nameEn: 'Tuljapur',
        villages: ['नळदुर्ग', 'काटी', 'सावरगाव', 'अणदूर', 'मंगरुळ'],
      },
      {
        id: 'omarga',
        nameMr: 'उमरगा',
        nameEn: 'Umarga',
        villages: ['मुरुम', 'दाळींब', 'येणेगूर', 'तुरोरी'],
      },
      {
        id: 'kalamb_dh',
        nameMr: 'कळंब',
        nameEn: 'Kalamb',
        villages: ['शिराढोण', 'मोहा', 'इटकूर', 'येरमाळा'],
      },
      {
        id: 'bhoom',
        nameMr: 'भूम',
        nameEn: 'Bhoom',
        villages: ['पाथरूड', 'वालवड', 'ईट', 'आंतरवली'],
      },
      {
        id: 'paranda',
        nameMr: 'परांडा',
        nameEn: 'Paranda',
        villages: ['अनाळा', 'जावळा', 'डोमगाव', 'आसोरे'],
      },
      {
        id: 'lohara',
        nameMr: 'लोहारा',
        nameEn: 'Lohara',
        villages: ['सास्तूर', 'जेवळी', 'काणेगाव', 'माकणी'],
      },
      {
        id: 'washi',
        nameMr: 'वाशी',
        nameEn: 'Washi',
        villages: ['तेरखेडा', 'सारोळा', 'पारा', 'मांडवा'],
      },
    ],
  },

  // 11. Beed
  {
    id: 'beed',
    nameMr: 'बीड',
    nameEn: 'Beed',
    priority: 11,
    talukas: [
      {
        id: 'beed_t',
        nameMr: 'बीड',
        nameEn: 'Beed',
        villages: ['मांजरसुंभा', 'पेठ बीड', 'पिंपळनेर', 'पालसिंगण'],
      },
      {
        id: 'georai',
        nameMr: 'गेवराई',
        nameEn: 'Georai',
        villages: ['पाचेगाव', 'उमापूर', 'तलवाडा', 'मादळमोही'],
      },
      {
        id: 'ambajogai',
        nameMr: 'अंबाजोगाई',
        nameEn: 'Ambajogai',
        villages: ['बर्दापूर', 'लोखंडी सावरगाव', 'घाटनांदूर'],
      },
      {
        id: 'parli',
        nameMr: 'परळी वैजनाथ',
        nameEn: 'Parli Vaijnath',
        villages: ['सिरसाळा', 'धर्मापुरी', 'नागापूर'],
      },
      {
        id: 'majalgaon',
        nameMr: 'माजलगाव',
        nameEn: 'Majalgaon',
        villages: ['किट्टी आडगाव', 'दिंद्रुड', 'पाथर्डी बु.'],
      },
      {
        id: 'ashti',
        nameMr: 'आष्टी',
        nameEn: 'Ashti',
        villages: ['कडा', 'धानोरा', 'पिंपळा'],
      },
      {
        id: 'kaij',
        nameMr: 'केज',
        nameEn: 'Kaij',
        villages: ['युसूफवडगाव', 'चिंचोली माळी', 'हणमंत पिंपरी'],
      },
      {
        id: 'patoda',
        nameMr: 'पाटोदा',
        nameEn: 'Patoda',
        villages: ['अमलनेर', 'सौताडा', 'वैद्यकिन्ही'],
      },
      {
        id: 'shirur_kasar',
        nameMr: 'शिरूर कासार',
        nameEn: 'Shirur Kasar',
        villages: ['तिंतरवणी', 'रायमोह', 'खलापुरी'],
      },
      {
        id: 'wadwani',
        nameMr: 'वडवणी',
        nameEn: 'Wadwani',
        villages: ['चिंचवटी', 'पुकी', 'कवडेवाडी'],
      },
      {
        id: 'dharur',
        nameMr: 'धारूर',
        nameEn: 'Dharur',
        villages: ['आडस', 'कासारी', 'चोरंबा'],
      },
    ],
  },

  // 12. Jalna
  {
    id: 'jalna',
    nameMr: 'जालना',
    nameEn: 'Jalna',
    priority: 12,
    talukas: [
      {
        id: 'jalna_t',
        nameMr: 'जालना',
        nameEn: 'Jalna',
        villages: ['नेर', 'माहोरा', 'वाडी शेवळी', 'शिरसवाडी'],
      },
      {
        id: 'partur',
        nameMr: 'परतूर',
        nameEn: 'Partur',
        villages: ['वाशी', 'अंबड परिसर', 'अष्टी'],
      },
      {
        id: 'ambad',
        nameMr: 'अंबड',
        nameEn: 'Ambad',
        villages: ['वडीगोद्री', 'शहागड', 'रोहिलागड'],
      },
      {
        id: 'bhokardan',
        nameMr: 'भोकरदन',
        nameEn: 'Bhokardan',
        villages: ['हसनाबाद', 'धाड', 'पिंपळगाव रेणुकाई'],
      },
      {
        id: 'badnapur',
        nameMr: 'बदनापूर',
        nameEn: 'Badnapur',
        villages: ['शेलगाव', 'रोशनगाव', 'दाभाडी'],
      },
      {
        id: 'jafrabad',
        nameMr: 'जाफ्राबाद',
        nameEn: 'Jafrabad',
        villages: ['महोरा', 'कुंभारझरी', 'टेभुर्णी'],
      },
      {
        id: 'ghansawangi',
        nameMr: 'घनसावंगी',
        nameEn: 'Ghansawangi',
        villages: ['तीर्थपुरी', 'राणीउंचेगाव', 'कुंभारपिंपळगाव'],
      },
      {
        id: 'mantha',
        nameMr: 'मंठा',
        nameEn: 'Mantha',
        villages: ['टाकळखोपा', 'पाटोदा', 'देवठाणा'],
      },
    ],
  },

  // 13. Nanded
  {
    id: 'nanded',
    nameMr: 'नांदेड',
    nameEn: 'Nanded',
    priority: 13,
    talukas: [
      {
        id: 'nanded_t',
        nameMr: 'नांदेड',
        nameEn: 'Nanded',
        villages: ['विष्णुपूरी', 'तुप्पा', 'कासराळी', 'तरोडा'],
      },
      {
        id: 'mudkhed',
        nameMr: 'मुदखेड',
        nameEn: 'Mudkhed',
        villages: ['मुगट', 'रोहिपिंपळगाव', 'शिरोवडी'],
      },
      {
        id: 'kandhar',
        nameMr: 'कंधार',
        nameEn: 'Kandhar',
        villages: ['पेठवडज', 'बारुळ', 'फुलवळ'],
      },
      {
        id: 'degloor',
        nameMr: 'देगलूर',
        nameEn: 'Degloor',
        villages: ['शहापूर', 'तमरलूर', 'करडखेड'],
      },
      {
        id: 'loha',
        nameMr: 'लोहा',
        nameEn: 'Loha',
        villages: ['माळाकोळी', 'शेवडी', 'सोनखेड'],
      },
      {
        id: 'hadgaon',
        nameMr: 'हदगाव',
        nameEn: 'Hadgaon',
        villages: ['मनाठा', 'तामसा', 'निवघा'],
      },
      {
        id: 'kinwat',
        nameMr: 'किनवट',
        nameEn: 'Kinwat',
        villages: ['बोधडी', 'मांडवी', 'इस्लापूर'],
      },
      {
        id: 'bhokar',
        nameMr: 'भोकर',
        nameEn: 'Bhokar',
        villages: ['मोघाळी', 'मातुल', 'किनी'],
      },
      {
        id: 'biloli',
        nameMr: 'बिलोली',
        nameEn: 'Biloli',
        villages: ['कुंडलवाडी', 'लोहगाव', 'दुरुग'],
      },
      {
        id: 'dharmabad',
        nameMr: 'धर्माबाद',
        nameEn: 'Dharmabad',
        villages: ['करखेली', 'येताळा', 'चिंचोली'],
      },
      {
        id: 'umri',
        nameMr: 'उमरी',
        nameEn: 'Umri',
        villages: ['गोळेगाव', 'शेलगाव', 'सिंधी'],
      },
      {
        id: 'mukhed',
        nameMr: 'मुखेड',
        nameEn: 'Mukhed',
        villages: ['जांब बुद्रुक', 'चांदोळा', 'येवती'],
      },
      {
        id: 'naigaon',
        nameMr: 'नायगाव (खैरगाव)',
        nameEn: 'Naigaon Khairgaon',
        villages: ['कुंटूर', 'तळबिड', 'सुगाव'],
      },
      {
        id: 'mahore',
        nameMr: 'माहूर',
        nameEn: 'Mahore',
        villages: ['दत्तशिखर परिसर', 'सिंदखेड', 'वानोली'],
      },
      {
        id: 'arapur',
        nameMr: 'अर्धापूर',
        nameEn: 'Ardhapur',
        villages: ['दाभड', 'लहान', 'शेलगाव'],
      },
      {
        id: 'himayatnagar',
        nameMr: 'हिमायतनगर',
        nameEn: 'Himayatnagar',
        villages: ['सरसम', 'पार्डी', 'वाघी'],
      },
    ],
  },

  // 14. Parbhani
  {
    id: 'parbhani',
    nameMr: 'परभणी',
    nameEn: 'Parbhani',
    priority: 14,
    talukas: [
      {
        id: 'parbhani_t',
        nameMr: 'परभणी',
        nameEn: 'Parbhani',
        villages: ['झरी', 'पिंगळी', 'ताडकळस', 'पेडगाव'],
      },
      {
        id: 'gangakhed',
        nameMr: 'गंगाखेड',
        nameEn: 'Gangakhed',
        villages: ['महातपुरी', 'माखणी', 'राणीसावरगाव'],
      },
      {
        id: 'jintur',
        nameMr: 'जिंतूर',
        nameEn: 'Jintur',
        villages: ['बांबोरी', 'चारठाणा', 'बोरी'],
      },
      {
        id: 'selu',
        nameMr: 'सेलू',
        nameEn: 'Selu',
        villages: ['वालूर', 'रावळगाव', 'कुपटा'],
      },
      {
        id: 'pathri',
        nameMr: 'पाथरी',
        nameEn: 'Pathri',
        villages: ['रेणापूर', 'बाभळगाव', 'कासापुरी'],
      },
      {
        id: 'manwath',
        nameMr: 'मानवत',
        nameEn: 'Manwath',
        villages: ['रुढी', 'मानवत रोड', 'कोल्हा'],
      },
      {
        id: 'sonpeth',
        nameMr: 'सोनपेठ',
        nameEn: 'Sonpeth',
        villages: ['वडगाव', 'शेळगाव', 'आवळगाव'],
      },
      {
        id: 'palam',
        nameMr: 'पालम',
        nameEn: 'Palam',
        villages: ['बनवस', 'चांडस', 'फळा'],
      },
      {
        id: 'purna',
        nameMr: 'पूर्णा',
        nameEn: 'Purna',
        villages: ['चुडावा', 'ताडकळस परिसर', 'काटेगाव'],
      },
    ],
  },

  // 15. Hingoli
  {
    id: 'hingoli',
    nameMr: 'हिंगोली',
    nameEn: 'Hingoli',
    priority: 15,
    talukas: [
      {
        id: 'hingoli_t',
        nameMr: 'हिंगोली',
        nameEn: 'Hingoli',
        villages: ['मंठा परिसर', 'नरसी नामदेव', 'वडद', 'सिरसम'],
      },
      {
        id: 'basmath',
        nameMr: 'वसमत',
        nameEn: 'Basmath',
        villages: ['कुरुंदा', 'हयातनगर', 'आंबा'],
      },
      {
        id: 'kalamnuri',
        nameMr: 'कलमनुरी',
        nameEn: 'Kalamnuri',
        villages: ['आखाडा बाळापूर', 'वारंगा', 'दांडेगाव'],
      },
      {
        id: 'aundha_nagnath',
        nameMr: 'औंढा नागनाथ',
        nameEn: 'Aundha Nagnath',
        villages: ['पिंपळदरी', 'येहळेगाव', 'सेंदूरसाना'],
      },
      {
        id: 'sengon',
        nameMr: 'सेनगाव',
        nameEn: 'Sengaon',
        villages: ['साखरा', 'गोरेगाव', 'खडकी'],
      },
    ],
  },

  // 16. Nagpur
  {
    id: 'nagpur',
    nameMr: 'नागपूर',
    nameEn: 'Nagpur',
    priority: 16,
    talukas: [
      {
        id: 'nagpur_rural',
        nameMr: 'नागपूर ग्रामीण',
        nameEn: 'Nagpur Rural',
        villages: ['वाडी', 'बुटीबोरी', 'बेसा', 'पिंपळा', 'हिंगणा परिसर'],
      },
      {
        id: 'katol',
        nameMr: 'काटोल',
        nameEn: 'Katol',
        villages: ['कोंढाळी', 'येनवा', 'मेटपांजरा', 'पारडसिंगा'],
      },
      {
        id: 'kalmeshwar',
        nameMr: 'कळमेश्वर',
        nameEn: 'Kalmeshwar',
        villages: ['धापेवाडा', 'मोहपा', 'ब्राह्मणी'],
      },
      {
        id: 'saoner',
        nameMr: 'सावनेर',
        nameEn: 'Saoner',
        villages: ['खापा', 'केळवद', 'वाळणी', 'पाटणसावंगी'],
      },
      {
        id: 'ramtek',
        nameMr: 'रामटेक',
        nameEn: 'Ramtek',
        villages: ['मनसर', 'नगरधन', 'काचूरवाही'],
      },
      {
        id: 'umred',
        nameMr: 'उमरेड',
        nameEn: 'Umred',
        villages: ['सिरसी', 'बेला', 'मकरधोकडा'],
      },
      {
        id: 'narkhed',
        nameMr: 'नरखेड',
        nameEn: 'Narkhed',
        villages: ['मोवाड', 'जलालखेडा', 'मेंढला'],
      },
      {
        id: 'kuhi',
        nameMr: 'कुही',
        nameEn: 'Kuhi',
        villages: ['मांढळ', 'तारसा', 'पचखेडी'],
      },
      {
        id: 'mauda',
        nameMr: 'मौदा',
        nameEn: 'Mauda',
        villages: ['तारसा', 'खात', 'निमखेडा'],
      },
      {
        id: 'bhiwapur',
        nameMr: 'भिवापूर',
        nameEn: 'Bhiwapur',
        villages: ['नांद', 'बेशूर', 'जवराबोडी'],
      },
      {
        id: 'parseoni',
        nameMr: 'पारशिवनी',
        nameEn: 'Parseoni',
        villages: ['कन्हान', 'पेंढरी', 'आमडी'],
      },
      {
        id: 'hingna',
        nameMr: 'हिंगणा',
        nameEn: 'Hingna',
        villages: ['डिगडोह', 'कान्होली', 'रायपूर'],
      },
      {
        id: 'kamthi',
        nameMr: 'कामठी',
        nameEn: 'Kamthi',
        villages: ['येरखेडा', 'आव्हाळी', 'वडोदा'],
      },
    ],
  },

  // 17. Amravati
  {
    id: 'amravati',
    nameMr: 'अमरावती',
    nameEn: 'Amravati',
    priority: 17,
    talukas: [
      {
        id: 'amravati_t',
        nameMr: 'अमरावती',
        nameEn: 'Amravati',
        villages: ['बडनेरा ग्रामीण', 'वालगाव', 'माहुली चोर', 'शिरभाता'],
      },
      {
        id: 'achlapur',
        nameMr: 'अचलपूर',
        nameEn: 'Achalpur',
        villages: ['परतवाडा ग्रामीण', 'शिरजगाव कसबा', 'पथ्रोट'],
      },
      {
        id: 'chandur_railway',
        nameMr: 'चांदूर रेल्वे',
        nameEn: 'Chandur Railway',
        villages: ['दीपावाडा', 'बगदी', 'चांदूर ग्रामीण'],
      },
      {
        id: 'morshi',
        nameMr: 'मोर्शी',
        nameEn: 'Morshi',
        villages: ['नेर पिंगळाई', 'रिद्धपूर', 'दामोधर'],
      },
      {
        id: 'warud',
        nameMr: 'वरुड',
        nameEn: 'Warud',
        villages: ['शेंदूरजना घाट', 'बेनोडा', 'जरुड'],
      },
      {
        id: 'daryapur',
        nameMr: 'दर्यापूर',
        nameEn: 'Daryapur',
        villages: ['येवदा', 'बनासा', 'खल्लार'],
      },
      {
        id: 'anjan_gaon',
        nameMr: 'अंजनगाव सुर्जी',
        nameEn: 'Anjangaon Surji',
        villages: ['पांढरी', 'विहीगाव', 'सातेगाव'],
      },
      {
        id: 'tiosa',
        nameMr: 'तिवसा',
        nameEn: 'Tiosa',
        villages: ['गुरुकुंज मोझरी', 'शेंदूरजना बाजार', 'वरखेड'],
      },
      {
        id: 'dhamangaon_railway',
        nameMr: 'धामणगाव रेल्वे',
        nameEn: 'Dhamangaon Railway',
        villages: ['तळेगाव दशासर', 'अंजणसिंगी', 'मंगरुळ दस्तगीर'],
      },
    ],
  },

  // 18. Jalgaon
  {
    id: 'jalgaon',
    nameMr: 'जळगाव',
    nameEn: 'Jalgaon',
    priority: 18,
    talukas: [
      {
        id: 'jalgaon_t',
        nameMr: 'जळगाव',
        nameEn: 'Jalgaon',
        villages: ['कुसुंबा', 'नशिराबाद', 'कानळदा', 'ममुराबाद'],
      },
      {
        id: 'bhusawal',
        nameMr: 'भुसावळ',
        nameEn: 'Bhusawal',
        villages: ['वरणगाव', 'दीपनगर', 'कंडारी', 'साकेगाव'],
      },
      {
        id: 'chopda',
        nameMr: 'चोपडा',
        nameEn: 'Chopda',
        villages: ['अडावद', 'हातेड', 'वैजापूर', 'गोरगावले'],
      },
      {
        id: 'pachora',
        nameMr: 'पाचोरा',
        nameEn: 'Pachora',
        villages: ['पिंपळगाव हरेश्वर', 'नांद्रा', 'वडगाव'],
      },
      {
        id: 'raver',
        nameMr: 'रावेर',
        nameEn: 'Raver',
        villages: ['सावदा', 'फैजपूर ग्रामीण', 'खिरोदा'],
      },
      {
        id: 'chalisgaon',
        nameMr: 'चाळीसगाव',
        nameEn: 'Chalisgaon',
        villages: ['मेहुणबारे', 'पाटणादेवी परिसर', 'बहाळ', 'वडगाव लोंढे'],
      },
      {
        id: 'jamner',
        nameMr: 'जामनेर',
        nameEn: 'Jamner',
        villages: ['शेंदुर्णी', 'पहूर', 'नेरी', 'फत्तेपूर'],
      },
      {
        id: 'yawal',
        nameMr: 'यावल',
        nameEn: 'Yawal',
        villages: ['साकळी', 'भालोद', 'फैजपूर परिसर', 'दहिगाव'],
      },
      {
        id: 'amalner',
        nameMr: 'अमळनेर',
        nameEn: 'Amalner',
        villages: ['मारवड', 'शिरुड', 'पातोंडा', 'भरवस'],
      },
    ],
  },

  // 19. Dhule
  {
    id: 'dhule',
    nameMr: 'धुळे',
    nameEn: 'Dhule',
    priority: 19,
    talukas: [
      {
        id: 'dhule_t',
        nameMr: 'धुळे',
        nameEn: 'Dhule',
        villages: ['कुसुंबा', 'मोहाडी', 'सोनगीर', 'लामी', 'नगाव'],
      },
      {
        id: 'sakri',
        nameMr: 'साक्री',
        nameEn: 'Sakri',
        villages: ['पिंपळनेर', 'दहीवेल', 'निजामपूर', 'छडवेल'],
      },
      {
        id: 'shirpur',
        nameMr: 'शिरपूर',
        nameEn: 'Shirpur',
        villages: ['बोराडी', 'थाळनेर', 'होलनांथे', 'वाघाडी'],
      },
      {
        id: 'shindkheda',
        nameMr: 'शिंदखेडा',
        nameEn: 'Shindkheda',
        villages: ['नरडाणा', 'दोंडाईचा ग्रामीण', 'वरवडे', 'चिम्ठाणे'],
      },
    ],
  },

  // 20. Nandurbar
  {
    id: 'nandurbar',
    nameMr: 'नंदुरबार',
    nameEn: 'Nandurbar',
    priority: 20,
    talukas: [
      {
        id: 'nandurbar_t',
        nameMr: 'नंदुरबार',
        nameEn: 'Nandurbar',
        villages: ['कोपर्ली', 'वाघोदा', 'धनाजी', 'रानळा'],
      },
      {
        id: 'shahada',
        nameMr: 'शहादा',
        nameEn: 'Shahada',
        villages: ['सारंगखेडा', 'म्हसवड', 'लोणखेडा', 'कुकरमुंडा'],
      },
      {
        id: 'navapur',
        nameMr: 'नवापूर',
        nameEn: 'Navapur',
        villages: ['खांडबारा', 'चिंचपाडा', 'विसरवाडी'],
      },
      {
        id: 'taloda',
        nameMr: 'तळोदा',
        nameEn: 'Taloda',
        villages: ['बोरद', 'सोमवल', 'प्रतापपूर'],
      },
      {
        id: 'akkalkuwa',
        nameMr: 'अक्कलकुवा',
        nameEn: 'Akkalkuwa',
        villages: ['मोलगी', 'खापर', 'सोरापाडा'],
      },
      {
        id: 'dhadgaon',
        nameMr: 'धडगाव (अक्राणी)',
        nameEn: 'Dhadgaon Akrani',
        villages: ['रोशमाळ', 'तोरणमाळ परिसर', 'मांडवी'],
      },
    ],
  },

  // 21. Akola
  {
    id: 'akola',
    nameMr: 'अकोला',
    nameEn: 'Akola',
    priority: 21,
    talukas: [
      {
        id: 'akola_t',
        nameMr: 'अकोला',
        nameEn: 'Akola',
        villages: ['उमरी', 'शिवणी', 'कौळखेड', 'बोरगाव मंजू'],
      },
      {
        id: 'akot',
        nameMr: 'अकोट',
        nameEn: 'Akot',
        villages: ['अकोलखेड', 'चोहोट्टा बाजार', 'हिवरखेड'],
      },
      {
        id: 'balapur',
        nameMr: 'बाळापूर',
        nameEn: 'Balapur',
        villages: ['उरळ', 'पारस', 'वाडेगाव'],
      },
      {
        id: 'murtijapur',
        nameMr: 'मूर्तिजापूर',
        nameEn: 'Murtijapur',
        villages: ['माना', 'हातरुण', 'सिरसो'],
      },
      {
        id: 'patur',
        nameMr: 'पातूर',
        nameEn: 'Patur',
        villages: ['बाभूळगाव', 'चांदूर', 'आलेगाव'],
      },
      {
        id: 'telhara',
        nameMr: 'तेल्हारा',
        nameEn: 'Telhara',
        villages: ['अडगाव', 'माळेगाव', 'हिवरखेड परिसर'],
      },
      {
        id: 'barshitakli',
        nameMr: 'बार्शीटाकळी',
        nameEn: 'Barshitakli',
        villages: ['महान', 'पिंजर', 'खेड'],
      },
    ],
  },

  // 22. Buldhana
  {
    id: 'buldhana',
    nameMr: 'बुलढाणा',
    nameEn: 'Buldhana',
    priority: 22,
    talukas: [
      {
        id: 'buldhana_t',
        nameMr: 'बुलढाणा',
        nameEn: 'Buldhana',
        villages: ['धाड', 'रायपूर', 'साखळी बु.'],
      },
      {
        id: 'chikhli',
        nameMr: 'चिखली',
        nameEn: 'Chikhli',
        villages: ['अंधेरा', 'उंद्री', 'मेरा बु.'],
      },
      {
        id: 'khamgaon',
        nameMr: 'खामगाव',
        nameEn: 'Khamgaon',
        villages: ['शेगाव रोड', 'पिंपळगाव राजा', 'आतापूर'],
      },
      {
        id: 'shegaon',
        nameMr: 'शेगाव',
        nameEn: 'Shegaon',
        villages: ['जलंब', 'टाकळी हाते', 'माटरगाव'],
      },
      {
        id: 'malkapur_bu',
        nameMr: 'मलकापूर',
        nameEn: 'Malkapur',
        villages: ['धरणगाव', 'वाघोड', 'दासखेड'],
      },
      {
        id: 'mehkar',
        nameMr: 'मेहकर',
        nameEn: 'Mehkar',
        villages: ['जानेफळ', 'डोणगाव', 'विश्वी'],
      },
      {
        id: 'sindkhed_raja',
        nameMr: 'सिंदखेड राजा',
        nameEn: 'Sindkhed Raja',
        villages: ['किनगाव राजा', 'साखरखेर्डा', 'दुसरबीड'],
      },
    ],
  },

  // 23. Washim
  {
    id: 'washim',
    nameMr: 'वाशिम',
    nameEn: 'Washim',
    priority: 23,
    talukas: [
      {
        id: 'washim_t',
        nameMr: 'वाशिम',
        nameEn: 'Washim',
        villages: ['केकतउमरा', 'सावरगाव', 'शिरपूर जैन'],
      },
      {
        id: 'risod',
        nameMr: 'रिसोड',
        nameEn: 'Risod',
        villages: ['शेलूबाजार', 'गोवर्धन', 'मोप'],
      },
      {
        id: 'malegaon_wa',
        nameMr: 'मालेगाव (वाशिम)',
        nameEn: 'Malegaon Washim',
        villages: ['शिरपूर', 'मेहा', 'कळंबेश्वर'],
      },
      {
        id: 'karanja',
        nameMr: 'कारंजा लाड',
        nameEn: 'Karanja Lad',
        villages: ['मानोरा रोड', 'काटफळ', 'उमर्डा'],
      },
      {
        id: 'mangrulpir',
        nameMr: 'मंगरुळपीर',
        nameEn: 'Mangrulpir',
        villages: ['शेलूबाजार परिसर', 'कवठळ', 'धानोरा'],
      },
      {
        id: 'manora',
        nameMr: 'मानोरा',
        nameEn: 'Manora',
        villages: ['पोहरादेवी', 'इंझोरी', 'रुई'],
      },
    ],
  },

  // 24. Yavatmal
  {
    id: 'yavatmal',
    nameMr: 'यवतमाळ',
    nameEn: 'Yavatmal',
    priority: 24,
    talukas: [
      {
        id: 'yavatmal_t',
        nameMr: 'यवतमाळ',
        nameEn: 'Yavatmal',
        villages: ['लोहारा', 'चांदूर', 'आर्णी रोड', 'मोहा'],
      },
      {
        id: 'pusad',
        nameMr: 'पुसद',
        nameEn: 'Pusad',
        villages: ['काटी', 'शेंबाळपिंपरी', 'फुलसावंगी'],
      },
      {
        id: 'umerkhed',
        nameMr: 'उमरखेड',
        nameEn: 'Umerkhed',
        villages: ['ढाणकी', 'मार्डा', 'विडूळ'],
      },
      {
        id: 'digras',
        nameMr: 'दिग्रस',
        nameEn: 'Digras',
        villages: ['सिंगद', 'देवळा', 'कळंब परिसर'],
      },
      {
        id: 'wani',
        nameMr: 'वणी',
        nameEn: 'Wani',
        villages: ['रासा', 'शिरपूर', 'मारेगाव परिसर'],
      },
      {
        id: 'darwha',
        nameMr: 'दारव्हा',
        nameEn: 'Darwha',
        villages: ['लाडखेड', 'महागाव', 'तपोना'],
      },
      {
        id: 'arni',
        nameMr: 'आर्णी',
        nameEn: 'Arni',
        villages: ['माहूर रोड', 'दाभडी', 'अकोला बाजार'],
      },
      {
        id: 'pandharkawada',
        nameMr: 'पांढरकवडा (केळापूर)',
        nameEn: 'Pandharkawada Kelapur',
        villages: ['पाटणबोरी', 'मुकूटबन', 'करंजी'],
      },
    ],
  },

  // 25. Wardha
  {
    id: 'wardha',
    nameMr: 'वर्धा',
    nameEn: 'Wardha',
    priority: 25,
    talukas: [
      {
        id: 'wardha_t',
        nameMr: 'वर्धा',
        nameEn: 'Wardha',
        villages: ['सेवाग्राम', 'पवनार', 'वरुड', 'वायगाव निपाणी'],
      },
      {
        id: 'deoli',
        nameMr: 'देवळी',
        nameEn: 'Deoli',
        villages: ['अंजनगाव', 'भिदी', 'रोहणा'],
      },
      {
        id: 'hinganghat',
        nameMr: 'हिंगणघाट',
        nameEn: 'Hinganghat',
        villages: ['वडनेर', 'पोहोणा', 'कान्हापूर'],
      },
      {
        id: 'arvi',
        nameMr: 'आर्वी',
        nameEn: 'Arvi',
        villages: ['रोहणा', 'खरांगणा', 'विराणी'],
      },
      {
        id: 'seloo',
        nameMr: 'सेलू',
        nameEn: 'Seloo',
        villages: ['झडशी', 'हिंगणी', 'रेहकी'],
      },
    ],
  },

  // 26. Chandrapur
  {
    id: 'chandrapur',
    nameMr: 'चंद्रपूर',
    nameEn: 'Chandrapur',
    priority: 26,
    talukas: [
      {
        id: 'chandrapur_t',
        nameMr: 'चंद्रपूर',
        nameEn: 'Chandrapur',
        villages: ['दुर्गापूर', 'पडोली', 'घुग्गुस', 'तडोबा परिसर'],
      },
      {
        id: 'warora',
        nameMr: 'वरोरा',
        nameEn: 'Warora',
        villages: ['आनंदवन', 'माढेळी', 'शेगाव बु.'],
      },
      {
        id: 'bhadrawati',
        nameMr: 'भद्रावती',
        nameEn: 'Bhadrawati',
        villages: ['माजरी', 'चंदनखेडा', 'मुगळी'],
      },
      {
        id: 'ballarpur',
        nameMr: 'बल्लारपूर',
        nameEn: 'Ballarpur',
        villages: ['बामणी', 'विसापूर', 'मानोरा'],
      },
      {
        id: 'rajura',
        nameMr: 'राजुरा',
        nameEn: 'Rajura',
        villages: ['गडचांदूर', 'कोरपना परिसर', 'विरूर'],
      },
      {
        id: 'brahmapuri',
        nameMr: 'ब्रह्मपुरी',
        nameEn: 'Brahmapuri',
        villages: ['मेंडकी', 'नांदगाव', 'चौगान'],
      },
    ],
  },

  // 27. Bhandara
  {
    id: 'bhandara',
    nameMr: 'भंडारा',
    nameEn: 'Bhandara',
    priority: 27,
    talukas: [
      {
        id: 'bhandara_t',
        nameMr: 'भंडारा',
        nameEn: 'Bhandara',
        villages: ['शहापूर', 'बेला', 'कारधा', 'पवनी रोड'],
      },
      {
        id: 'tumsar',
        nameMr: 'तुमसर',
        nameEn: 'Tumsar',
        villages: ['सिहोरा', 'माडगी', 'खापा'],
      },
      {
        id: 'pauni',
        nameMr: 'पवनी',
        nameEn: 'Pauni',
        villages: ['कोंढा', 'अड्याळ', 'उमरेड परिसर'],
      },
      {
        id: 'sakoli',
        nameMr: 'साकोली',
        nameEn: 'Sakoli',
        villages: ['सानगडी', 'लखांदूर रोड', 'सेंदूरवाफा'],
      },
    ],
  },

  // 28. Gondia
  {
    id: 'gondia',
    nameMr: 'गोंदिया',
    nameEn: 'Gondia',
    priority: 28,
    talukas: [
      {
        id: 'gondia_t',
        nameMr: 'गोंदिया',
        nameEn: 'Gondia',
        villages: ['कुडवा', 'खमारी', 'काटी', 'दासगाव'],
      },
      {
        id: 'tirora',
        nameMr: 'तिरोरा',
        nameEn: 'Tirora',
        villages: ['काचेवानी', 'सुकाडी', 'बोदरा'],
      },
      {
        id: 'goregaon_go',
        nameMr: 'गोरेगाव',
        nameEn: 'Goregaon',
        villages: ['बबई', 'मोहाडी', 'हिरडामळी'],
      },
      {
        id: 'arjoni_morgaon',
        nameMr: 'अर्जुनी मोरगाव',
        nameEn: 'Arjuni Morgaon',
        villages: ['नवेगाव बांध', 'महागाव', 'इटियाडोह'],
      },
    ],
  },

  // 29. Gadchiroli
  {
    id: 'gadchiroli',
    nameMr: 'गडचिरोली',
    nameEn: 'Gadchiroli',
    priority: 29,
    talukas: [
      {
        id: 'gadchiroli_t',
        nameMr: 'गडचिरोली',
        nameEn: 'Gadchiroli',
        villages: ['पोर्ला', 'कोर्ची', 'आर्मोरी परिसर'],
      },
      {
        id: 'armori',
        nameMr: 'आर्मोरी',
        nameEn: 'Armori',
        villages: ['वैरागड', 'वडधा', 'देऊळगाव'],
      },
      {
        id: 'chamorshi',
        nameMr: 'चामोर्शी',
        nameEn: 'Chamorshi',
        villages: ['आष्टी', 'तळोधी', 'घोट'],
      },
      {
        id: 'aheri',
        nameMr: 'अहेरी',
        nameEn: 'Aheri',
        villages: ['आलापल्ली', 'कमलापूर', 'रेपनपल्ली'],
      },
    ],
  },

  // 30. Raigad
  {
    id: 'raigad',
    nameMr: 'रायगड (अलिबाग)',
    nameEn: 'Raigad Alibag',
    priority: 30,
    talukas: [
      {
        id: 'alibag',
        nameMr: 'अलिबाग',
        nameEn: 'Alibag',
        villages: ['चौल', 'रेवदंडा', 'किहीम', 'मांडवा'],
      },
      {
        id: 'panvel',
        nameMr: 'पनवेल',
        nameEn: 'Panvel',
        villages: ['कळंबोली ग्रामीण', 'वावेघर', 'नेरे', 'तळोजा ग्रामीण'],
      },
      {
        id: 'pen',
        nameMr: 'पेण',
        nameEn: 'Pen',
        villages: ['वडखळ', 'दादर', 'हमीरापूर', 'कार्ले'],
      },
      {
        id: 'roha',
        nameMr: 'रोहा',
        nameEn: 'Roha',
        villages: ['कोलाड', 'नागोठणे', 'धाटाव'],
      },
      {
        id: 'mahad',
        nameMr: 'महाड',
        nameEn: 'Mahad',
        villages: ['नाते', 'वरंध', 'बिरवाडी'],
      },
      {
        id: 'mangaon',
        nameMr: 'माणगाव',
        nameEn: 'Mangaon',
        villages: ['इंदापूर (रायगड)', 'गोरेगाव', 'लोणेरे'],
      },
      {
        id: 'karjat_rai',
        nameMr: 'कर्जत (रायगड)',
        nameEn: 'Karjat Raigad',
        villages: ['नेरळ', 'कशेळे', 'कडाव'],
      },
    ],
  },

  // 31. Ratnagiri
  {
    id: 'ratnagiri',
    nameMr: 'रत्नागिरी',
    nameEn: 'Ratnagiri',
    priority: 31,
    talukas: [
      {
        id: 'ratnagiri_t',
        nameMr: 'रत्नागिरी',
        nameEn: 'Ratnagiri',
        villages: ['मिर्या', 'शिरगाव', 'नाचणे', 'पावस'],
      },
      {
        id: 'chiplun',
        nameMr: 'चिपळूण',
        nameEn: 'Chiplun',
        villages: ['खेर्डी', 'रामपूर', 'शिरगाव', 'सावर्डे'],
      },
      {
        id: 'khed_rt',
        nameMr: 'खेड',
        nameEn: 'Khed',
        villages: ['भरणे', 'लोटे परशुराम', 'शिरशी'],
      },
      {
        id: 'dapoli',
        nameMr: 'दापोली',
        nameEn: 'Dapoli',
        villages: ['आंजर्ले', 'हर्णे', 'मुरुड', 'केळशी'],
      },
      {
        id: 'sangameshwar',
        nameMr: 'संगमेश्वर',
        nameEn: 'Sangameshwar',
        villages: ['देवरुख', 'कसबा', 'माखजन', 'आरवली'],
      },
      {
        id: 'rajapur',
        nameMr: 'राजापूर',
        nameEn: 'Rajapur',
        villages: ['नाते', 'ओणी', 'पाचळ', 'जैतापूर'],
      },
      {
        id: 'guhagar',
        nameMr: 'गुहागर',
        nameEn: 'Guhagar',
        villages: ['शृंगारतळी', 'असनगोळी', 'हेदवी'],
      },
    ],
  },

  // 32. Sindhudurg
  {
    id: 'sindhudurg',
    nameMr: 'सिंधुदुर्ग (ओरोस)',
    nameEn: 'Sindhudurg Oros',
    priority: 32,
    talukas: [
      {
        id: 'kudal',
        nameMr: 'कुडाळ',
        nameEn: 'Kudal',
        villages: ['ओरोस बु.', 'पिंगुळी', 'नेरूर', 'माणगाव'],
      },
      {
        id: 'kankavli',
        nameMr: 'कणकवली',
        nameEn: 'Kankavli',
        villages: ['नांदगाव', 'फोंडाघाट', 'तळेरे', 'कळसुली'],
      },
      {
        id: 'sawantwadi',
        nameMr: 'सावंतवाडी',
        nameEn: 'Sawantwadi',
        villages: ['मादाखोल', 'बांदा', 'मजगाव', 'इन्सुली'],
      },
      {
        id: 'malvan',
        nameMr: 'मालवण',
        nameEn: 'Malvan',
        villages: ['तारकर्ली', 'वायरी', 'देवबाग', 'धामापूर'],
      },
      {
        id: 'vengurla',
        nameMr: 'वेंगुर्ला',
        nameEn: 'Vengurla',
        villages: ['शिरोडा', 'रेडी', 'उभादांडा', 'आरोंदा'],
      },
      {
        id: 'devgad',
        nameMr: 'देवगड',
        nameEn: 'Devgad',
        villages: ['जामसंडे', 'मिठबांव', 'विजयदुर्ग', 'नाडगाव'],
      },
      {
        id: 'vaibhavwadi',
        nameMr: 'वैभववाडी',
        nameEn: 'Vaibhavwadi',
        villages: ['भुईबावडा', 'एडगाव', 'नापणे'],
      },
      {
        id: 'dodamarg',
        nameMr: 'दोडामार्ग',
        nameEn: 'Dodamarg',
        villages: ['भेडशी', 'कुडासे', 'मणेरी'],
      },
    ],
  },

  // 33. Thane
  {
    id: 'thane',
    nameMr: 'ठाणे',
    nameEn: 'Thane',
    priority: 33,
    talukas: [
      {
        id: 'kalyan',
        nameMr: 'कल्याण (ग्रामीण)',
        nameEn: 'Kalyan Rural',
        villages: ['टिटवाळा', 'कांबा', 'गोवेली', 'शहाड ग्रामीण'],
      },
      {
        id: 'bhiwandi',
        nameMr: 'भिवंडी (ग्रामीण)',
        nameEn: 'Bhiwandi Rural',
        villages: ['पडघा', 'अंबाजी', 'दुधनी', 'चिंचवली'],
      },
      {
        id: 'shahapur',
        nameMr: 'शहापूर',
        nameEn: 'Shahapur',
        villages: ['आसनगाव', 'किन्हवली', 'डोळखांब', 'वासिंद'],
      },
      {
        id: 'murbad',
        nameMr: 'मुरबाड',
        nameEn: 'Murbad',
        villages: ['सरळगाव', 'टोकावडे', 'म्हासा', 'शिवळे'],
      },
      {
        id: 'ambernath_r',
        nameMr: 'अंबरनाथ (ग्रामीण)',
        nameEn: 'Ambernath Rural',
        villages: ['बदलापूर ग्रामीण', 'वांगणी', 'कांजूर'],
      },
    ],
  },

  // 34. Palghar
  {
    id: 'palghar',
    nameMr: 'पालघर',
    nameEn: 'Palghar',
    priority: 34,
    talukas: [
      {
        id: 'palghar_t',
        nameMr: 'पालघर',
        nameEn: 'Palghar',
        villages: ['मनोर', 'बोईसर ग्रामीण', 'केळवे', 'सफाळे'],
      },
      {
        id: 'dahanu',
        nameMr: 'डहाणू',
        nameEn: 'Dahanu',
        villages: ['घोलवड', 'बोर्डी', 'कासा', 'सायवन'],
      },
      {
        id: 'wada',
        nameMr: 'वाडा',
        nameEn: 'Wada',
        villages: ['कुडुस', 'उचाट', 'परळी'],
      },
      {
        id: 'jawhar',
        nameMr: 'जव्हार',
        nameEn: 'Jawhar',
        villages: ['झाप', 'न्यासपूर', 'धानोशी'],
      },
      {
        id: 'mokhada',
        nameMr: 'मोखाडा',
        nameEn: 'Mokhada',
        villages: ['खोडाळा', 'पोशेरा', 'साखरे'],
      },
      {
        id: 'vikramgad',
        nameMr: 'विक्रमगड',
        nameEn: 'Vikramgad',
        villages: ['ओंदे', 'मलवाडा', 'साखरे'],
      },
      {
        id: 'talaasari',
        nameMr: 'तलासरी',
        nameEn: 'Talasari',
        villages: ['उधवा', 'झाई', 'संभा'],
      },
    ],
  },

  // 35. Mumbai Suburban
  {
    id: 'mumbai_suburban',
    nameMr: 'मुंबई उपनगर',
    nameEn: 'Mumbai Suburban',
    priority: 35,
    talukas: [
      {
        id: 'borivali',
        nameMr: 'बोरिवली परिसर',
        nameEn: 'Borivali Rural',
        villages: ['गोराई', 'उत्तन परिसर', 'मनोरी'],
      },
    ],
  },

  // 36. Mumbai City
  {
    id: 'mumbai_city',
    nameMr: 'मुंबई शहर',
    nameEn: 'Mumbai City',
    priority: 36,
    talukas: [
      {
        id: 'mumbai_c',
        nameMr: 'मुंबई मध्यवर्ती',
        nameEn: 'Mumbai Central',
        villages: ['दादर परिसर', 'भायखळा परिसर'],
      },
    ],
  },
];
