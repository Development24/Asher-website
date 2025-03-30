import { FileUpIcon } from "lucide-react"


interface ChatMessageProps {
  content: string
  timestamp: string
  isOwn: boolean
  attachments?: {
    images?: string[]
    files?: string[]
    videos?: string[]
    audios?: string[]
  }
}

export function ChatMessage({ content, timestamp, isOwn, attachments }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          max-w-[70%] 
          ${isOwn 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-100'
          } 
          rounded-lg p-3
        `}
      >
        {/* Media Attachments */}
        {attachments && (
          <div className="space-y-2 mb-2">
            {/* Images */}
            {attachments.images && attachments.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {attachments.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="attachment"
                    className="rounded-lg w-full h-auto object-cover"
                  />
                ))}
              </div>
            )}
            
            {/* Videos */}
            {attachments.videos && attachments.videos.length > 0 && (
              <div className="space-y-2">
                {attachments.videos.map((video, index) => (
                  <video
                    key={index}
                    controls
                    className="rounded-lg w-full"
                    src={video}
                  />
                ))}
              </div>
            )}
            
            {/* Audio */}
            {attachments.audios && attachments.audios.length > 0 && (
              <div className="space-y-2">
                {attachments.audios.map((audio, index) => (
                  <audio
                    key={index}
                    controls
                    className="w-full"
                    src={audio}
                  />
                ))}
              </div>
            )}
            
            {/* Files */}
            {attachments.files && attachments.files.length > 0 && (
              <div className="space-y-2">
                {attachments.files.map((file, index) => (
                  <a
                    key={index}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-white/10 rounded"
                  >
                    <FileUpIcon className="h-4 w-4" />
                    <span className="text-sm truncate">
                      {file.split('/').pop()}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Message Content */}
        <p>{content}</p>
        <div className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
          {timestamp}
        </div>
      </div>
    </div>
  )
}

