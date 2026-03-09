import { customerRoutes } from "./routes/customer-routes";
import { publicRoutes } from "./routes/auth-router";
import type { RouterDefinition } from "./routes/routes-definition";
import { salesRoutes } from "./routes/sales-routes";
import { inventoryRoutes } from "./routes/inventory-routes";
import { warehouseRoutes } from "./routes/warehouse-routes";
import { productRoutes } from "./routes/product-routes";
import { notificationsRoutes } from "./routes/notifications-routes";

export const AppRoutes = {
    ...publicRoutes,
    ...customerRoutes,
    ...salesRoutes,
    ...inventoryRoutes,
    ...warehouseRoutes,
    ...productRoutes,
    ...notificationsRoutes,
    error: {
        route: () => "*",
        redirect: "/"
    }
} as const satisfies Record<string, RouterDefinition>

export type Routes = keyof typeof AppRoutes;



export const routeList: RouterDefinition[] = Object.values(AppRoutes);
