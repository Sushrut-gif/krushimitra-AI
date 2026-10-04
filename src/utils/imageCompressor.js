/**
 * Image Compression / Downscaling Utility for KrushiMitra & APMC Solapur
 *
 * Resizes and compresses images via an HTML Canvas element (e.g. max width 600px, quality 0.6)
 * before converting to base64 or saving to Supabase. Keeps payloads under 100KB-150KB.
 */

export const DEFAULT_PRODUCE_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20fill%3D%22%23059669%22%20width%3D%22400%22%20height%3D%22300%22%2F%3E%3Ctext%20fill%3D%22%23ffffff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20dy%3D%228%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3E%E0%A4%B6%E0%A5%87%E0%A4%A4%E0%A4%AE%E0%A4%BE%E0%A4%B2%20(APMC%20Solapur)%3C%2Ftext%3E%3C%2Fsvg%3E';

/**
 * Resizes and compresses an image (File, Blob, or base64 Data URL)
 * via an HTML Canvas element.
 *
 * @param {File|Blob|string} imageSource - Raw File, Blob, or base64 Data URL
 * @param {number} maxWidth - Max width for downscaling (default: 600px)
 * @param {number} quality - JPEG compression quality 0.0 - 1.0 (default: 0.6)
 * @returns {Promise<string>} Compressed base64 JPEG data URL
 */
export async function compressImage(imageSource, maxWidth = 600, quality = 0.6) {
  if (!imageSource) return null;

  // If running in an environment without DOM (e.g. Node tests/SSR)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return typeof imageSource === 'string' ? imageSource : DEFAULT_PRODUCE_PLACEHOLDER;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();

      const processImage = () => {
        try {
          let originalWidth = img.naturalWidth || img.width;
          let originalHeight = img.naturalHeight || img.height;

          if (!originalWidth || !originalHeight) {
            resolve(typeof imageSource === 'string' ? imageSource : DEFAULT_PRODUCE_PLACEHOLDER);
            return;
          }

          let targetWidth = originalWidth;
          let targetHeight = originalHeight;

          // Downscale if width exceeds maxWidth
          if (targetWidth > maxWidth) {
            targetHeight = Math.round((originalHeight * maxWidth) / originalWidth);
            targetWidth = maxWidth;
          }

          // Limit excessive vertical height to prevent giant aspect-ratio images
          const maxHeight = Math.round(maxWidth * 1.5);
          if (targetHeight > maxHeight) {
            targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
            targetHeight = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(typeof imageSource === 'string' ? imageSource : DEFAULT_PRODUCE_PLACEHOLDER);
            return;
          }

          // Clean white background for transparent PNG/WebP conversions
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Draw and downscale image
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Export compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);

          console.log(
            `[ImageCompressor] Downscaled ${originalWidth}x${originalHeight} -> ${targetWidth}x${targetHeight} (~${Math.round(
              approxBytes / 1024
            )} KB)`
          );

          resolve(compressedDataUrl);
        } catch (canvasErr) {
          console.warn('[ImageCompressor] Canvas downscaling error:', canvasErr);
          resolve(typeof imageSource === 'string' ? imageSource : DEFAULT_PRODUCE_PLACEHOLDER);
        }
      };

      img.onload = processImage;
      img.onerror = (err) => {
        console.warn('[ImageCompressor] Image loading error:', err);
        resolve(typeof imageSource === 'string' ? imageSource : DEFAULT_PRODUCE_PLACEHOLDER);
      };

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (imageSource instanceof Blob || imageSource instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = () => {
          resolve(DEFAULT_PRODUCE_PLACEHOLDER);
        };
        reader.readAsDataURL(imageSource);
      } else {
        resolve(DEFAULT_PRODUCE_PLACEHOLDER);
      }
    } catch (err) {
      console.warn('[ImageCompressor] Unexpected compression error:', err);
      resolve(typeof imageSource === 'string' ? imageSource : DEFAULT_PRODUCE_PLACEHOLDER);
    }
  });
}
