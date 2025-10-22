import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { getAuth } from "@clerk/express";


export const search = asyncHandler(async (req, res) => {
    const { query } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId : userId });

    if(!user) return res.status(404).json({ error : "User not found" });

    const posts = await Post.find({
        "$or" : [
            {
                username : {
                    $regex : query,
                    $options : "i"
                }
            },
            {
                content : {
                    $regex : query,
                    $options : "i"
                }
            }
        ]
    });

})

