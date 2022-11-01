import express from "express";
import { CarController } from "../Controllers/CarController.js";
import multer from "multer";
import { isAuthenticated } from "../middleware/authorize.middleware.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

const carController = new CarController();

/**
 * @description Authentication Routes
 */
const router = express.Router();


router.get("/", isAuthenticated, carController.get);
router.get("/:id", isAuthenticated, carController.getById);
router.post("/", [isAuthenticated, upload.single('image')], carController.create.bind(carController));
router.put("/:id", isAuthenticated, carController.update.bind(carController));
router.delete('/:id', isAuthenticated, carController.deleteById)

export default router;
