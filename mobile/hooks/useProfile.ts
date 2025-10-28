import { useApiClient, userApi } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use, useState } from "react"
import { useCurrentUser } from "./useCurrentUser";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";



export const useProfile = () => {
    const api = useApiClient();
    const [selectedImage, setSelectedImage] = useState<string | null>("");

    const queryClient = useQueryClient();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [formData,setFormData] = useState({
        firstName : "",
        lastName : "",
        bio : "",
        location : "",
    });
    const [dpFormData, setDpFormData] = useState<{ dp : string | null}>({ dp : null });
    const {currentUser} = useCurrentUser();

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
                Alert.alert("Permission needed",100 + `Please grant permission to access the ${source}`);
                return
            }
    
            const pickerOptions = {
                allowEditing : true,
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
    
        const changeDp = ( imageUri : string) => {
            setDpFormData({ dp : imageUri });
        };

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
        changeDp,
        isUpdating : updateProfileMutation.isPending,
        refetch : () => queryClient.invalidateQueries({ queryKey : ["authUser"] }),
    }


}