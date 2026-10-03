// Dynamic Date & Solapur APMC Market Session Utility

export const MARATHI_MONTHS = [
  'जानेवारी',
  'फेब्रुवारी',
  'मार्च',
  'एप्रिल',
  'मे',
  'जून',
  'जुलै',
  'ऑगस्ट',
  'सप्टेंबर',
  'ऑक्टोबर',
  'नोव्हेंबर',
  'डिसेंबर',
];

/**
 * Returns clean Marathi formatted date: "दि. [Day] [Marathi Month Name], [Year]"
 * e.g., "दि. ३ ऑक्टोबर, २०२६" or dynamic current date
 */
export function getFormattedMarathiDate(date = new Date()) {
  const day = date.getDate();
  const monthName = MARATHI_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `दि. ${day} ${monthName}, ${year}`;
}

/**
 * Returns dynamic Solapur APMC market session based on current hour:
 * - Before 12:00 PM: "ताजी सकाळ आवक सत्र (Morning Session)"
 * - 12:00 PM to 4:00 PM: "दुपार ई-लिलाव सत्र (Noon Auction Session)"
 * - After 4:00 PM: "अंतिम दैनिक बंद बाजारभाव (Closing Session)"
 */
export function getMarketSessionInfo(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return {
      sessionName: 'ताजी सकाळ आवक सत्र (Morning Session)',
      shortSession: 'सकाळ आवक सत्र',
      statusText: 'थेट सकाळ लिलाव सुरू',
      isLive: true,
      timeSlot: 'सकाळी ६:०० ते १२:००',
    };
  } else if (hour < 16) {
    return {
      sessionName: 'दुपार ई-लिलाव सत्र (Noon Auction Session)',
      shortSession: 'दुपार लिलाव सत्र',
      statusText: 'थेट ई-लिलाव बोली सुरू',
      isLive: true,
      timeSlot: 'दुपारी १२:०० ते ४:००',
    };
  } else {
    return {
      sessionName: 'अंतिम दैनिक बंद बाजारभाव (Closing Session)',
      shortSession: 'दैनिक बंद भाव',
      statusText: 'अंतिम दर नोंदणीकृत',
      isLive: false,
      timeSlot: 'संध्याकाळी ४:०० नंतर',
    };
  }
}

/**
 * Combined dynamic header string: "🕒 दि. [Date] | [Session Name]"
 */
export function getDynamicMarketHeaderStatus(date = new Date()) {
  const dateStr = getFormattedMarathiDate(date);
  const session = getMarketSessionInfo(date);
  return `${dateStr} | ${session.sessionName}`;
}
