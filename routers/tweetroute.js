import express from "express";
import {createTweet, deletetweet, likesanddislikes} from "../controllers/tweetController.js";
import {isAuth} from "../config/auth.js";



const router1 = express.Router();



    router1.route("/createtweet").post(isAuth,createTweet);
router1.route("/deletetweet/:id").delete(deletetweet)

router1.route("/likesanddislikeds/:id").put(isAuth,likesanddislikes)





export default router1;