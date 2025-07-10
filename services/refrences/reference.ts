import { api, apiFormData } from "@/lib/config/api"

const URL = "/api/application"

const referenceURL = {
    landlordReference: "/landlord-reference/:applicationId",
    guarantorReference: "/guarantor-reference/:applicationId",
    employeeReference: "/employee-reference/:applicationId",
    references: "/references/:applicationId"
}

// Response types
export interface Reference {
  id: string;
  type: string;
  applicationId: string;
  data: any;
  createdAt: string;
  [key: string]: any;
}

export interface CreateReferenceResponse {
  message: string;
  reference: Reference;
}

export interface GetReferencesResponse {
  references: Reference[];
  message?: string;
}

export const createLandlordReference = async (applicationId: string, data: any): Promise<CreateReferenceResponse> => {
    const response = await api.post(URL + referenceURL.landlordReference.replace(":applicationId", applicationId), data)
    return response.data
}


export const createGuarantorReference = async (applicationId: string, data: any): Promise<CreateReferenceResponse> => {
    const response = await api.post(URL + referenceURL.guarantorReference.replace(":applicationId", applicationId), data)
    return response.data
}


export const createEmployeeReference = async (applicationId: string, data: any): Promise<CreateReferenceResponse> => {
    const response = await api.post(URL + referenceURL.employeeReference.replace(":applicationId", applicationId), data)
    return response.data
}


export const getReferences = async (applicationId: string): Promise<GetReferencesResponse> => {
    const response = await api.get(URL + referenceURL.references.replace(":applicationId", applicationId))
    return response.data
}