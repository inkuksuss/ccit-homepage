/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import passportLocalMongoose from 'passport-local-mongoose';


const UserSchema = new mongoose.Schema({
    name: String, // 유저 이름: 타입 스트링
    email: String, // 유저 이메일: 타입 스트링
    avatar: String, // 사진: 타입 스트링
    token: String, // 토큰: 타입 스트링
    comments: [ // 댓글 Comment 스키마와 연동
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    videos: [ // 비디오 Video 스키마와 연동
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    photos: [ // 사진 Photo 스키마와 연동
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Photo'
        }
    ], 
    key: [ // 제품 Product 스키마와 연동
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'DHT11'
        }
    ]
}, { 
    versionKey: false
});

UserSchema.statics.findByToken = (token) => {
    if(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
};

UserSchema.plugin(passportLocalMongoose, { usernameField: "email"});

const model = mongoose.model("User", UserSchema);

export default model;