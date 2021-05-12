/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import passportLocalMongoose from 'passport-local-mongoose';


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatar: String,
    token: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    photos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Photo'
        }
    ],
    dataByDht: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DHT11'
        }
    ],
    key: [
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