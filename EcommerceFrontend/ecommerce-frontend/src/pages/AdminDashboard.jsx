import { useState, useEffect } from 'react';
import { ShoppingBag, Package, DollarSign, Users, TrendingUp, CalendarDays } from 'lucide-react';
import PRODUCTS from '../types/products'
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const {token} = useAuth()
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    revenueChange: 0,
    ordersChange:0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersAndCalculateStats = async () => {
      try
      {
        const res =await fetch('https://localhost:7231/api/Orders/admin',{
          headers:{
              Authorization:`Bearer ${token}`
            }
        });

        const allOrders = await res.json();
        setRecentOrders(allOrders.slice(0,5));

        const now = new Date();
        const thisMonth = now.getMonth();
        const lastMonth = (thisMonth -1 +12)%12;
        const currentYear = now.getFullYear();
        const lastMonthYear = thisMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthOrders = allOrders.filter((o)=>{
          const d = new Date(o.orderDate);
          return d.getMonth() === thisMonth && d.getFullYear() === currentYear;
        });
        const lastMonthOrders = allOrders.filter((o)=>{
          const d = new Date(o.orderDate);
          return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        });

        const revenueThisMonth = currentMonthOrders.reduce((sum,o)=>sum+o.totalAmount,0);
        const revenueLastMonth = lastMonthOrders.reduce((sum,o)=>sum+o.totalAmount,0);
        const ordersThisMonth = currentMonthOrders.length;
        const ordersLastMonth = lastMonthOrders.length;

        const revenueChange = revenueLastMonth === 0 ? 0 : ((revenueThisMonth - revenueLastMonth)/revenueLastMonth) * 100;
        const ordersChange = ordersLastMonth === 0 ? 0 : ((ordersThisMonth - ordersLastMonth)/ordersLastMonth) * 100;

      setStats({
        revenue: revenueThisMonth,
        orders: ordersThisMonth,
        products: PRODUCTS.length,
        revenueChange,
        ordersChange
      });
    }
    catch(error){
      console.error('Error fetching stats:', error);
    }
    };
    fetchOrdersAndCalculateStats();
  }, []);

  // Recent orders for display
  //const recentOrders = ORDERS.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500">
          <CalendarDays className="w-4 h-4 mr-1" />
          <span>Today: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 text-teal-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-xl font-bold text-gray-900">${stats?.revenue?.toFixed(2)}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">{stats?.revenueChange.toFixed(1)}% increase</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-xl font-bold text-gray-900">{stats?.orders}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">{stats?.ordersChange.toFixed(1)}% increase</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-rose-100 text-rose-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <h3 className="text-xl font-bold text-gray-900">{stats?.products}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">4% increase</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status.toLowerCase() === 'processing' ? 'bg-amber-100 text-amber-800' :
                        order.status.toLowerCase() === 'pending' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items.reduce((total, item) => total + item.quantity, 0)} items
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;