export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

// Basic stop words to ignore for keyword extraction
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than', 'to', 'of', 'for', 'in', 'on', 'at', 'with', 'by', 'about',
  'is', 'are', 'was', 'were', 'be', 'being', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'this', 'that', 'these', 'those',
  'it', 'its', 'as', 'from', 'up', 'down', 'out', 'over', 'under',
]);

// Synonyms and variations to help fuzzy matching (business-focused)
const SYNONYMS: Record<string, string[]> = {
  // Business strategy terms
  pricing: ['price', 'revenue', 'monetization'],
  marketing: ['growth', 'acquisition', 'advertising'],
  hiring: ['recruiting', 'talent', 'team'],
  strategy: ['planning', 'direction', 'roadmap'],
  operations: ['systems', 'processes', 'workflow'],
  business: ['company', 'startup', 'entrepreneur'],
  // Legacy terms (keeping for backward compatibility)
  tire: ['tyre', 'wheel'],
  tyres: ['tire'],
  fix: ['repair', 'replace', 'change'],
  change: ['replace', 'swap'],
  car: ['vehicle', 'auto'],
  flat: ['puncture'],
  tutorial: ['guide', 'walkthrough', 'step'],
  jack: ['lift'],
};

const ACTION_WORDS = new Set([
  // Business action words
  'strategy', 'pricing', 'marketing', 'growth', 'hiring', 'scaling', 'framework', 'model', 'plan',
  // Legacy action words
  'fix', 'repair', 'replace', 'change', 'install', 'remove', 'how', 'tutorial', 'step', 'guide', 'tighten'
]);

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function expandSynonyms(word: string): string[] {
  const normalized = normalize(word);
  return [normalized, ...(SYNONYMS[normalized] || [])].filter(Boolean);
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  const parts = text.split(/\s+/);
  const keywords = new Set<string>();

  for (const part of parts) {
    const base = normalize(part);
    if (!base || base.length < 2 || STOP_WORDS.has(base)) continue;
    expandSynonyms(base).forEach((kw) => keywords.add(kw));
  }

  return Array.from(keywords);
}

function scoreTitle(title: string, keywords: Set<string>): { score: number; actionMatch: boolean } {
  const lowerTitle = title.toLowerCase();
  let score = 0;
  let actionMatch = false;

  keywords.forEach((kw) => {
    if (!kw) return;
    const variants = expandSynonyms(kw);
    const matched = variants.some((variant) => variant && lowerTitle.includes(variant));
    if (matched) {
      score += 1;
      if (ACTION_WORDS.has(kw)) {
        actionMatch = true;
      }
    }
  });

  return { score, actionMatch };
}

export function filterRelevantVideos(userQuery: string, searchTerm: string, videos: YouTubeVideo[]): YouTubeVideo[] {
  if (!videos || videos.length === 0) return [];

  const combinedQuery = `${userQuery || ''} ${searchTerm || ''}`.trim();
  const keywords = new Set(extractKeywords(combinedQuery));
  if (keywords.size === 0) return videos.slice(0, 3);

  const scored = videos.map((video) => {
    const { score, actionMatch } = scoreTitle(video.title, keywords);
    return { video, score, actionMatch };
  });

  const filtered = scored
    .filter(({ score, actionMatch }) => score >= 2 || (score >= 1 && actionMatch))
    .sort((a, b) => b.score - a.score)
    .map(({ video }) => video);

  if (filtered.length === 0) {
    // Fall back to the top result to avoid empty UI, but don't show irrelevant multiples
    return videos.slice(0, 1);
  }

  return filtered.slice(0, 3);
}

export async function searchYouTubeVideos(searchTerm: string, userQuery?: string): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch('/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchTerm }),
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    const videos: YouTubeVideo[] = data.videos || [];

    if (!userQuery) {
      return videos;
    }

    return filterRelevantVideos(userQuery, searchTerm, videos);
  } catch (error) {
    console.error('Failed to search YouTube:', error);
    return [];
  }
}
