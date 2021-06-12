import mongoose from "mongoose";

const WeightSchema = new mongoose.Schema({
    controller: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        rel: "User"
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        rel: "Product"
    },
    time: { // 생성일
        type: Date,
        default: Date.now,
    },
    weg: {
        type:Number,
        required: true
    }
});

const model = mongoose.model("Weight", WeightSchema);
export default model;
