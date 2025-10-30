import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";


export const getAllContacts = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    try {
        const filteredContacts = await User.find({ clerkId : { $ne : userId } });
        res.status(200).json({ filteredContacts });
    } catch (error) {
        console.log("Error fetching contacts", error);
        res.status(500).json({ error: "Server Error" });
    }
});

export const getMessagesByUserId = asyncHandler(async (req,res) => {
    try {
        const { userId } = getAuth(req);
        const { id : userToChatId } = req.params;

        const messages = await Message.find({
            $or : [
                { senderId : userId, receiverId : userToChatId },
                { senderId : userToChatId, receiverId : userId },
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in controller", error);
        res.status(500).json({ error: "Server Error" });
    }
});

export const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { content } = req.body;
        const { id : receiverId } = req.params
        const { userId : senderId } = getAuth(req);
        const imageFile = req.file;


        if(!content && !imageFile){
        return res.status(400).json({ error : "Message must contain some text or Imgae"});
        }
        
        if(senderId === receiverId){
            return res.status(400).json({ error : "You cannot send message to yourself"});
        }

        const receiverExist = await User.exists({ clerkId : receiverId });
        if(!receiverExist){
            return res.status(404).json({ error : "Receiver not found"});
        }

        let imageUri;
        if(imageFile){
            try {
                        const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;
            
                        const uploadResponse = await cloudinary.uploader.upload(base64Image,{
                            folder : "social_media_posts",
                            resource_type : "image",
                            transformation: [
                                { width : 800, height : 600, crop : 'limit'},
                                { quality : "auto" },
                                { format : "auto" }
                            ]
                        });
                        imageUri  = uploadResponse.secure_url;
                    } catch (uploadError) {
                        console.error("Cloudinary upload error:", uploadError);
                        return res.status(400).json({ error : "Error uploading image"});
                    }
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text : content,
            image : imageUri,            
        })

        await newMessage.save();
        return res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
})

export const getChatPartners = asyncHandler(async (req,res) => {
    try {
        const { userId } = getAuth(req);
        const messages = await Message.find({
            $or : [
                { senderId : userId },
                { receiverId : userId },
            ],
        });

         const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                msg.senderId.toString() === userId
                ? msg.receiverId.toString()
                : msg.senderId.toString()
                )
            ),
        ];

        const chatPartners = await User.find({ clerkId: { $in: chatPartnerIds } });
        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error in getChatPartners: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
})