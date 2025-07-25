'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';
import OptimizedImage from './OptimizedImage';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: { url: string }[];
  title: string;
  variant?: 'default' | 'grid' | 'fullscreen';
  className?: string;
  onExpandClick?: () => void;
  sizes?: {
    main?: string;
    thumbnail?: string;
  };
}

export default function ImageGallery({
  images,
  title,
  variant = 'default',
  className,
  onExpandClick,
  sizes = {
    main: '(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw',
    thumbnail: '(max-width: 768px) 33vw, 25vw'
  }
}: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
        <div className="md:col-span-2 relative rounded-lg overflow-hidden">
          <OptimizedImage
            src={images[currentImageIndex]?.url || '/placeholder.svg'}
            alt={`${title} - Main View`}
            width={800}
            height={600}
            className="w-full h-[500px] object-cover"
            isLCP={true}
            sizes={sizes.main}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          {onExpandClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onExpandClick}
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <Expand className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-rows-3 gap-4">
          {images.slice(1, 4).map((image, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden">
              <OptimizedImage
                src={image?.url || '/placeholder.svg'}
                alt={`${title} - View ${index + 2}`}
                fill
                containerClassName="w-full h-full"
                sizes={sizes.thumbnail}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className={cn('relative w-full h-[600px]', className)}>
        <OptimizedImage
          src={images[currentImageIndex]?.url || '/placeholder.svg'}
          alt={`${title} - View ${currentImageIndex + 1}`}
          fill
          isLCP={true}
          containerClassName="w-full h-full"
          sizes={sizes.main}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                'relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden transition-all',
                currentImageIndex === index
                  ? 'ring-2 ring-primary'
                  : 'ring-1 ring-white/20'
              )}
            >
              <OptimizedImage
                src={image?.url || '/placeholder.svg'}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                containerClassName="w-full h-full"
                sizes={sizes.thumbnail}
              />
            </button>
          ))}
        </div>
        {onExpandClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExpandClick}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <Expand className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)}>
      <OptimizedImage
        src={images[currentImageIndex]?.url || '/placeholder.svg'}
        alt={`${title} - View ${currentImageIndex + 1}`}
        width={800}
        height={600}
        className="w-full h-[400px] object-cover"
        isLCP={true}
        sizes={sizes.main}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
      <button
        onClick={handlePrevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      {onExpandClick && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onExpandClick}
          className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <Expand className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
} 