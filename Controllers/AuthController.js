import { request, response } from "express";
import bcrypt from "bcryptjs";
import { Users } from "../Models/User.model.js";
import { generate } from "generate-password";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { transport } from "../configs/nodemailer.config.js";


export class AuthController {
    /**
     * @Class Authentication Controller
     * @return Auth methods
     * @author Ubaid Qureshi
     */
    constructor() { }

    /**
     * Register a user
     * @param {request} req Request
     * @param {String} req.body.email
     * @param {response} res Response
     * @returns User & Auth Token
     */
    async register(req, res) {
        const validator = Joi.object().keys({
            firstName: Joi.string().required().label("First Name"),
            lastName: Joi.string().required().label("Last Name"),
            email: Joi.string().email().required().label("Email"),
        }).validate(req.body).error?.details;

        if (validator?.length) {
            return res.status(400).json({ errors: validator });
        }
        try {
            const { email } = req.body;
            const isUser = await Users.exists({ email })
            if (isUser) {
                return res.status(400).json({ errors: [{ message: "Email already exists" }] });
            }
            const password = generate()
            const passwordHashed = await bcrypt.hash(password, 10);
            const user = await Users.create({ ...req.body, password: passwordHashed });
            const msg = await transport.sendMail({
                to: user.email,
                from: "noreply@test.com",
                subject: "Account registered",
                html: `<span>Email: ${user.email} <br /> Password: ${password}</span>`
            })
            console.log(msg);
            return res.status(201).json({ message: "Successfully Registered!" });
        } catch (error) {
            return res.status(400).json({ errors: [{ message: error.message }] });
        }
    }

    /**
     * Authenticates user and login
     * @param {request} req Request 
     * @param {response} res Response
     * @return {Promise<Response>} User & Auth Token
     * @author Ubaid Qureshi
     */
    async login(req, res) {
        const validator = Joi.object({
            email: Joi.string().email().required().label("Email"),
            password: Joi.string().required().label("Password"),
        }).validate(req.body).error?.details;

        if (validator?.length) {
            return res.status(400).json({ errors: validator });
        }
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email: email });
            if (!user) {
                return res.status(400).json({ errors: [{ message: "Invalid Email or Password..." }] });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ errors: [{ message: "Invalid Email or Password..." }] });
            }
            delete user.password;
            const token = jwt.sign(user.toObject(), process.env.TOKEN_SECRET)
            res.cookie('Authorization', token, { httpOnly: true, secure: true, sameSite: "none" })
            return res.status(200).json({ user, token });
        } catch (error) {
            return res.status(400).json({ errors: [{ message: error.message }] });
        }
    }
}
