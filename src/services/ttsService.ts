// Remove emojis from text for TTS
function removeEmojis(text: string): string {
  // Remove emoji and other symbols using Unicode ranges
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation Selectors
    .trim()
    .replace(/\s+/g, ' '); // Clean up extra spaces
}

// Common abbreviations and their spoken forms
const ABBREVIATIONS: Record<string, string> = {
  // Common tech/DIY abbreviations
  'etc.': 'etcetera',
  'vs.': 'versus',
  'vs': 'versus',
  'e.g.': 'for example',
  'i.e.': 'that is',
  'DIY': 'D I Y',
  'LED': 'L E D',
  'USB': 'U S B',
  'HDMI': 'H D M I',
  'WiFi': 'Wi Fi',
  'wifi': 'Wi Fi',
  'RAM': 'RAM',
  'CPU': 'C P U',
  'GPU': 'G P U',
  'HTML': 'H T M L',
  'CSS': 'C S S',
  'API': 'A P I',
  'URL': 'U R L',
  'PDF': 'P D F',
  'PSI': 'P S I',
  'RPM': 'R P M',
  'MPH': 'M P H',
  'AC': 'A C',
  'DC': 'D C',
  'HVAC': 'H V A C',
  'TV': 'T V',
  'DVD': 'D V D',
  'CD': 'C D',
  // Common units
  'lbs': 'pounds',
  'oz': 'ounces',
  'ft': 'feet',
  'in': 'inches',
  'mm': 'millimeters',
  'cm': 'centimeters',
  'kg': 'kilograms',
};

// Convert numbers to words for better pronunciation (0-20)
const NUMBER_WORDS: string[] = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen', 'twenty'
];

// Convert number to word (for small numbers)
function numberToWord(num: number): string {
  if (num >= 0 && num <= 20) {
    return NUMBER_WORDS[num];
  }
  return num.toString();
}

// Expand abbreviations in text
function expandAbbreviations(text: string): string {
  let expanded = text;
  
  // Replace abbreviations (using word boundaries to avoid partial matches)
  for (const [abbr, expansion] of Object.entries(ABBREVIATIONS)) {
    const regex = new RegExp(`\\b${abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    expanded = expanded.replace(regex, expansion);
  }
  
  return expanded;
}

// Improve number pronunciation
function improveNumbers(text: string): string {
  // Convert standalone numbers 0-20 to words
  return text.replace(/\b(\d{1,2})\b/g, (match, numStr) => {
    const num = parseInt(numStr, 10);
    if (num >= 0 && num <= 20) {
      return numberToWord(num);
    }
    // For larger numbers, format them better (e.g., 1000 -> 1 thousand)
    if (num >= 1000 && num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      if (remainder === 0) {
        return `${numberToWord(thousands)} thousand`;
      }
    }
    return match; // Keep original for complex numbers
  });
}

// Handle special characters and symbols
function cleanSpecialCharacters(text: string): string {
  return text
    .replace(/["`]/g, '') // Remove double quotes and backticks (keep apostrophes for contractions)
    .replace(/\([^)]*\)/g, '') // Remove parentheses and their content (for TTS)
    .replace(/[()[\]{}]/g, '') // Remove any remaining brackets (shouldn't be any, but just in case)
    .replace(/…/g, '...') // Convert ellipsis to periods
    .replace(/–|—/g, '-') // Convert em/en dashes to hyphens
    .replace(/©|®|™/g, '') // Remove copyright symbols
    .replace(/&/g, 'and') // Convert & to "and"
    .replace(/@/g, 'at') // Convert @ to "at"
    .replace(/#/g, 'number') // Convert # to "number"
    .replace(/\$/g, 'dollars') // Convert $ to "dollars"
    .replace(/%/g, 'percent') // Convert % to "percent"
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .trim();
}

// Clean text and add SSML pauses for natural speech
function prepareTextForTTS(text: string): string {
  // Step 1: Expand abbreviations
  let cleaned = expandAbbreviations(text);
  
  // Step 2: Improve number pronunciation
  cleaned = improveNumbers(cleaned);
  
  // Step 3: Clean special characters
  cleaned = cleanSpecialCharacters(cleaned);
  
  // Step 4: Add SSML pauses after punctuation for natural speech flow
  cleaned = cleaned
    .replace(/\./g, '.<break time="500ms"/>') // 500ms pause after periods
    .replace(/,/g, ',<break time="300ms"/>') // 300ms pause after commas
    .replace(/!/g, '!<break time="500ms"/>') // 500ms pause after exclamations
    .replace(/\?/g, '?<break time="500ms"/>') // 500ms pause after questions
    .replace(/;/g, ';<break time="400ms"/>') // 400ms pause after semicolons
    .replace(/:/g, ':<break time="300ms"/>'); // 300ms pause after colons
  
  // Wrap in SSML speak tag
  return `<speak>${cleaned}</speak>`;
}

export async function textToSpeech(text: string): Promise<string> {
  try {
    // Remove emojis and prepare text with SSML pauses
    let cleanText = removeEmojis(text);
    cleanText = prepareTextForTTS(cleanText);
    
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: cleanText }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.audioUrl;
  } catch (error) {
    console.error('Failed to generate speech:', error);
    throw error;
  }
}

// Audio cache to avoid regenerating the same audio
const audioCache = new Map<string, string>();

export async function getCachedAudio(text: string): Promise<string> {
  if (audioCache.has(text)) {
    return audioCache.get(text)!;
  }

  const audioUrl = await textToSpeech(text);
  audioCache.set(text, audioUrl);
  return audioUrl;
}

export function clearAudioCache(): void {
  audioCache.clear();
}

