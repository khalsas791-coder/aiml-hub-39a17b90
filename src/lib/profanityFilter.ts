// Common profanity/vulgar word list for filtering
// This is a basic list - can be extended as needed
const PROFANITY_LIST = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'bastard', 'crap', 'dick', 'cock',
  'pussy', 'cunt', 'whore', 'slut', 'fag', 'nigger', 'nigga', 'retard',
  'porn', 'sex', 'xxx', 'nude', 'naked', 'boob', 'tits', 'penis', 'vagina',
  'stupid', 'idiot', 'moron', 'dumb', 'fool', 'loser', 'hate', 'kill', 'die',
  // Hindi profanity
  'chutiya', 'madarchod', 'behenchod', 'bhosdike', 'gaand', 'lund', 'randi',
  // Add more as needed
];

// Patterns to catch leetspeak and variations
const LEETSPEAK_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  '$': 's',
};

function normalizeLeetspeak(text: string): string {
  return text.split('').map(char => LEETSPEAK_MAP[char] || char).join('');
}

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  // Normalize the text
  const normalized = normalizeLeetspeak(text.toLowerCase().trim());
  
  // Only check with word boundaries to avoid false positives on names like "Mudasser"
  for (const word of PROFANITY_LIST) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalized)) {
      return true;
    }
  }
  
  return false;
}

export function validateName(name: string): { valid: boolean; message?: string } {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  
  if (name.trim().length > 50) {
    return { valid: false, message: 'Name must be less than 50 characters' };
  }
  
  if (containsProfanity(name)) {
    return { valid: false, message: 'Please use an appropriate name' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const validNameRegex = /^[a-zA-Z\s\-']+$/;
  if (!validNameRegex.test(name.trim())) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { valid: true };
}
