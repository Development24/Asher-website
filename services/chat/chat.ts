import { api, apiFormData } from "@/lib/config/api";


const URL = 'api/chats'

const chatURL = {
    create: "/room/message",
    get: "/room/:id",
    userRoom: "/rooms"
}

// Response types
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  [key: string]: any;
}

export interface ChatRoom {
  id: string;
  users: string[];
  messages: ChatMessage[];
  [key: string]: any;
}

export interface CreateChatResponse {
  message: string;
  chat: ChatMessage;
}

export interface GetUserChatsResponse {
  room: ChatRoom;
  message?: string;
}

export interface GetUserRoomsResponse {
  rooms: ChatRoom[];
  message?: string;
}

export const createChat = async (payload: {content:string, receiverId:string}): Promise<CreateChatResponse> => {
    const response = await apiFormData.post(URL + chatURL.create, payload)
    return response.data
}

export const getUserChats = async (id: string): Promise<GetUserChatsResponse> => {
    const response = await api.get(URL + chatURL.get.replace(':id', id))
    return response.data
}

export const getUserRooms = async (): Promise<GetUserRoomsResponse> => {
    const response = await api.get(URL + chatURL.userRoom)
    return response.data
}