import { user } from "../modules/userschema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {Tweet} from "../modules/tweetschema.js";
import promise from "express/lib/application.js";

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !password || !email) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            });
        }
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists.",
                success: false
            });
        }

        const hashpassword = await bcryptjs.hash(password, 16);
        await user.create({
            name,
            username,
            password: hashpassword,
            email
        });
        return res.status(201).json({
            message: "Registered Successfully",
            user,
            success: true,

        });
    } catch (e) {
        console.log(e.message);
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            });
        }
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                message: "User doesn't exist.",
                success: false
            });
        }
        const isMatch = await bcryptjs.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password.",
                success: false
            });
        }
        const tokendata = {
            userId: existingUser._id
        };
        const token = await jwt.sign(tokendata, process.env.TOKEN_KEY, { expiresIn: "1d" });
        console.log(token)
        return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: `Welcome back ${existingUser.name} existing user` ,
            success: true,
            existingUser
        });
    } catch (e) {
        console.log(e);
    }
};

export const Logout = async (req,res) => {
    return res.cookie("token","",{httpOnly: true}).json({
        message: "logout successful",
        success:true
    })
}

export const Bookmarks = async (req, res) => {
    const userid = req.body.id;
    const tweetid = req.params.id;
    console.log(userid, tweetid);

    try {
        const tweet = await Tweet.findById(tweetid);
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        if (tweet.bookmarks && tweet.bookmarks.includes(userid)) {
            await Tweet.findByIdAndUpdate(tweetid, { $pull: { bookmarks: userid } });
            console.log(tweetid);
            res.status(200).json({
                message: "bookmark removed successfully",
                success: true
            });
        } else {
            await Tweet.findByIdAndUpdate(tweetid, { $push: { bookmarks: userid } });
            console.log(tweet.Likes); // This should print the likes array after the update
            res.status(200).json({
                message: "bookmark added successfully",
                success: true
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const getmyprofile = async (req,res) => {
    try {
        const id = req.params.id
        const User = await user.findById(id).select("-password");
        console.log(id);
        return res.status(200).json({User})
    }catch (e){
        console.log(e)
    }
}

export const othersprofile = async (req,res) => {
    try{
       const {id} = req.params;
       const otherusers = await user.find({_id:{$ne:id}})
        if(!otherusers){
            return res.status(401).json({
                message: "there is no users avaible",
                success: true
            })
        }
        return res.status(201).json({
            otherusers
        })
    }catch (e){
        console.log(e)
    }
}
export const follow = async (req, res) => {
    try {
        const loggedInUser = req.body.id;
        const UserId = req.params.id;
        const loggedInUserId = await user.findById(loggedInUser);
        const User = await user.findById(UserId);

        if (!User.followers.includes(loggedInUserId._id)) {
            await User.updateOne({ $push: { followers: loggedInUserId._id } });
            await loggedInUserId.updateOne({ $push: { following: User._id } });
            return res.status(200).json({
                message: "You are following successfully",
                success: true,
            });
        } else {
            await User.updateOne({ $pull: { followers: loggedInUserId._id } });
            await loggedInUserId.updateOne({ $pull: { following: User._id } });
            return res.status(401).json({
                message: "You are unfollowed this user",
                success: false,
            });
        }
    } catch (e) {
        console.log(e);
    }
};
export const getAllTweets = async (req, res) => {
    try {
        const Userid = req.params.id;
        const loggedInUserId = await user.findById(Userid);
        const loggedInUserTweets = await Tweet.find({ userId: Userid });

        const otherTweetsPromises = loggedInUserId.following.map(async (otherUserId) => {
            return await Tweet.find({ userId: otherUserId });
        });
        const otherTweets = await Promise.all(otherTweetsPromises);

        // Combine the arrays of tweets into a single array
        const allTweets = loggedInUserTweets.concat(...otherTweets);
        res.status(200).json(allTweets);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}

