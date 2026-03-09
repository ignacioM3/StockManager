import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { UserRole } from "../../domain/entities/User-Role.js";
import { createHandler } from "../utils/createHandler.js";
import { SalesControllers } from "../controllers/SalesControllers.js";

const router = Router()

router.get("/sales/today", authenticate, authorize(UserRole.ADMIN), createHandler(SalesControllers, 'getTodaySalesCase'))
router.get("/sales/weekend", authenticate, authorize(UserRole.ADMIN), createHandler(SalesControllers, "getWeekendSalesCase"))
router.get("/sales/monthly", authenticate, authorize(UserRole.ADMIN), createHandler(SalesControllers, "getMonthlySalesCase"))
router.post("/sales/create", authenticate, authorize(UserRole.ADMIN), createHandler(SalesControllers, 'createSale'))
router.get("/sales/:saleId", authenticate, authorize(UserRole.ADMIN), createHandler(SalesControllers, 'getSaleById'))
router.get("/sales/customer/:customerId", authenticate, authorize(UserRole.ADMIN), createHandler(SalesControllers, 'getSalesByCustomerId'))

export default router;