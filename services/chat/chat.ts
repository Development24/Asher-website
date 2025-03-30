import { api, apiFormData } from "@/lib/config/api";


const URL = 'api/chats'

const chatURL = {
    create: "/room/message",
    get: "/room/:id",
    userRoom: "/rooms"
}

export const createChat = async (payload: {content:string, receiverId:string}) => {
    const response = await apiFormData.post(URL + chatURL.create, payload)
    return response.data
}

export const getUserChats = async (id: string) => {
    const response = await api.get(URL + chatURL.get.replace(':id', id))
    return response.data
}

export const getUserRooms = async () => {
    const response = await api.get(URL + chatURL.userRoom)
    return response.data
}