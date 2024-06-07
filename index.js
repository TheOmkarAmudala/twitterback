import express from "express"
import  dotenv from "dotenv";
import dataBaseConnection from "./config/database.js";
import cookieParser from  "cookie-parser"
import router from "./routers/usercreation.js"
import router1 from "./routers/tweetroute.js"
import cors from "cors"

dotenv.config({
    path:".env"
})



const app = express();

dataBaseConnection();



app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser());
app.use(express.json());
const corsoption = {
    origin: "http://localhost:3001",
    credentials:true
}
app.use(cors(corsoption))

app.use("/api/v1/user", router);
app.use("/api/v1/tweet", router1);



app.get("/home", (req,res)=> {
    res.status(200).json({
        message: "coming from bckend"
    })
})


app.listen(3000, ()=> {
    console.log("The Server kingdom is ready to Thrive")

})