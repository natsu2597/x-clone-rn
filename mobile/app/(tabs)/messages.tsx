import { CONVERSATIONS, ConversationType } from '@/data/conversations';
import { View, Text, Alert, TouchableOpacity, TextInput, ScrollView, Image, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useMessage } from '@/hooks/useMessage';

const MessageScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSerchText ] = useState("");
  const [selectedConversation,  setSelectedConversation ] = useState<any>(null);
  const [isChatOpen, setIsChatOpen ] = useState(false);
  const [newMessage, setNewMessage ] = useState("");
  const { chatPartners,isLoadingPartner,isMessagesLoading,messages,refetchMessages,sendMessage } = useMessage(selectedConversation?.clerkId);

  const deleteConversation = (conversationId : number) => {
    Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
      {
        text : "Cancel", style : "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          
        }
      }
    ])
  }

  const openConversation = async (user : any) => {
    setSelectedConversation(user);
    setIsChatOpen(true);
  }

  const closeModal = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
    setNewMessage("");
  }

  if (isLoadingPartner)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );


  return (
    <SafeAreaView className='flex-1 bg-white edges={["top"]}'>
      {/* Header */}
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-900'>
          Messages
        </Text>
        <TouchableOpacity>
            <Feather name='edit' size={24} color="1DA1F2" />
        </TouchableOpacity>
      </View>
      {/* Search bar */}

      <View className='px-4 py-3 border-b border-gray-100'>
        <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-2'>
          <Feather name='search' size={20} color="#657786" />
          <TextInput 
          placeholder='Search for people'
          className='flex-1 ml-3 text-base'
          placeholderTextColor="#657786"
          value={searchText}
          onChangeText={setSerchText}
          />
        </View>
      </View>

      {/* Conversation List */}
      <ScrollView 
      className='flex-1'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom : 100 + insets.bottom }}
      >
        {chatPartners.map((partner : any) => (
          <TouchableOpacity
          key={partner.id}
          className='flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50'
          onPress={() => openConversation(partner)}
          >

            <Image source={{ uri : partner.dp }}
            className='size-12 rounded-full mr-3' />

            <View className='flex-1'>
              <View className='flex-row items-center justify-between mb-1'>
                <View className='flex-row items-center gap-1'>
                  <Text className='font-semibold text-gray-900'>
                    {partner.firstName} {partner.lastName}
                  </Text>
                  {/* {conversation.user.verified && (
                    <Feather name='check-circle' size={16} color="#1DA1F2" className='ml-1' />
                  )} */}
                  <Text className="text-gray-500 text-sm ml-1">@{partner.username}</Text>
                </View>
                {/* <Text className="text-gray-500 text-sm">{partner.timeStamps}</Text> */}
              </View>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <Text className="text-xs text-gray-500 text-center">
          Tap to open • Long press to delete
        </Text>
      </View>

      {/*  */}
    </SafeAreaView>
  )
}

export default MessageScreen