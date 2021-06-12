import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    key: {
        type: String
    },
    controller: { // 생성자 User 스키마와 연동
        type: mongoose.Schema.Types.ObjectId,
        rel: "User"
    },
    FoodData: [
        {
            type: mongoose.Schema.Types.ObjectId,
            rel: "Food"
        }
    ],
    WeightData: [
        {
            type: mongoose.Schema.Types.ObjectId,
            rel: "Weight"
        }
    ]
});

const model = mongoose.model("Product", ProductSchema);
export default model;
