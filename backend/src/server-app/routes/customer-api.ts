import { Router } from "express";
import { createHandler } from "../utils/createHandler.js";
import { authenticate } from "../middleware/auth.js";
import { CustomerController } from "../controllers/CustomerControllers.js";
import { authorize } from "../middleware/authorize.js";
import { UserRole } from "../../domain/entities/User-Role.js";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation.js";

const router = Router();


router.get("/customer/list", authenticate, authorize(UserRole.ADMIN), createHandler(CustomerController, "getAllCustomerEnabled"));
router.post("/customer/create",
    authenticate,
    authorize(UserRole.ADMIN),
    body("name").isString().notEmpty().withMessage("El nombre no puede estar vacio"),
    body("email").isEmail().withMessage("El email no es válido"),
    body("location").isString().withMessage("La ubicación debe ser una cadena de texto"),
    handleInputErrors,
    createHandler(CustomerController, "createCustomer"));
router.post("/customer/delete/:customerId", authenticate, authorize(UserRole.ADMIN), createHandler(CustomerController, "disableCustomer"));
router.get("/customer/:customerId", authenticate, authorize(UserRole.ADMIN), createHandler(CustomerController, "getCustomerById"));
router.put("/customer/update/:customerId",
    authenticate,
    authorize(UserRole.ADMIN),
    body("name").optional().isString().notEmpty().withMessage("El nombre no puede estar vacio"),
    body("email").optional().isEmail(),
    body("location").optional().isString(),
    handleInputErrors,
    createHandler(CustomerController,
        "updateCustomer"));

export default router;