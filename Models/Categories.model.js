import mongoose from "mongoose";

const { Schema } = mongoose;
const categoriesSchema = new Schema({
    name: { type: String, required: true },
},
    { timestamps: true }
);

export const Categories = mongoose.model("categories", categoriesSchema);
