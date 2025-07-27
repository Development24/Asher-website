import Link from "next/link";
// Helper function to detect and format links in text
export const formatMessageBody = (text: string) => {
  if (!text) return "";

  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // Split text by URLs and format each part
  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    const isUrl = urlPattern.test(part);

    if (isUrl) {
      return (
        <div key={index}>
          <Link
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {part}
          </Link>
        </div>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

// Helper function to get file extension from URL
export const getFileExtension = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  return extension || "";
};

// Helper function to get file type icon
export const getFileTypeIcon = (url: string) => {
  const extension = getFileExtension(url);

  switch (extension) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "xls":
    case "xlsx":
      return "📊";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "🖼️";
    case "mp4":
    case "mov":
    case "avi":
      return "🎥";
    case "mp3":
    case "wav":
    case "m4a":
      return "🎵";
    default:
      return "📎";
  }
};

// Helper function to format file size
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to handle attachment download
export const handleAttachmentDownload = (url: string, name?: string) => {
  if (typeof document !== 'undefined') {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || `attachment-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Helper function to get attachment name
export const getAttachmentName = (url: string, index: number) => {
  const fileName = url.split("/").pop();
  return fileName || `Attachment ${index + 1}`;
};
