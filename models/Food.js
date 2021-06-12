import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
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
    amount: {
        type:Number,
        required: true
    },
    rest: {
        type:Number,
        default: 0
    }
});

const model = mongoose.model("Food", FoodSchema);
export default model;
