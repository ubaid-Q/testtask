import JOI from "joi";
import { Categories } from "../Models/Categories.model.js";
import { isValidObjectId } from "mongoose";

export class CategoryController {
    /**
     * @summary Category Controller
     */
    constructor() { }

    /**
     * Create a Category
     * @param {Request} req
     * @param {Response} res
     */
    async create(req, res) {
        const validator = JOI.object().keys({
            name: JOI.string().required().label("Category Name"),
        }).validate(req.body).error?.details;

        if (validator?.length) {
            return res.status(400).json({ errors: validator });
        }
        try {
            const name = req.body.name.toString().trim().toLowerCase();
            const isCat = await Categories.exists({ name:name });
            if (isCat) {
                return res.status(400).json({ errors: [{ message: "Category already exists..." }] });
            }
            const category = await Categories.create({ name });
            category.toObject();
            return res.status(201).json({ success: "Successfully Created.", category });
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }


    /**
     * Retrieve all categories
     * @param {Request} req
     * @param {Response} res
     */
    async get(req, res) {
        try {
            const categories = await Categories.find();
            return res.status(200).json({ categories });
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }


    /**
     * Retrive Category By Id
     * @param {Request} req
     * @param {Response} res
     */
    async getById(req, res) {
        try {
            const categoryId = req.params.id;
            const isValidId = isValidObjectId(categoryId);
            if (!isValidId) return res.status(404).json({ errors: [{ message: "No category found." }] })

            const category = await Categories.findById(categoryId)
            if (!category) return res.status(404).json({ errors: [{ message: "No category found." }] })

            return res.status(200).json({ category })
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }

    /**
     * Update a Category
     * @param {Request} req 
     * @param {Response} res 
     */
    async update(req, res) {
        const validator = JOI.object().keys({
            name: JOI.string().required().label("Category Name"),
        }).validate(req.body).error?.details;

        if (validator?.length) {
            return res.status(400).json({ errors: validator });
        }
        try {
            const categoryId = req.params.id;
            const isValidId = isValidObjectId(categoryId);
            if (!isValidId) return res.status(404).json({ errors: [{ message: "No category found." }] })

            const category = await Categories.findOneAndUpdate(categoryId, { $set: req.body })
            if (category) return res.status(200).json({ success: "Updated Successfully!" })

            return res.status(400).json({ errors: [{ message: "Something went Wrong." }] })
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }


    /**
     * Delete a Category
     * @param {Request} req
     * @param {Response} res
     */
    async deleteById(req, res) {
        const categoryId = req.params.id;
        const isValidId = isValidObjectId(categoryId);
        if (!isValidId) return res.status(404).json({ errors: [{ message: "No category found." }] })

        const category = await Categories.findByIdAndRemove(categoryId, { lean: true })
        if (category) return res.status(200).json({ success: "Deleted Successfully!" })

        return res.status(400).json({ errors: [{ message: "Something went Wrong." }] })
    }
}
