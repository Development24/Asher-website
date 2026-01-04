export interface ImageObject {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    url: string;
    caption?: string;
    isPrimary?: boolean;
    fileType?: string; // e.g., "image/png", "application/pdf"
    type?: string; // e.g., "IMAGE", "DOCUMENT"
    imagePropertyId?: string;
    [key: string]: any; // Allow other potential properties
  }

// Simplified image format (from normalized listings)
export interface SimpleImage {
    id: string;
    url: string;
    caption?: string;
    isPrimary?: boolean;
}

export const placeholderImages = [
    "/Frame 157.svg",
    "/Frame 157.svg",
    "/Frame 157.svg"
  ];
 export const imageExtensions = /\.(jpeg|jpg|gif|png|webp|svg)$/i; // Fallback

export const filteredImageUrls = (images: (ImageObject | SimpleImage)[] | null | undefined): string[] => {
    if (!images || !Array.isArray(images)) {
      return [];
    }
    
    return images
      .filter((image: ImageObject | SimpleImage) => {
        if (!image || typeof image !== 'object' || !image.url || typeof image.url !== 'string') {
          return false;
        }
        // For simplified images (from normalized listings), just check URL extension
        if (!('fileType' in image) && !('type' in image)) {
          return imageExtensions.test(image.url.toLowerCase());
        }
        // For full ImageObject, check fileType first
        const fullImage = image as ImageObject;
        if (fullImage.fileType && typeof fullImage.fileType === "string") {
          return fullImage.fileType.startsWith("image/");
        }
        // Fallback: Check type property if it indicates an image
        if (
          fullImage.type &&
          typeof fullImage.type === "string" &&
          fullImage.type.toUpperCase() === "IMAGE"
        ) {
          return imageExtensions.test(image.url.toLowerCase());
        }
        // Final fallback to URL extension
        return imageExtensions.test(image.url.toLowerCase());
      })
      .map((image: ImageObject | SimpleImage) => image.url);
}

export const displayImages = (images: (ImageObject | SimpleImage)[] | null | undefined): string[] => {
    if (!images) {
        return placeholderImages;
    }
    
    const filteredImages = filteredImageUrls(images);
    return filteredImages.length > 0 ? filteredImages : placeholderImages;
}