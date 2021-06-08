import mongoose from "mongoose";

const PhotoComplainSchema = new mongoose.Schema({
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
    complainedPhoto: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "Photo"
    }
});

const model = mongoose.model("PhotoComplain", PhotoComplainSchema);
export default model;
