import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: "Title is required",
    },
    description: { 
        type: String,
        required: "Description is required",
    },
    createdAt: { // 생성일
        type: Date,
        default: Date.now,
    },
    complainer: { // 생성자 User 스키마와 연동
        type: mongoose.Schema.Types.ObjectId,
        rel: "User"
    },
    complainedVideo: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "Video"
    }
});

const model = mongoose.model("Complain", ComplainSchema);
export default model;
