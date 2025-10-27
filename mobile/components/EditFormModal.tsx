import { View, Text, Modal, Touchable, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native'
import React from 'react'

interface EditFormModalProps {
    isVisible : boolean;
    isUpdating : boolean;
    formData : {
        firstName : string;
        lastName : string;
        bio : string;
        location : string;
    };
    onClose : () => void;
    saveProfile : () => void;
    updateFormField : (field : string, value : string) => void;

}

const EditFormModal = ({ isVisible, isUpdating, formData, onClose, saveProfile, updateFormField}: EditFormModalProps) => {
    const handleSave = () => {
        saveProfile();
        onClose();
    }

    return (
      <Modal visible={isVisible} animationType='slide' presentationStyle='pageSheet'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
            <TouchableOpacity onPress={onClose}>
                <Text className='text-b;ue-500 text-lg'>
                    Close
                </Text>
            </TouchableOpacity>

            <Text className='text-lg font-semibold'>Edit Profile</Text>

            <TouchableOpacity
            onPress={handleSave}
            disabled={isUpdating}
            className={`${isUpdating ? "opacity-50" : ""}`}
            >
                {isUpdating ? (
                    <ActivityIndicator size="small" color="#1DA1F2" />
                ) : (
                    <Text className='text-blue-500 text-lg font-semibold'>
                        Save
                    </Text>
                )}
            </TouchableOpacity>    
        </View>
        {/* Content */}
        <ScrollView className='flex-1 px-4 py-6'>
            <View className='space-y-4'>
                <View>
                    <Text className='text-gray-500 text-sm mb-2'>First Name</Text>
                    <TextInput 
                    className='border border-gray-200 rounded-lg p-3 text-base'
                    onChangeText={(text) => updateFormField("firstName", text)}
                    placeholder='Your first name'
                    value={formData.firstName}
                    />
                </View>

                <View>
                    <Text className='text-gray-500 text-sm mb-2'>Last Name</Text>
                    <TextInput 
                    className='border border-gray-200 rounded-lg p-3 text-base'
                    onChangeText={(text) => updateFormField("lastName", text)}
                    placeholder='Your last name'
                    value={formData.lastName}
                    />
                </View>

                <View>
                    <Text className='text-gray-500 text-sm mb-2'>Bio</Text>
                    <TextInput 
                    className='border border-gray-200 rounded-lg p-3 text-base'
                    onChangeText={(text) => updateFormField("bio", text)}
                    placeholder='About Yourself'
                    value={formData.bio }
                    multiline
                    numberOfLines={3}
                    textAlignVertical='top'
                    />
                </View>

                <View>
                    <Text className='text-gray-500 text-sm mb-2'>Location</Text>
                    <TextInput 
                    className='border border-gray-200 rounded-lg p-3 text-base'
                    onChangeText={(text) => updateFormField("location", text)}
                    placeholder='Your Location'
                    value={formData.location}
                    />
                </View>
            </View>


                
        </ScrollView>
      </Modal>
    )
}

export default EditFormModal