import { messageApi, useApiClient } from "@/utils/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Alert } from "react-native";


export const useMessage = (userId? : string) => {
    const [content, setContent ] = useState("");
    const [selectedImage, setSelectedImage ] = useState<string | null>(null);
    const api = useApiClient();
    const queryClient = useQueryClient();
    const { data : chatPartners, isLoading : isLoadingPartner } = useQuery({
        queryKey : ["chatPartners"],
        queryFn : () => messageApi.getChatPartners(api),
        select : (res) => res.data
    })

    const { data : messages, isLoading : isMessagesLoading, refetch : refetchMessages } = 
    useQuery({
        queryKey : ["messages", userId],
        enabled : !!userId,
        queryFn : () => messageApi.getMessagesByUserId(api, userId || ""),
        select : (res) => res.data
    })

    const sendMessageMutation = useMutation({
        mutationFn :async (messageData : {content : string, imageUri? : string}) => messageApi.sendMessage(api,messageData, userId || ""),
        onSuccess : () => queryClient.invalidateQueries({ queryKey : ["messages", userId]}),
        onError : (error) => {
                console.error("Failed to send Message", error.message);
                Alert.alert("Error", "Failed to send Message");
        }
    });

    const sendMessage = () => {
        if(!content && !selectedImage) {
            Alert.alert("Empty Message", "Please enter some content or select an image");
            return;
        }

        const messageData : { content : string, imageUri? : string} = {
            content : content.trim(),
        }

        if(selectedImage) messageData.imageUri = selectedImage;
        
        sendMessageMutation.mutate(messageData);
    }

    return {
        chatPartners,
        isLoadingPartner,
        messages,
        isMessagesLoading,
        refetchMessages,
        sendMessage,
    }
}