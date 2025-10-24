import { commentApi, useApiClient } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"
import { Alert } from "react-native";




export const useComment = () => {
    const  [commentText, setCommentText ] = useState("");
    const api = useApiClient();

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation({
        mutationFn : async ({ postId , content} : {postId : string, content : string}) => {
            const response = await commentApi.createComment(api, postId, content);
            return response.data;
        },

        onSuccess : () => {
            setCommentText("");
            queryClient.invalidateQueries({ queryKey : ["posts"]})
        },

        onError : () => {
            Alert.alert("Error", "Failed to post the comment");
        }
    });

    const createComment = (postId : string) => {
        if(!commentText.trim()){
            Alert.alert("Empty Comment", "Please write a comment before posting")
        }

        createCommentMutation.mutate( {postId, content : commentText.trim()} )
    }

    return {
        commentText,
        setCommentText,
        createComment,
        isCreatingComment : createCommentMutation.isPending,
    }
}