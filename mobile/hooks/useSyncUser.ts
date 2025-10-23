import { useApiClient, userApi } from "../utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";





export const useSyncUser = () => {
    const { isSignedIn } = useAuth();
    const api = useApiClient();

    const syncUserMutation = useMutation({
        mutationFn :async () => {
            try {
        const response = await userApi.syncUser(api);
        return response;
      } catch (error: any) {
        // Log full Axios error for debugging
        console.error("Axios Error Details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        throw error; // re-throw so React Query triggers onError
      }
        },
        onSuccess : (response : any) => console.log("User Synced Successfully", response.data.messsage),
        onError : (error) => console.error("Failed to sync User", error.message),
    });

    useEffect(() => {
        if(isSignedIn && !syncUserMutation.data){
            syncUserMutation.mutate();
        }
        
    }, [isSignedIn])
    return syncUserMutation;
}