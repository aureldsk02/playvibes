// Lazy load Spotify Web Playback SDK
let sdkLoadPromise: Promise<void> | null = null;

export function loadSpotifySDK(): Promise<void> {
  // Return existing promise if already loading
  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  // Check if SDK is already loaded
  if (typeof window !== 'undefined' && window.Spotify) {
    return Promise.resolve();
  }

  // Create new load promise
  sdkLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    // Set up callback for when SDK is ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      resolve();
    };

    // Handle script load errors
    script.onerror = () => {
      sdkLoadPromise = null; // Reset so it can be retried
      reject(new Error('Failed to load Spotify Web Playback SDK'));
    };

    // Append script to document
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}
