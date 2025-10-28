import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import SignOutButton from '@/components/SignOutButton'
import { useSyncUser } from '@/hooks/useSyncUser'
import { Ionicons } from '@expo/vector-icons'
import PostMaker from '@/components/PostMaker'
import PostList from '@/components/PostList'
import { usePosts } from '@/hooks/usePosts'

const HomeScreen = () => {
  const { refetch, isLoading : isRefetching} = usePosts();
  useSyncUser();
  return (
    <SafeAreaView className='flex-1'
    >
      <View className='flex-row justify-between px-4 py-3 border-b border-gray-100'>
        <Ionicons name='logo-x' size={24} color="#1DA1F2" />
        <Text className='text-xl font-bold text-gray-900'>Home</Text>
        <SignOutButton />
      </View>
      <ScrollView
      className='flex-1'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom : 80}}
       refreshControl={
            <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor="#1DA1F2"
            />
          }
      >
        <PostMaker />
        <PostList />
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen