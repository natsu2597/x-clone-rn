import { useApiClient, userApi } from "@/utils/api"
import { useQuery } from "@tanstack/react-query";




export const useFetchUserProfile = (username : string) => {
    const api = useApiClient();

    const { data : userProfile, isLoading, error, refetch } = useQuery({
        queryKey : ["userProfile", username],
        queryFn : () => userApi.getUserProfile(api,username),
        select : (response) => response.data.user,
    })

    return { userProfile, isLoading, error, refetch };
}