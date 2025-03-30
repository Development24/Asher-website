import { useMemo } from 'react';

// Update the message width to be slightly wider relative to the container
interface ChatMessageProps {
  content: string
  timestamp: string
  isOwn?: boolean
  status?: "sent" | "delivered" | "read"
  isPinned?: boolean
}

// Helper function to determine media type from URL or file URI
const getMediaType = (url: string) => {
  // Handle local file URIs (mobile devices)
  if (url.startsWith('file:///')) {
    const extension = url.split('.').pop()?.toLowerCase();
    const path = url.toLowerCase();

    // Check if it's in an AV (AudioVideo) directory
    if (path.includes('/av/') || path.includes('/audio/')) {
      return 'audio';
    }
    
    // Check if it's in an images directory
    if (path.includes('/images/') || path.includes('/photos/')) {
      return 'image';
    }

    // Check extensions for local files
    if (extension) {
      // Audio formats (including mobile-specific ones)
      if (['m4a', 'aac', 'mp3', 'wav', 'ogg'].includes(extension)) {
        return 'audio';
      }
      // Image formats
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(extension)) {
        return 'image';
      }
      // Video formats
      if (['mp4', 'mov', 'm4v', 'webm'].includes(extension)) {
        return 'video';
      }
      // Document formats
      if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(extension)) {
        return 'document';
      }
    }

    return null;
  }

  // Handle Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (!extension) return null;

    // Image formats
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    }
    // Video formats
    if (['mp4', 'webm', 'mov'].includes(extension)) {
      return 'video';
    }
    // Audio formats
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
      return 'audio';
    }
    // Document formats
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(extension)) {
      return 'document';
    }
  }

  // Handle other potential URL patterns
  const urlPattern = /^https?:\/\//i;
  if (urlPattern.test(url)) {
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension) {
      // Apply same extension checks as above
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
      if (['mp4', 'webm', 'mov'].includes(extension)) return 'video';
      if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) return 'audio';
      if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(extension)) return 'document';
    }
  }

  return null;
};

export function ChatMessage({ content, timestamp, isOwn, status, isPinned }: ChatMessageProps) {
  // Parse content for Cloudinary URLs and determine media type
  const messageContent = useMemo(() => {
    // Updated regex to catch both Cloudinary URLs and local file URIs
    const mediaRegex = /(https:\/\/.*cloudinary\.com\/[^\s]*|file:\/\/\/[^\s]*)/g;
    const matches = content.match(mediaRegex);

    if (!matches) {
      return { text: content, media: null };
    }

    // Process each URL/URI found
    const media = matches.map(url => ({
      url,
      type: getMediaType(url)
    }));

    // Remove URLs/URIs from text content
    const text = content.replace(mediaRegex, '').trim();

    return { text, media };
  }, [content]);

  const getStatusIcon = () => {
    if (!isOwn) return null

    switch (status) {
      case "sent":
        return <span className="text-gray-400">✓</span>
      case "delivered":
        return <span className="text-gray-400">✓✓</span>
      case "read":
        return <span className="text-red-600">✓✓</span>
      default:
        return null
    }
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} relative`}>
      <div
        className={`
          max-w-[60%] 
          ${isOwn ? "bg-red-600 text-white" : "bg-white/90"} 
          rounded-2xl px-6 py-3 shadow-lg backdrop-blur-sm
          hover:shadow-xl transition-shadow duration-200
        `}
      >
        {/* Render media content */}
        {messageContent.media && messageContent.media.length > 0 && (
          <div className="space-y-2 mb-2">
            {messageContent.media.map((item, index) => {
              switch (item.type) {
                case 'image':
                  return (
                    <img
                      key={index}
                      src={item.url}
                      alt="Image"
                      className="rounded-lg w-full h-auto"
                      loading="lazy"
                    />
                  );
                case 'video':
                  return (
                    <video
                      key={index}
                      src={item.url}
                      controls
                      className="rounded-lg w-full"
                    />
                  );
                case 'audio':
                  return (
                    <audio
                      key={index}
                      src={item.url}
                      controls
                      className=""
                    />
                  );
                case 'document':
                  return (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-white/10 rounded"
                    >
                      <span className="text-sm">
                        View Document
                      </span>
                    </a>
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}

        {/* Render text content if any */}
        {messageContent.text && (
          <p className="text-sm">{messageContent.text}</p>
        )}

        <div className="flex items-center gap-1 mt-1">
          <span className={`text-xs ${isOwn ? "text-red-200" : "text-gray-500"}`}>{timestamp}</span>
          {getStatusIcon()}
        </div>
      </div>
      {isPinned && (
        <div className="absolute top-0 right-0 transform -translate-y-full mb-1">
          <span className="text-xs text-gray-500 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full shadow-sm backdrop-blur-sm">
            <span className="transform rotate-45">📌</span>
            Pinned
          </span>
        </div>
      )}
    </div>
  )
}

