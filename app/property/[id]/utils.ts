export interface ImageObject {
    id: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    caption?: string;
    isPrimary?: boolean;
    fileType: string; // e.g., "image/png", "application/pdf"
    type: string; // e.g., "IMAGE", "DOCUMENT"
    imagePropertyId?: string;
    [key: string]: any; // Allow other potential properties
  }

export const placeholderImages = [
    "/Frame 157.svg",
    "/Frame 157.svg",
    "/Frame 157.svg"
  ];
 export const imageExtensions = /\.(jpeg|jpg|gif|png|webp|svg)$/i; // Fallback

export const filteredImageUrls = (images: ImageObject[] | null | undefined): string[] => {
    if (!images || !Array.isArray(images)) {
      return [];
    }
    
    return images
      .filter((image: ImageObject) => {
        if (!image || typeof image !== 'object' || !image.url || typeof image.url !== 'string') {
          return false;
        }
        // Prioritize checking the fileType property
        if (image.fileType && typeof image.fileType === "string") {
          return image.fileType.startsWith("image/");
        }
        // Fallback: Check type property if it indicates an image (less specific than fileType)
        if (
          image.type &&
          typeof image.type === "string" &&
          image.type.toUpperCase() === "IMAGE"
        ) {
          // If type is IMAGE, but fileType was missing, double check extension for safety
          return imageExtensions.test(image.url.toLowerCase());
        }
        // Final fallback to URL extension if no type information is definitive
        return imageExtensions.test(image.url.toLowerCase());
      })
      .map((image: ImageObject) => image.url);
}

export const displayImages = (images: ImageObject[] | null | undefined): string[] => {
    if (!images) {
        return placeholderImages;
    }
    
    const filteredImages = filteredImageUrls(images);
    return filteredImages.length > 0 ? filteredImages : placeholderImages;
}