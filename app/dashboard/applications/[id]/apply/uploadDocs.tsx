import { FormMessage } from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import React, { useState, useEffect } from 'react'
import { useController } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { DocumentsFormValues } from './schemas/documents-schema';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export const UploadBox = ({
    name,
    label,
    required = true,
    form
  }: {
    name: keyof DocumentsFormValues | any;
    label: string;
    required?: boolean;
    form: UseFormReturn<any>;
  }) => {
    const { field, fieldState } = useController({
      name,
      control: form.control
    });
  
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors",
                  fieldState.error ? "border-red-500" : "border-gray-200"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    id={name}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    {...field}
                  />
                  <label
                    htmlFor={name}
                    className="flex flex-col items-center gap-2 cursor-pointer w-full text-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    {value ? (
                      <span className="text-sm text-gray-600">
                        {(value as File).name}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-medium">
                          Drag and drop or upload document
                        </span>
                        <span className="text-xs text-gray-500">
                          Accepted formats: Word, PDF
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };


export const FileUploadBox = ({
    name,
    label,
    required = true,
    form,
    description = "Upload any file"
  }: {
    name: string;
    label: string;
    required?: boolean;
    form: UseFormReturn<any>;
    description?: string;
  }) => {
    const { field, fieldState } = useController({
      name,
      control: form.control
    });

    const [preview, setPreview] = useState<string | null>(null);

    // Handle preview for both File objects and URLs
    useEffect(() => {
      if (!field.value) {
        setPreview(null);
        return;
      }

      // If the value is a string (URL), use it directly
      if (typeof field.value === 'string') {
        setPreview(field.value);
        return;
      }

      // If it's a File object, create preview URL
      if (field.value instanceof File) {
        const isImage = field.value.type.startsWith('image/');
        
        if (isImage) {
          const objectUrl = URL.createObjectURL(field.value);
          setPreview(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        }
      }
    }, [field.value]);

    const getFileDetails = () => {
      if (!field.value) return null;

      // Handle File object
      if (field.value instanceof File) {
        return {
          name: field.value.name,
          size: ((field.value.size / 1024 / 1024).toFixed(2) + ' MB'),
          type: field.value.type
        };
      }

      // Handle URL string (from cloudinary)
      if (typeof field.value === 'string') {
        const fileName = field.value.split('/').pop() || 'Uploaded file';
        return {
          name: fileName,
          size: 'Uploaded',
          type: fileName.split('.').pop() || ''
        };
      }

      return null;
    };

    const fileDetails = getFileDetails();
  
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors",
                  fieldState.error ? "border-red-500" : "border-gray-200"
                )}
              >
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="file"
                    id={name}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    className="hidden"
                    {...fieldProps}
                  />
                  <label
                    htmlFor={name}
                    className="flex flex-col items-center gap-2 cursor-pointer w-full text-center"
                  >
                    {value ? (
                      <div className="flex flex-col items-center gap-3">
                        {preview ? (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <Image
                              src={preview}
                              alt="File preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-2xl text-gray-400">
                              {fileDetails?.type.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm text-gray-600">
                            {fileDetails?.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {fileDetails?.size}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium">
                          Drag and drop or click to upload
                        </span>
                        <span className="text-xs text-gray-500">
                          {description}
                        </span>
                      </>
                    )}
                  </label>
                  {value && (
                    <button
                      type="button"
                      onClick={() => {
                        onChange(null);
                        setPreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };