/**
 * Media Cache & Instant Invalidation Manager
 * 
 * Provides versioned URL generation to bypass browser & proxy/Nginx stale caches immediately
 * whenever an image is edited, replaced, or synced with Google Drive.
 */

export function getCacheBustedUrl(url?: string, version?: number | string): string {
  if (!url) return '';
  // Data URLs (base64) don't need cache busting
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const v = version || 1;
  const separator = url.includes('?') ? '&' : '?';

  // If URL already contains a ?v= or &v= parameter, replace it cleanly
  if (/[?&]v=[^&]+/.test(url)) {
    return url.replace(/([?&]v=)[^&]+/, `$1${v}`);
  }

  return `${url}${separator}v=${v}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

class MediaCacheManager {
  private cacheTimestamps: Map<string, number> = new Map();
  private listeners: Set<() => void> = new Set();

  public getVersion(assetId: string): number {
    return this.cacheTimestamps.get(assetId) || Date.now();
  }

  public invalidate(assetId: string): number {
    const newVersion = Date.now();
    this.cacheTimestamps.set(assetId, newVersion);
    this.notify();
    return newVersion;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Cache listener error:', err);
      }
    });
  }
}

export const mediaCache = new MediaCacheManager();
