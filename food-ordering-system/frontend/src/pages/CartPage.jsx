import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import OrderService from '../services/orderService';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const CartPage = () => {
  const { items, clearCart, totalAmount } = useCart();
  const { user }                          = useAuth();
  const navigate                          = useNavigate();
  const [note, setNote]                   = useState('');
  const [loading, setLoading]             = useState(false);

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống!');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        userId: user.id,
        items:  items.map(({ foodId, quantity }) => ({ foodId, quantity })),
        note:   note.trim() || null,
      };
      const res   = await OrderService.create(payload);
      const order = res.data?.data;
      clearCart();
      toast.success('Tạo đơn hàng thành công!');
      navigate(`/payment/${order.id}`, { state: { order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 py-16 text-center mt-10"
      >
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingCart size={32} className="text-primary-500 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-slate-500 mb-8">Hãy chọn vài món ăn ngon để thưởng thức nhé!</p>
          <Button onClick={() => navigate('/foods')} size="lg">
            Xem thực đơn ngay
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
    >
      <div className="flex items-center gap-3 mb-8 relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm hidden md:flex"
          title="Quay lại"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="w-12 h-12 bg-primary-100/50 rounded-2xl flex items-center justify-center">
          <ShoppingCart size={24} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Giỏ hàng của bạn</h1>
        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-bold ml-auto">{items.length} món</span>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-8">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              layout
              key={item.foodId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <CartItem item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Note */}
      <div className="mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3" htmlFor="order-note">
          Ghi chú đơn hàng (tùy chọn)
        </label>
        <textarea
          id="order-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ví dụ: Không hành, thêm cay, v.v..."
          className="flex w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-white px-4 py-3 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-4 focus-visible:ring-primary-500/10 resize-none"
        />
      </div>

      {/* Summary */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Chi tiết thanh toán</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm">Tạm tính</span>
            <span className="text-slate-700 font-medium">{formatVND(totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm">Phí giao hàng</span>
            <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Miễn phí</span>
          </div>
          <div className="border-t border-slate-100 mt-4 pt-5 flex items-center justify-between">
            <span className="font-bold text-slate-800 text-lg">Tổng cộng</span>
            <span className="text-3xl font-extrabold text-primary-600">{formatVND(totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary" size="lg" onClick={() => navigate('/foods')} className="flex-1">
          Tiếp tục mua hàng
        </Button>
        <Button
          size="lg"
          onClick={handleCreateOrder}
          isLoading={loading}
          className="flex-1 text-lg shadow-lg shadow-primary-500/25"
        >
          {loading ? 'Đang lên đơn...' : 'Tiến hành đặt hàng'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CartPage;
