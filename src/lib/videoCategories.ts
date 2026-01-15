export const VIDEO_CATEGORIES = [
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '✨' },
  { value: 'news', label: 'News', icon: '📰' },
  { value: 'other', label: 'Other', icon: '📁' },
] as const;

export type VideoCategory = typeof VIDEO_CATEGORIES[number]['value'];
