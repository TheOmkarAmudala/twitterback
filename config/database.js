import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
    path:"../config/.env"
})
const dataBaseConnection = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("connected to database");
    }).catch((error) => {
        console.log(error);
    })
}

export default dataBaseConnection;