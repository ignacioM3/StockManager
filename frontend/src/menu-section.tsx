import { UserRole } from "./types/user-role";
import { FaUserAlt } from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineInventory2, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { AppRoutes } from "./routes";
import { FaBell } from "react-icons/fa";
import type { JSX } from "react/jsx-runtime";

export interface MenuItem {
    label: string;
    icon: JSX.Element;
    to: string;
    role?: UserRole[];
}

export interface MenuLabel {
    label: string;
    role?: UserRole[];
}

export interface MenuSection {
    label: MenuLabel[];
    items: MenuItem[];
}



export const menuSection: MenuSection[] = [
    {
        label: [
            {
                label: 'Administración',
                role: [UserRole.ADMIN]
            }
        ],
        items: [

            {
                label: "Home ",
                icon: <AiFillHome />,
                to: AppRoutes.home.route()
            },
            {
                label: "Clientes",
                icon: <FaUserAlt />,
                to: AppRoutes.listCustomers.route(),
                role: [UserRole.ADMIN]
            },
            {
                label: "Ventas",
                icon: <TbMoneybag />,
                to: AppRoutes.salesListOption.route(),
                role: [UserRole.ADMIN]
            },
            {
                label: "Inventario",
                icon: <MdOutlineInventory2 />,
                to: AppRoutes.inventoryListOption.route(),
                role: [UserRole.ADMIN]
            },
            {
                label: "Sucursales",
                icon: <BiBuildings />,
                to: AppRoutes.warehouseList.route(),
                role: [UserRole.ADMIN]
            },
            {
                label: "Productos",
                icon: <MdOutlineProductionQuantityLimits />,
                to: AppRoutes.productList.route(),
                role: [UserRole.ADMIN]
            },

        ]
    },
    {
        label: [

            {
                label: 'Planificación',
                role: [UserRole.ADMIN]
            }
        ],
        items: [
            {
                label: 'Notificaciones',
                icon: <FaBell />,
                to: AppRoutes.notificationsList.route(),
                role: [UserRole.ADMIN]
            },
            {
                label: "Ganancias",
                icon: <TbMoneybag />,
                to: AppRoutes.profitHome.route(),
                role: [UserRole.ADMIN]
            }

        ]
    }
];