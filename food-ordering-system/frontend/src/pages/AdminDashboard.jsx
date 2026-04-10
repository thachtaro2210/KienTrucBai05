import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, UtensilsCrossed, TrendingUp, Users, DollarSign, Activity, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoodService from '../services/foodService';
import OrderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/ui/Skeleton';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ foods: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [foodsRes, ordersRes] = await Promise.all([
          FoodService.getAllFoods(),
          OrderService.getAllOrders()
        ]);
        
        const foodsData = foodsRes.data?.data || [];
        const ordersData = ordersRes.data?.data || [];
        
        const totalRevenue = ordersData
          .filter(o => o.status === 'PAID' || o.status === 'COMPLETED' || o.status === 'SHIPPED')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setStats({
          foods: foodsData.length,
          orders: ordersData.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Lỗi tải dữ liệu Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative pl-0 md:pl-16"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm hidden md:flex"
          title="Quay lại"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan Hệ thống</h1>
        <p className="text-slate-500 mt-1">Chào mừng quay lại, {user?.fullName}. Dưới đây là tình hình kinh doanh.</p>
      </motion.div>

      {/* Bento Grid layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Card: Doanh Thu */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.03)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={160} className="text-primary-600" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
              <DollarSign size={24} className="text-primary-600" />
            </span>
            <h2 className="font-bold text-slate-500 uppercase tracking-widest text-xs">Tổng Doanh Thu (Đã thu)</h2>
          </div>
          {loading ? (
            <Skeleton className="h-14 w-64 mt-2" />
          ) : (
            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">
                {formatCurrency(stats.revenue)}
              </span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-2 flex items-center gap-1 border border-emerald-100 uppercase tracking-wider">
                <Activity size={12} /> +12.5%
              </span>
            </div>
          )}
        </motion.div>

        {/* Card: Đơn Hàng */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
              <Package size={24} className="text-primary-600" />
            </span>
            <h2 className="font-bold text-slate-500 uppercase tracking-widest text-xs">Tổng Đơn Hàng</h2>
          </div>
          {loading ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.orders}</span>
          )}
        </motion.div>

        {/* Card: Món Ăn */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-primary-600" />
            </span>
            <h2 className="font-bold text-slate-500 uppercase tracking-widest text-xs">Danh mục Món ăn</h2>
          </div>
          {loading ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.foods}</span>
          )}
        </motion.div>

        {/* Card: Phân Quyền */}
        <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.03)] flex items-center gap-8">
          <div className="w-20 h-20 rounded-[20px] bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
            <Users size={32} className="text-slate-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">Quản lý Tài Khoản</h3>
            <p className="text-slate-500 text-sm font-medium">Hệ thống phân quyền Role-Based. Bạn đang thao tác dưới tư cách <span className="font-bold text-primary-500">Administrator</span>.</p>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default AdminDashboard;
