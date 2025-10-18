import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import { clerkClient, getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js"

export const getUserProfile = asyncHandler(async (req,res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if(!user) return res.status(404).json({ error : "User not Founnd"})
        return res.status(200).json({ user });
})

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    //updates handler
    const allowedUpdates = ['firstName', 'lastName', 'dp', 'bannerImage', 'bio', 'location'];
    const updates = {};
    for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }


    const user = await User.findOneAndUpdate(
        { clerkId : userId }
    , updates, { new : true })
    
    if(!user) return res.status(404).json({ error : "User not found"})
        
        return res.status(200).json({ user });
})

export const syncUser = asyncHandler(async(req, res) => {
    const { userId } = getAuth(req);

    const existingUser = await User.findOne({ clerkId : userId });
    if(existingUser){
        return res.status(200).json({ user : existingUser, messsage : "User already exist"});
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
        clerkId : userId,
        email : clerkUser.emailAddresses[0].emailAddress,
        firstName : clerkUser.firstName || "",
        lastName : clerkUser.lastName || "",
        username : clerkUser.emailAddresses[0].emailAddress.split("@")[0],
        dp : clerkUser.imageUrl || "",
    }

    const user = await User.create(userData); 

    res.status(201).json({ user, messsage: "User created successfully"});
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId : userId });

    if(!user) return res.status(404).json({ message : "User not found"});
    res.status(200).json({ user });
})

export const followUser = asyncHandler(async (req,res) => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params

    if(userId === targetUserId ) return res.status(200).json({ error : "You cannot follow yourself duh..."})

    const currentUser = await User.findOne({ clerkId : userId });
    const targetUser = await User.findById(targetUserId);

    const isFollowing = currentUser.following.includes(targetUserId);

    if(isFollowing){
        await User.findByIdAndUpdate(currentUser._id, {
            $pull : {
                following : targetUserId
            }
        });

        await User.findByIdAndUpdate(targetUser._id,{
            $pull : {
                followers : currentUser._id
            }
        });
    }

    else{
        await User.findByIdAndUpdate(currentUser._id, {
            $push : {
                following : targetUserId
            }
        });

        await User.findByIdAndUpdate(targetUser._id, {
            $push : {
                followers : currentUser._id
            }
        });

        await Notification.create({
            from : currentUser._id,
            to : targetUserId,
            type : "follow",
        });
    }

    res.status(200).json({ message : isFollowing ? `Unfollowed ${targetUser.username}` : `Followed ${targetUser.username}`});


})