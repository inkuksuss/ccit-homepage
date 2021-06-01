import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    videoUrl: { // 비디오 주소
        type: String,
        required: 'File URL is required'
    },
    title: { // 비디오 제목
        type: String,
        required: 'Title is required'
    },
    description: String, // 비디오 상세정보
    views: { // 비디오 조회수
        type: Number,
        default: 0
    },
    createdAt: { // 비디오 생성일
        type: Date,
        default: Date.now
    },
    comments: [ // 댓글 Comment 스키마와 연동
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
        }
    ],
    creator: { // 생성자 User 스키마와 연동
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const model = mongoose.model('Video', VideoSchema);
export default model;