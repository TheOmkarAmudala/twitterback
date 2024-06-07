import express from "express";
import mongoose from "mongoose";
import { Tweet } from "../modules/tweetschema.js";
import { user } from "../modules/userschema.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "please provide description",
                success: false
            });
        }
        const User = await user.findById(id).select("-password");
        await Tweet.create({
            description,
            userId: id,
            userDetails: User
        });
        console.log(User)
        return res.status(201).json({
            message: "Tweeted successfully",
            success: true
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const deletetweet = async (req, res) => {
    try {
        const { id } = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message: "deleted successfully",
            success: true
        });
        console.log(id);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const likesanddislikes = async (req, res) => {
    const userid = req.body.id;
    const tweetid = req.params.id;
    console.log(userid, tweetid);

    try {
        const tweet = await Tweet.findById(tweetid);
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        if (tweet.Likes.includes(userid)) {
            await Tweet.findByIdAndUpdate(tweetid, { $pull: { Likes: userid } });
            console.log(tweetid);
            res.status(200).json({
                message: "Disliked successfully",
                success: true
            });
        } else {
            await Tweet.findByIdAndUpdate(tweetid, { $push: { Likes: userid } });
            console.log(tweet.Likes); // This should print the likes array after the update
            res.status(200).json({
                message: "Liked successfully",
                success: true
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
}


