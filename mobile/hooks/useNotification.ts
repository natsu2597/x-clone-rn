import { useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotification = () => {
    const api = useApiClient();
    const queryCleint = useQueryClient();

    const { data: notificationsData , isLoading, error, refetch, isRefetching} = useQuery({
        queryKey : ['notifications'],
        queryFn : () => api.get("/notifications"),
        select : (res) => res.data.notifications
    });

    const deleteNotificationMutation = useMutation({
        mutationFn : (notificationId : string) => api.delete(`/notifications/${notificationId}`),
        onSuccess : () => queryCleint.invalidateQueries({ queryKey : ['notifications'] }),
    });

    const deleteNotification = (notificationId : string) => {
        deleteNotificationMutation.mutate(notificationId);
    }

    return {
        notifications : notificationsData || [],
        isLoading,
        error,
        refetch,
        isRefetching,
        deleteNotification,
        isDeletingNotification : deleteNotificationMutation.isPending
    }


}

