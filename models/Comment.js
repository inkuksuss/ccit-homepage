import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: { // 댓글 내용
    type: String,
    required: "Text is required",
  },
  createdAt: { // 생성일
    type: Date,
    default: Date.now,
  },
  creator: { // 생성자 User 스키마와 연동
    type: mongoose.Schema.Types.ObjectId,
    rel: "User"
  },
  displayName: { // 댓글 닉네임
    type: String,
    required: "Name is required"
  }
});

const model = mongoose.model("Comment", CommentSchema);
export default model;
