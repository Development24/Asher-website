import { FileUploader } from "../file-uploader"
import { Label } from "@/components/ui/label"

interface DocumentUploadStepProps {
  documents: any;
  onDocumentUpload: (type: string, file: File) => void;
  onDocumentRemove: (type: string, index?: number) => void;
}

export function DocumentUploadStep({ 
  documents, 
  onDocumentUpload, 
  onDocumentRemove 
}: DocumentUploadStepProps) {
  return (
    <div className="space-y-6">
      <FileUploader
        label="Proof of Address"
        accept=".jpg,.jpeg,.png,.pdf"
        onUpload={(file: File) => onDocumentUpload("addressProof", file)}
        onRemove={() => onDocumentRemove("addressProof")}
        file={documents.addressProof}
      />
      {/* Add other document uploaders */}
    </div>
  )
} 