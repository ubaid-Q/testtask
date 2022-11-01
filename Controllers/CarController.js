import JOI from "joi";
import { Cars } from "../Models/Cars.model.js";
import { isValidObjectId } from "mongoose";
import { Categories } from "../Models/Categories.model.js";

export class CarController {
    /**
     * @summary Cars Controller
     */
    constructor() { }


    #carSchema = {
        name: JOI.string().required().label("Car Name"),
        color: JOI.string().required().label("Color"),
        model: JOI.string().required().label("Model"),
        make: JOI.string().required().label("Make"),
        registrationNo: JOI.string().required().label("Registration No"),
        image: JOI.string().required().label("Image"),
        category: JOI.string().required().label("Category")
    }

    /**
     * Create a Car
     * @param {Request} req
     * @param {Response} res
     */
    async create(req, res) {
        req.body.image = req.file?.path;
        const validator = JOI.object().keys(this.#carSchema).validate(req.body).error?.details;

        if (validator?.length) {
            return res.status(400).json({ errors: validator });
        }
        try {
            const car = await Cars.create(req.body)
            car.populate("category")
            car.toObject();
            return res.status(201).json({ success: "Successfully Created.", car });
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }


    /**
     * Retrieve all Cars
     * @param {Request} req
     * @param {Response} res
     */
    async get(req, res) {
        try {
            if (req.query.count) {
                const carsCount = await Cars.count();
                return res.status(200).json({ carsCount });
            }
            const cars = await Cars.find().populate("category");
            return res.status(200).json({ cars });
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }


    /**
     * Retrive Car By Id
     * @param {Request} req
     * @param {Response} res
     */
    async getById(req, res) {
        try {
            const carId = req.params.id;
            const isValidId = isValidObjectId(carId);
            if (!isValidId) return res.status(404).json({ errors: [{ message: "No car found." }] })

            const car = await Cars.findById(carId).populate("category");
            if (!car) return res.status(404).json({ errors: [{ message: "No car found." }] })

            return res.status(200).json({ car })
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }

    /**
     * Update a Car
     * @param {Request} req 
     * @param {Response} res 
     */
    async update(req, res) {
        const validator = JOI.object().keys({
            name: JOI.string().optional().label("Car Name"),
            color: JOI.string().optional().label("Color"),
            model: JOI.string().optional().label("Model"),
            make: JOI.string().optional().label("Make"),
            registrationNo: JOI.string().optional().label("Registration No"),
            category: JOI.string().optional().label('Category'),
            image: JOI.string().optional().label("Image"),
        }).validate(req.body).error?.details;

        if (validator?.length) {
            return res.status(400).json({ errors: validator });
        }
        try {
            const carId = req.params.id;
            const isValidId = isValidObjectId(carId);
            if (!isValidId) return res.status(404).json({ errors: [{ message: "No car found." }] })

            const car = await Cars.findByIdAndUpdate({ _id: carId }, { $set: req.body }, { new: true }).populate('category')
            if (car) return res.status(200).json({ success: "Updated Successfully!", car })

            return res.status(400).json({ errors: [{ message: "Something went Wrong." }] })
        } catch (error) {
            return res.status(500).json({ errors: [{ message: error.message }] });
        }
    }


    /**
     * Delete a car
     * @param {Request} req
     * @param {Response} res
     */
    async deleteById(req, res) {
        const carId = req.params.id;
        const isValidId = isValidObjectId(carId);
        if (!isValidId) return res.status(404).json({ errors: [{ message: "No car found." }] })

        const car = await Cars.findByIdAndRemove(carId, { lean: true })
        if (car) return res.status(200).json({ success: "Deleted Successfully!" })

        return res.status(400).json({ errors: [{ message: "Something went Wrong." }] })
    }
}
