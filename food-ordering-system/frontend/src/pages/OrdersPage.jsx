import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, RefreshCw, ChevronDown, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const STATUS_MAP = {
  PENDING:    { label: 'Chờ xử lý',    variant: 'warning' },
  CONFIRMED:  { label: 'Đã xác nhận',   variant: 'info' },
  PROCESSING: { label: 'Đang làm',      variant: 'info' },
  PAID:       { label: 'Đã thanh toán', variant: 'success' },
  DELIVERED:  { label: 'Đã giao',       variant: 'success' },
  CANCELLED:  { label: 'Đã hủy',        variant: 'error' },
};

const OrdersPage = () => {
  const { user, isAdmin }         = useAuth();
  const navigate                  = useNavigate();
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = isAdmin
        ? await OrderService.getAll()
        : await OrderService.getByUser(user.id);
      setOrders(res.data?.data || []);
    } catch {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm hidden md:flex"
            title="Quay lại"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
            <ClipboardList size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isAdmin ? 'Quản lý đơn hàng' : 'Đơn hàng của tôi'}
          </h1>
        </div>
        <button
          onClick={fetchOrders}
          className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm active:scale-95"
          title="Làm mới"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/80 p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList size={40} className="text-slate-300 animate-bounce" />
          </div>
          <h3 className="text-xl text-slate-800 font-bold mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-slate-500 text-sm">Khi bạn đặt hàng, danh sách sẽ hiển thị ở đây.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {orders.map((order) => {
            const status = STATUS_MAP[order.status] || { label: order.status, variant: 'default' };
            const isOpen = expanded === order.id;

            return (
              <motion.div 
                key={order.id} 
                variants={itemVariants}
                className="bg-white overflow-hidden rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                {/* Order header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors text-left gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-primary-700 font-bold bg-primary-50 px-2 py-0.5 rounded-md">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        {new Date(order.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-800 font-bold text-lg">{order.userName || 'Khách hàng'}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-8">
                    <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-1.5">
                      <Badge variant={status.variant} className="text-[11px] uppercase tracking-wider px-3">
                        {status.label}
                      </Badge>
                      <span className="text-slate-800 font-black text-xl">{formatVND(order.totalAmount)}</span>
                    </div>
                    <motion.div 
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded items */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-50 bg-white"
                    >
                      <div className="p-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Thông tin chi tiết</p>
                        <div className="space-y-4 mb-4 bg-slate-50/50 p-6 rounded-[24px] border border-slate-100">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <span className="text-slate-700 font-bold">
                                {item.foodName} <span className="text-slate-400 text-[10px] font-black ml-2 uppercase tracking-tighter bg-white px-1.5 py-0.5 rounded border border-slate-100">× {item.quantity}</span>
                              </span>
                              <span className="text-slate-900 font-black">{formatVND(item.subtotal)}</span>
                            </div>
                          ))}
                        </div>
                        {order.note && (
                          <div className="bg-yellow-50/50 text-yellow-800 p-4 rounded-2xl text-sm border border-yellow-200/50">
                            <span className="font-bold mr-1 block mb-1 text-xs uppercase tracking-wider text-yellow-600">Ghi chú:</span> {order.note}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default OrdersPage;
