import { useMutation } from "@tanstack/react-query";
import { uploadFiles, uploadRawFiles } from "./general";

export const useUploadFiles = (isMultiple: boolean) => {
    
    return useMutation({
      mutationFn: (files: File | File[]) => uploadFiles(files, isMultiple),
  
      // onError: (error: any) => {
      //   console.error('Error uploading files:', error);
      // },
    });
  };

  export const useUploadRawFiles = (isMultiple: boolean) => {
    return useMutation({
      mutationFn: (files: File | File[]) => uploadRawFiles(files, isMultiple),
    });
  };
  