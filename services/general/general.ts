import { api, apiFormData } from "@/lib/config/api";
import { useMutation } from "@tanstack/react-query";

const URL = 'api/file-uploads';

const fileUpload = {
  multipleBinary: 'multiple/string/file',
  singleBinary: 'single/string/file',
  singleFile: '/single',
};

const getFileBinary = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Response types
export interface UploadFilesResponse {
  message?: string;
  files?: string[];
  url?: string;
  [key: string]: any;
}

export const uploadFiles = async (
  files: File | File[],
  isMultiple: boolean
): Promise<UploadFilesResponse> => {
  const endpoint = isMultiple
    ? fileUpload.multipleBinary
    : fileUpload.singleBinary;

  let fileData: ArrayBuffer | ArrayBuffer[];

  if (isMultiple) {
    const uploadFile = Array.isArray(files) ? files : [files];
    const fileBinaryPromises = uploadFile.map((file) => getFileBinary(file));
    fileData = await Promise.all(fileBinaryPromises);
  } else {
    fileData = await getFileBinary(files as File);
  }
  try {
    const response = await api.post(
      `${URL}`,
      { files: fileData },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};


export const uploadRawFiles = async (
  files: File | File[],
  isMultiple: boolean
): Promise<UploadFilesResponse> => {

  let fileData: File | File[];

  if (isMultiple) {
    const uploadFile = Array.isArray(files) ? files : [files];
    fileData = uploadFile;
  } else {
    fileData = files;
  }
  try {
    const response = await apiFormData.post(
      `${URL}${fileUpload.singleFile}`,
      { files: fileData },
    );
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const uploadSingleFile = () => {
  return useMutation({
    mutationFn: (file: File) => uploadRawFiles(file, false),
  });
}