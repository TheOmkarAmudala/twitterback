import express from "express";
import {
    Register,
    Login,
    Logout,
    Bookmarks,
    getmyprofile,
    othersprofile,
    follow,
    getAllTweets
} from "../controllers/userControler.js";
import {isAuth} from "../config/auth.js";
import router1 from "./tweetroute.js";




const router = express.Router();



router.route("/register").post(Register);
router.route("/login").post(Login)
router.route("/logout").get(Logout)
router.route("/bookmarks/:id").put(isAuth,Bookmarks)
router.route("/profile/:id").get(isAuth,getmyprofile)
router.route("/all_profiles/:id").get(isAuth,othersprofile)
router.route("/followers/:id").get(isAuth,follow)
router.route("/getAllTweets/:id").get(isAuth,getAllTweets)



export default router;