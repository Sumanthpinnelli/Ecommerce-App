import { Menu, X, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminHeader = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const { logout,user } = useAuth()

    const navItems =[
        { name: 'Dashboard', path:'/admin'},
        { name: 'Products', path:'/admin/products'},
        { name: 'Orders', path:'/admin/orders'}
    ];

    return (
        <header className='bg-white border-b border-gray-200 shadow-sm'>
            <div className='px-4 py-3 flex items-center justify-between'>
                <div className='flex items-center md:hidden'>
                    <button className='text-gray-500 hover:text-gray-700'
                    onClick={()=> setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (
                            <X className='h-6 w-6' />):(
                                <Menu className='h-6 w-6' />
                            )
                        }
                    </button>
                </div>
                <div className='flex-1'></div>
                <div className='relative ml-3'>
                    <button className='flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900'
                    onClick={()=>setProfileMenuOpen(!profileMenuOpen)}
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.nam} className='h-8 w-8 rounded-full bg-gray-200' />
                        ):(
                            <User className='h-8 w-8 p-1 rounded-full bg-gray-200' />
                        )}
                        <span className='hidden md:inline-block'>{user?.name}</span>
                        <ChevronDown className='h-4 w-4' />
                    </button>

                    {profileMenuOpen && (
                        <div className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1
                        ring-black ring-opacity-5 focus:outline-none'>
                            <div className='px-4 py-2 text-sm text-gray-700 border-b'>
                                <p className='font-medium'>{user?.name}</p>
                                <p className='text-xs text-gray-500'>{user?.email}</p>
                            </div>
                            <button onClick={logout} className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                Sign out
                            </button>
                            </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <nav className='md:hidden border-t border-gray-200 bg-white'>
                    <ul className='px-2 py-2 space-y-1'>
                        {navItems.map((item) =>(
                            <li key={item.path}>
                                <NavLink to={item.path} end={item.path === "/admin"} className={({isActive}) =>
                                `block px-3 py-2 rounded-md ${
                                    isActive ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-100'
                                }`}
                                onClick={()=> setMobileMenuOpen(false)}>
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    )
}

export default AdminHeader;