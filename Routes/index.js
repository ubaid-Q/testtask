import { Router } from "express";
import authRoute from "./auth.routes.js";
import categoryRoute from "./category.routes.js";
import carRoute from "./car.routes.js";
import { isAuthenticated } from "../middleware/authorize.middleware.js";


/**
 * Router Indexed 
 */
const router = Router();

router.use('/auth', authRoute)
router.use('/category', isAuthenticated, categoryRoute)
router.use('/car', isAuthenticated, carRoute)

export default router;

