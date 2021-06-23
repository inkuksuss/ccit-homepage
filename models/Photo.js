import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
    photoUrl: {
        type: String,
        required: 'File URL is required'
    },
    title: {
        type: String,
        required: 'Title is required'
    },
    description: String,
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    complain: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PhotoComplain"
        }
    ]
});

const model = mongoose.model('Photo', PhotoSchema);
export default model;