import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
    fileUrl: {
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
    }
});

const model = mongoose.model('Board', BoardSchema);
export default model;