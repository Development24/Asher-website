import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'sizes'> {
  containerClassName?: string;
  isLCP?: boolean;
  sizes?: string;
}

const defaultSizes = {
  thumbnail: '(max-width: 768px) 100px, 150px',
  small: '(max-width: 768px) 200px, 300px',
  medium: '(max-width: 768px) 300px, (max-width: 1200px) 400px, 500px',
  large: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  full: '100vw',
};

export default function OptimizedImage({
  src,
  alt,
  fill,
  className,
  containerClassName,
  isLCP = false,
  sizes = defaultSizes.large,
  ...props
}: OptimizedImageProps) {
  // If fill is true, we need a container with relative positioning
  if (fill) {
    return (
      <div className={cn('relative', containerClassName)}>
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={cn('object-cover', className)}
          sizes={sizes}
          priority={isLCP}
          {...props}
        />
      </div>
    );
  }

  // If fill is false, render the Image component directly
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      priority={isLCP}
      {...props}
    />
  );
} 