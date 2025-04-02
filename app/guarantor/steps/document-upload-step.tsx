import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Check, FileText, Upload, X } from "lucide-react";

interface DocumentUploadStepProps {
  documents: any;
  idType: string;
  setIdType: (type: string) => void;
  dragActive: string;
  handleDrag: (
    e: React.DragEvent<HTMLDivElement>,
    type: string,
    active: boolean
  ) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
  employmentType: string;
  getIncomeProofLabel: () => string;
  getAdditionalDocRequirements: () => string;
  idInputRef: React.RefObject<HTMLInputElement>;
  addressProofInputRef: React.RefObject<HTMLInputElement>;
  incomeProofInputRef: React.RefObject<HTMLInputElement>;
  additionalDocsInputRef: React.RefObject<HTMLInputElement>;
  removeDocument: (type: string, index: number | null) => void;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
}

export function DocumentUploadStep({
  documents,
  idType,
  setIdType,
  dragActive,
  handleDrag,
  handleDrop,
  employmentType,
  getIncomeProofLabel,
  getAdditionalDocRequirements,
  idInputRef,
  addressProofInputRef,
  incomeProofInputRef,
  additionalDocsInputRef,
  removeDocument,
  handleFileUpload
}: DocumentUploadStepProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg text-gray-800 mb-6">
          Required Documents
        </h3>
        <p className="text-gray-600 mb-4">
          Please upload the following documents. Accepted formats: JPEG, PNG,
          PDF (max 5MB each)
        </p>

        <div className="space-y-8">
          {/* ID Document Upload */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-gray-700 font-medium">ID Document</Label>
              <div className="flex space-x-2">
                <RadioGroup
                  value={idType}
                  onValueChange={setIdType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="passport" id="passport" />
                    <Label htmlFor="passport" className="text-sm">
                      Passport
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem
                      value="driving-license"
                      id="driving-license"
                    />
                    <Label htmlFor="driving-license" className="text-sm">
                      Driving License
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {documents.id ? (
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium truncate max-w-xs">
                      {documents.id.file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(documents.id.file.size / 1024)} KB)
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Uploaded
                    </span>
                  </div>
                  <button
                    onClick={() => removeDocument("id", documents.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive === "id"
                    ? "border-[#dc0a3c] bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={(e) => handleDrag(e, "id", true)}
                onDragEnter={(e) => handleDrag(e, "id", true)}
                onDragLeave={(e) => handleDrag(e, "id", false)}
                onDrop={(e) => handleDrop(e, "id")}
              >
                <input
                  ref={idInputRef}
                  type="file"
                  id="id-upload"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileUpload(e, "id")}
                />
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Drag & drop your{" "}
                    {idType === "passport" ? "passport" : "driving license"}{" "}
                    here
                  </p>
                  <p className="text-xs text-gray-500 mb-3">or</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => idInputRef.current?.click()}
                    className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Proof of Address Upload */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              Proof of Address (Utility Bill, Bank Statement)
            </Label>

            {documents.addressProof ? (
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium truncate max-w-xs">
                      {documents.addressProof.file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(documents.addressProof.file.size / 1024)} KB)
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Uploaded
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      removeDocument("addressProof", documents.addressProof)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive === "addressProof"
                    ? "border-[#dc0a3c] bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={(e) => handleDrag(e, "addressProof", true)}
                onDragEnter={(e) => handleDrag(e, "addressProof", true)}
                onDragLeave={(e) => handleDrag(e, "addressProof", false)}
                onDrop={(e) => handleDrop(e, "addressProof")}
              >
                <input
                  ref={addressProofInputRef}
                  type="file"
                  id="address-proof-upload"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileUpload(e, "addressProof")}
                />
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Drag & drop your proof of address here
                  </p>
                  <p className="text-xs text-gray-500 mb-3">or</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addressProofInputRef.current?.click()}
                    className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Proof of Income Upload */}
          {employmentType && (
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                {getIncomeProofLabel()}
              </Label>

              {documents.incomeProof ? (
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium truncate max-w-xs">
                        {documents.incomeProof.file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({Math.round(documents.incomeProof.file.size / 1024)}{" "}
                        KB)
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Uploaded
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        removeDocument("incomeProof", documents.incomeProof)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive === "incomeProof"
                      ? "border-[#dc0a3c] bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={(e) => handleDrag(e, "incomeProof", true)}
                  onDragEnter={(e) => handleDrag(e, "incomeProof", true)}
                  onDragLeave={(e) => handleDrag(e, "incomeProof", false)}
                  onDrop={(e) => handleDrop(e, "incomeProof")}
                >
                  <input
                    ref={incomeProofInputRef}
                    type="file"
                    id="income-proof-upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload(e, "incomeProof")}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drag & drop your income proof here
                    </p>
                    <p className="text-xs text-gray-500 mb-3">or</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => incomeProofInputRef.current?.click()}
                      className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Documents Upload */}
          {employmentType && employmentType !== "employed" && (
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                {getAdditionalDocRequirements()}
              </Label>

              <div className="space-y-4">
                {documents.additionalDocs.map((doc: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium truncate max-w-xs">
                          {doc.file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({Math.round(doc.file.size / 1024)} KB)
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Uploaded
                        </span>
                      </div>
                      <button
                        onClick={() => removeDocument("additionalDocs", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive === "additionalDocs"
                      ? "border-[#dc0a3c] bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={(e) => handleDrag(e, "additionalDocs", true)}
                  onDragEnter={(e) => handleDrag(e, "additionalDocs", true)}
                  onDragLeave={(e) => handleDrag(e, "additionalDocs", false)}
                  onDrop={(e) => handleDrop(e, "additionalDocs")}
                >
                  <input
                    ref={additionalDocsInputRef}
                    type="file"
                    id="additional-docs-upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload(e, "additionalDocs")}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drag & drop additional documents here
                    </p>
                    <p className="text-xs text-gray-500 mb-3">or</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => additionalDocsInputRef.current?.click()}
                      className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-yellow-800">
            Important Note
          </h4>
          <p className="text-sm text-yellow-700 mt-1">
            All documents must be clear, legible, and current (issued within the
            last 3 months for utility bills and bank statements). Incomplete or
            unclear documents may delay your application.
          </p>
        </div>
      </div>
    </div>
  );
}
