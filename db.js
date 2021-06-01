import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { // DB connect
    useNewUrlParser: true, // DB 관련 설정
    useFindAndModify: false,
    useUnifiedTopology: true
    }
);

const db = mongoose.connection;
const handleOpen = () => console.log("😎Connected to DB") // DB connect 콜백
const handleError = (error) => console.log(`🥵Error on DB Connection: ${error}`) // DB Error 콜백

db.once("open", handleOpen);
db.on('error', handleError);

