import mongoose from "mongoose";

const { Schema } = mongoose;
const carSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categories"
    },
    color: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    make: {
        required: true,
        type: String
    },
    registrationNo: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
},
    { timestamps: true }
);

export const Cars = mongoose.model("cars", carSchema);
