import mongoose from 'mongoose';

const DHT11Schema = new mongoose.Schema({
    tmp: {
        type: String,
        required: 'Tmp is required'
    },
    hum: {
        type: String,
        required: 'Hum is required'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    key: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const model = mongoose.model('DHT11', DHT11Schema);
export default model;