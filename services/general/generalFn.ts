import { useMutation } from "@tanstack/react-query";
import { uploadFiles, uploadRawFiles } from "./general";

export const useUploadFiles = (isMultiple: boolean) => {
    
    return useMutation({
      mutationFn: (files: File | File[]) => uploadFiles(files, isMultiple),
  
    });
  };

  export const useUploadRawFiles = (isMultiple: boolean) => {
    return useMutation({
      mutationFn: (files: File | File[]) => uploadRawFiles(files, isMultiple),
    });
  };
  