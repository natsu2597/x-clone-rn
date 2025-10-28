import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";


const API_BASE_URL = "https://x-clone-rn-umber.vercel.app/api";

// const API_BASE_URL = "http://localhost:5001/api";


export const createApiClient = (getToken : () => Promise<string | null>): AxiosInstance => {
    const api = axios.create({ 
        baseURL : API_BASE_URL,
        headers: {
                "User-Agent":
                "Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0 Mobile Safari/537.36",
                },
    });
    
    api.interceptors.request.use(async (config) => {
        const token = await getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    })
    return api;
}

export const useApiClient = () : AxiosInstance => {
    const { getToken } = useAuth();
    return createApiClient(getToken);
}

export const userApi = {
    syncUser : (api: AxiosInstance) => api.post("/users/sync"),
    getCurrentUser : (api : AxiosInstance) => api.get("/users/me"),
    updateProfile : (api : AxiosInstance, data: any) => api.put("/users/profile",data),
    updateDp : async (api : AxiosInstance, imageUri : string) => {
        const formData = new FormData();
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();

         const mimeTypeMap : Record<string, string> = {
                    png : "image/png",
                    gif : "image/gif",
                    webp : "image/webp",
                } 

        const mimeType = mimeTypeMap[fileType] || "image/jpeg";
        formData.append("dp", {
            uri : imageUri,
            name : `profile.${fileType}`,
            type : mimeType,
        } as any)

        try {
        const res = await api.put("/users/profile/dp", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Upload response:", res.data);
        return res.data;
        } catch (err: any) {
        console.error("Upload failed:", err.response?.data || err.message);
        throw err;
    }
    },
    getUserProfile : (api : AxiosInstance, username : string) => api.get(`/users/profile/${username}`),
    toggleFollow : (api : AxiosInstance, targetUserId : string) => api.post(`/users/follow/${targetUserId}`),
}

export const postApi = {
    createPost : (api : AxiosInstance, data : {content : string, imageUri? : string }) => api.post("/posts",data),
    getPosts : (api : AxiosInstance) => api.get("/posts"),
    getUserPosts : (api : AxiosInstance, username : string) => api.get(`/posts/user/${username}`),
    likePost : (api : AxiosInstance, postId : string) => api.post(`/posts/${postId}/like`),
    deletePost : (api : AxiosInstance, postId : string) => api.delete(`/posts/${postId}`),
}

export const commentApi = {
    createComment : (api : AxiosInstance, postId : string, content : string ) => api.post(`/comments/post/${postId}`, { content })
}