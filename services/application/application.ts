import { api, apiFormData } from "@/lib/config/api"

const URL = "api/application"
// /application/milestones/cm284qnxt0003tffzo49gvmfl
const applicationURL = {
    start: "/:propertyId",
    residentialDetails: "/residential-info/:applicationId",
    employmentDetails: "/employer-info/:applicationId",
    emergencyContact: "/emergency-contact/:applicationId",
    additionalDetails: "/additional-info/:applicationId",
    referees: "/referees/:applicationId",
    documents: "/document/:applicationId",
    guarantor: "/guarantor/:applicationId",
    checklist: "/checklist/:applicationId",
    declaration: "/declaration/:applicationId",
    applications: "/all/",
    milestones: "/milestones/:propertyId/:applicationId",
    singleApplication: "/:applicationId",
    invites: "/invities/all",
    updateInvite: "/invites/update/:id",
    getPropertyByInviteId: "/invities/:id/get",
    dashboardStats: "/applicant/stats",
    completeApplication: "/complete/:applicationId"
}

export const startApplication = async (propertyId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.start.replace(":propertyId", propertyId), payload)
    return response.data
}

export const residentApplication = async (applicationId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.residentialDetails.replace(":applicationId", applicationId), payload)
    return response.data
}

export const employerApplication = async (applicationId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.employmentDetails.replace(":applicationId", applicationId), payload)
    return response.data
}

export const emergencyContactApplication = async (applicationId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.emergencyContact.replace(":applicationId", applicationId), payload)
    return response.data
}


export const additionalDetailsApplication = async (applicationId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.additionalDetails.replace(":applicationId", applicationId), payload)
    return response.data
}

export const refereesApplication = async (applicationId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.referees.replace(":applicationId", applicationId), payload)
    return response.data
}

export const guarantorApplication = async (applicationId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.guarantor.replace(":applicationId", applicationId), payload)
    return response.data
}

export const documentsApplication = async (applicationId: string, payload: any) => {
    const response = await apiFormData.post(URL + applicationURL.documents.replace(":applicationId", applicationId), payload)
    return response.data
}

export const checklistApplication = async (applicationId: string, payload: any) => {
    const response = await api.post(URL + applicationURL.checklist.replace(":applicationId", applicationId), payload)
    return response.data
}

export const declarationApplication = async (applicationId: string, payload: any) => {
    const response = await apiFormData.post(URL + applicationURL.declaration.replace(":applicationId", applicationId), payload)
    return response.data
}

export const allApplications = async () => {
    const response = await api.get(URL + applicationURL.applications)
    return response.data
}

export const milestonesApplication = async (propertyId: string, applicationId?: string) => {
    const response = await api.get(URL + applicationURL.milestones.replace(":propertyId", propertyId).replace(":applicationId", applicationId || ""))
    return response.data
}

export const singleApplication = async (applicationId: string) => {
    const response = await api.get(URL + applicationURL.singleApplication.replace(":applicationId", applicationId))
    return response.data
}

export const allInvites = async () => {
    const response = await api.get(URL + applicationURL.invites)
    return response.data
}

export interface UpdateInvitePayload {
    reScheduleDate?: string,
    scheduleDate?: string,
    response?: string,
}
export const updateInvite = async (id: string, payload: UpdateInvitePayload) => {
    const response = await api.patch(URL + applicationURL.updateInvite.replace(":id", id), payload)
    return response.data
}

export const getPropertyByInviteId = async (id: string) => {
    const response = await api.get(URL + applicationURL.getPropertyByInviteId.replace(":id", id))
    return response.data
}


export const dashboardStats = async () => {
    const response = await api.get(URL + applicationURL.dashboardStats)
    return response.data
}

export const completeApplication = async (applicationId: string) => {
    const response = await api.post(URL + applicationURL.completeApplication.replace(":applicationId", applicationId))
    return response.data
}










