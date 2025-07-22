import { NavLink } from "react-router-dom";
import { LayoutDashboard,Package,ShoppingBag,LogOut} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

const AdminSidebar = () => {
    const { logout } = useAuth()
    const navItems = [
        {
            name:"Dashboard",
            path:'/admin',
            icon:<LayoutDashboard className="w-5 h-5" />
        },
        {
            name:"Products",
            path:"/admin/products",
            icon:<Package className="w-5 h-5" />
        },
        {
            name:"Orders",
            path:"/admin/orders",
            icon:<ShoppingBag className="w-5 h-5" />
        },
        {
            name:"Coupons",
            path:"/admin/coupons",
            icon:<Package className="w-5 h-5" />
        }
    ];
    return(
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Package className="h-6 w-6 text-teal-600" />
                    <h1 className="text-lg font-bold">Pickles Admin</h1>
                </div>
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map((item)=>(
                        <li key={item.path}>
                            <NavLink to={item.path} end={item.path === "/admin"} className={({isActive})=>
                            clsx('flex items-center space-x-3 px-3 py-2 rounded-md transition-colors',
                                isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'
                            )
                        }>
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t mt-auto">
                <button onClick={ logout } className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 w-full">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}
export default AdminSidebar;