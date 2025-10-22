import { useClerk } from "@clerk/clerk-expo"
import { Alert } from "react-native";



export const useSignOut = () => {
    const { signOut } = useClerk();

    const handleSignOut = () => {
        Alert.alert("Logout", "Are you Sure you wanna Log out?", [
            {text : "Cancel", style : "cancel"},
            {
                text : "logout",
                style : "destructive",
                onPress : () => signOut(),
            }
        ])
    }
    return { handleSignOut };
}