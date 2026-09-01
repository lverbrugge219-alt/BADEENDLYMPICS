/**
 * Client-side Image Compression Utility
 * Resizes and compresses user-uploaded avatar images using HTML5 Canvas
 * into tiny WebP/JPEG data URLs (typically 15KB - 45KB).
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  width: number;
  height: number;
  format: 'webp' | 'jpeg';
}

export async function compressImageFile(
  file: File,
  maxDimension: number = 360,
  quality: number = 0.82
): Promise<CompressionResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Het bestand kon niet gelezen worden.'));
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('De afbeelding kon niet verwerkt worden.'));
      };

      img.onload = () => {
        // Calculate square crop dimensions to center the avatar
        let srcX = 0;
        let srcY = 0;
        let srcWidth = img.width;
        let srcHeight = img.height;

        if (srcWidth > srcHeight) {
          srcX = (srcWidth - srcHeight) / 2;
          srcWidth = srcHeight;
        } else if (srcHeight > srcWidth) {
          srcY = (srcHeight - srcWidth) / 2;
          srcHeight = srcWidth;
        }

        const targetSize = Math.min(maxDimension, Math.max(srcWidth, 120));

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context kon niet geïnitialiseerd worden.'));
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cropped square
        ctx.drawImage(
          img,
          srcX,
          srcY,
          srcWidth,
          srcHeight,
          0,
          0,
          targetSize,
          targetSize
        );

        // Try WebP first, fallback to JPEG if not supported
        let format: 'webp' | 'jpeg' = 'webp';
        let dataUrl = '';

        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            format = 'jpeg';
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          format = 'jpeg';
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Calculate size in KB from base64 string
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const padding = dataUrl.endsWith('==') ? 2 : dataUrl.endsWith('=') ? 1 : 0;
        const bytes = base64Length * 0.75 - padding;
        const compressedSizeKb = Math.round((bytes / 1024) * 10) / 10;

        resolve({
          dataUrl,
          originalSizeKb,
          compressedSizeKb,
          width: targetSize,
          height: targetSize,
          format,
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
