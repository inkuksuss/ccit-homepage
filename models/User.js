import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatar: String,
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

UserSchema.plugin(passportLocalMongoose, { usernameField: "email"});

const model = mongoose.model("User", UserSchema);

export default model;