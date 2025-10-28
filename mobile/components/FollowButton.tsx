import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type FollowProps = {
    isFollowed : boolean,
    id : string,
    handleFollow : (id : string) => void,
    isFollowing : boolean
}

const FollowButton = ({isFollowed, id, handleFollow, isFollowing}: FollowProps) => {
  return (
    <TouchableOpacity className={`border ${isFollowed ? "border-black-300" : "border-gray-300"} px-6 py-2 rounded-full ${isFollowed ? "bg-white" : "bg-black"}`} onPress={() => handleFollow(id)} disabled={isFollowing}>
        <Text className='font-semibold text-white'>{isFollowed ? "Following" : "Follow"}</Text>
    </TouchableOpacity>
  )
}

export default FollowButton