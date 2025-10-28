import { useApiClient, userApi } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"
import { useCurrentUser } from "./useCurrentUser";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";



export const useProfile = () => {
    const api = useApiClient();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [formData,setFormData] = useState({
        firstName : "",
        lastName : "",
        bio : "",
        location : "",
    });
    const [dpFormData, setDpFormData] = useState<{ dp : string | null}>({ dp : null });
    const {currentUser} = useCurrentUser();
    const queryClient = useQueryClient();

    const updateProfileMutation = useMutation({
        mutationFn : (profileData : any) => userApi.updateProfile(api,profileData),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey : ["authUser"] });
            setIsEditModalVisible(false);
            Alert.alert("Success","Profile Updated Successfully!");
        },
        onError : (error : any) => {
            Alert.alert("Error","Failed to update Profile")
        }
    });

    const followMutation = useMutation({
        mutationFn : (targetUserId : string) => userApi.toggleFollow(api,targetUserId),
        onSuccess : (_, targetUserId) => {
            queryClient.invalidateQueries({ queryKey : ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile", targetUserId] });

            Alert.alert("Success","Followed Successfully!");
        },
        onError : (error : any) => {
            Alert.alert("Error","Failed to follow")
        }
    })

    const updateDpMutation = useMutation({
        mutationFn : async (imageUri : string) =>
        userApi.updateDp(api,imageUri),

        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey : ["authUser"] });
            Alert.alert("Success","DP changed Successfully!");
        },

        onError : (error : any) => {
            Alert.alert("Error","Failed to update dp")
        }
            

    })

    const handleImagePicker = async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
            if(permissionResult.status !== "granted"){
                const source = "image library"
                Alert.alert("Permission needed", `Please grant permission to access the ${source}`);
                return
            }
    
            const pickerOptions = {
                allowsEditing : true,
                aspect : [1,1] as [number,number],
                quality : 0.8,
            }
    
            const result = await ImagePicker.launchImageLibraryAsync({
                ...pickerOptions, mediaTypes : ["images"]
            });

    
            if(!result.canceled){
                const imageUri = result.assets[0].uri;
                setSelectedImage(imageUri);
                setDpFormData({ dp : imageUri });

                updateDpMutation.mutate(imageUri);

            } 
        }
    

    const openEditModal = () => {
        if(currentUser){
            setFormData({
                firstName : currentUser.firstName || "",
                lastName : currentUser.lastName || "",
                bio : currentUser.bio || "",
                location : currentUser.location || "",
            })
        }
        setIsEditModalVisible(true);
    }

    const updateFormField = (field: string, value : string) => {
        setFormData((prev) => ({...prev, [field] : value}))
    }

    const handleFollow = (targetUserId : string) => {
        followMutation.mutate(targetUserId)

    };

    const checkIsFollowed = (followers: string[], id : string) => {
        const isFollowed = followers?.includes(id);
        return isFollowed;
    };
    return{
        isEditModalVisible,
        formData,
        openEditModal,
        closeEditModal : () => setIsEditModalVisible(false),
        saveProfile : () => updateProfileMutation.mutate(formData),
        updateFormField,
        handleImagePicker,
        selectedImage,
        dpFormData,
        checkIsFollowed,
        isUpdating : updateProfileMutation.isPending,
        isFollowing : followMutation.isPending,
        handleFollow,
        refetch : () => queryClient.invalidateQueries({ queryKey : ["authUser"] }),
    }


}