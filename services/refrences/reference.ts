import { api, apiFormData } from "@/lib/config/api"

const URL = "/api/application"

const referenceURL = {
    landlordReference: "/landlord-reference/:applicationId",
    guarantorReference: "/guarantor-reference/:applicationId",
    employeeReference: "/employee-reference/:applicationId",
    references: "/references/:applicationId"
}

export const createLandlordReference = async (applicationId: string, data: any) => {
    const response = await api.post(URL + referenceURL.landlordReference.replace(":applicationId", applicationId), data)
    return response.data
}


export const createGuarantorReference = async (applicationId: string, data: any) => {
    const response = await api.post(URL + referenceURL.guarantorReference.replace(":applicationId", applicationId), data)
    return response.data
}


export const createEmployeeReference = async (applicationId: string, data: any) => {
    const response = await api.post(URL + referenceURL.employeeReference.replace(":applicationId", applicationId), data)
    return response.data
}


export const getReferences = async (applicationId: string) => {
    const response = await api.get(URL + referenceURL.references.replace(":applicationId", applicationId))
    return response.data
}