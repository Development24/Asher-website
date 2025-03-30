'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Upload, X, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Document {
  id: string
  name: string
  description: string
  required: boolean
  file?: File
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress?: number
}

export default function AttachDocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'id',
      name: 'Valid ID',
      description: 'National ID, International Passport, or Driver\'s License',
      required: true,
      status: 'pending'
    },
    {
      id: 'proof-of-income',
      name: 'Proof of Income',
      description: 'Last 3 months pay slips or bank statements',
      required: true,
      status: 'pending'
    },
    {
      id: 'employment-letter',
      name: 'Employment Letter',
      description: 'Current employment verification letter',
      required: true,
      status: 'pending'
    },
    {
      id: 'utility-bill',
      name: 'Utility Bill',
      description: 'Recent utility bill for proof of address',
      required: true,
      status: 'pending'
    }
  ])

  const handleFileSelect = async (documentId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, file, status: 'uploading', progress: 0 }
        : doc
    ))

    // Simulate file upload
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, progress }
          : doc
      ))

      if (progress >= 100) {
        clearInterval(interval)
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'completed', progress: 100 }
            : doc
        ))
      }
    }, 500)
  }

  const handleRemoveFile = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, file: undefined, status: 'pending', progress: undefined }
        : doc
    ))
  }

  const handleSubmit = () => {
    // Here you would typically upload any remaining files
    // and create document references in your database
    router.push('/dashboard/applications/1/progress')
  }

  const allRequired = documents
    .filter(doc => doc.required)
    .every(doc => doc.status === 'completed')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/dashboard/applications" className="text-gray-600 hover:text-gray-900">
            Applications
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Upload Documents</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Upload Required Documents</h1>
            <p className="text-gray-600">
              Please upload all required documents to complete your application.
            </p>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              All documents should be clear and legible. Accepted formats: PDF, JPG, PNG (max 5MB each)
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{doc.name}</h3>
                      {doc.required && (
                        <span className="text-xs text-red-600">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {doc.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status === 'completed' ? (
                      <>
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Uploaded
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(doc.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          id={doc.id}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileSelect(doc.id, file)
                          }}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {doc.status === 'uploading' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Uploading...</span>
                      <span>{doc.progress}%</span>
                    </div>
                    <Progress value={doc.progress} className="h-2" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!allRequired}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
            >
              Submit Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

