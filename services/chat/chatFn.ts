import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChat, getUserChats, getUserRooms } from "./chat";

export const useGetUserChats = (chatRoomId: string) => {
    return useQuery({
        queryKey: ['chatsRoom', chatRoomId],
        queryFn: () => getUserChats(chatRoomId),
        enabled: !!chatRoomId,
        retry: false,
    });
};

export const useGetUserRooms = () => {
    return useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            try {
                return await getUserRooms();
            } catch (error: any) {
                // Silently handle 404s for chat rooms - it's expected when no conversations exist yet
                if (error?.response?.status === 404) {
                    // Return empty rooms structure instead of throwing error
                    return { chatRooms: [], rooms: [] };
                }
                // Re-throw other errors
                throw error;
            }
        },
        // refetchInterval: 10000,
        // refetchIntervalInBackground: true,
        retry: false,
    });
};

export const useCreateChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { content: string; receiverId: string }) => createChat(payload),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['chatsRoom', data.chatRoomId] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });
};
