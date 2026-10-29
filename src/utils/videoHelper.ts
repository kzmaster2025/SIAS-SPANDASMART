export interface ProcessedVideoSource {
  type: 'youtube' | 'drive' | 'direct' | 'other';
  embedUrl?: string;
  directUrl?: string;
}

export const processVideoUrl = (rawUrl: string): ProcessedVideoSource => {
  const url = (rawUrl || '').trim();
  if (!url) return { type: 'other' };

  // 1. YouTube
  // Patterns: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`
    };
  }

  // 2. Google Drive preview link
  // Pattern: drive.google.com/file/d/FILE_ID/view...
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    };
  }

  // 3. Direct video format or data url
  if (
    url.startsWith('data:video') ||
    url.startsWith('blob:') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.ogg') ||
    url.includes('.mp4?') ||
    url.includes('.webm?')
  ) {
    return {
      type: 'direct',
      directUrl: url
    };
  }

  // 4. Default: attempt iframe or direct link
  return {
    type: 'other',
    embedUrl: url,
    directUrl: url
  };
};
