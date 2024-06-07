import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config({
    path:"../config/.env"
})
 export const isAuth = async (req,res,next) => {
    try{
        const token = req.cookies.token;

        console.log(token, "tokem is here");
        if(token){
            return res.status(401).json({
                message:"user not authenticated why soo",
                success:false
            })
        }
            next();
    }catch (e){
        console.log(e)
    }
}
