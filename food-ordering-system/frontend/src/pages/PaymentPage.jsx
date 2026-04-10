import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, CheckCircle2, ShieldCheck } from 'lucide-react';
import PaymentService from '../services/paymentService';
import OrderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const PAYMENT_METHODS = [
  { value: 'COD',     label: 'Tiền mặt (COD)',      icon: Banknote,   desc: 'Thanh toán trực tiếp khi nhận hàng' },
  { value: 'BANKING', label: 'Chuyển khoản',          icon: CreditCard, desc: 'Internet Banking / Ví điện tử' },
];

const PaymentPage = () => {
  const { orderId }            = useParams();
  const { state }              = useLocation();
  const navigate               = useNavigate();
  const { user }               = useAuth();

  const [order, setOrder]      = useState(state?.order || null);
  const [method, setMethod]    = useState('COD');
  const [loading, setLoading]  = useState(false);
  const [result, setResult]    = useState(null);

  useEffect(() => {
    if (!order) {
      OrderService.getById(orderId)
        .then((r) => setOrder(r.data?.data))
        .catch(() => toast.error('Không tìm thấy đơn hàng'));
    }
  }, [orderId, order]);

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await PaymentService.process({
        orderId,
        userId: user.id,
        method,
      });
      const payment = res.data?.data;
      setResult(payment);
      toast.success('Thanh toán thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thanh toán thất bại');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ──────────────────────────────────────────── */
  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="max-w-md mx-auto px-4 py-16 text-center mt-10"
      >
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <CheckCircle2 size={48} className="text-green-500 animate-pulse" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Thanh toán thành công!</h2>
          <div className="bg-slate-50/80 rounded-2xl p-5 mb-8 text-left border border-slate-100/80">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 text-sm font-medium">Mã giao dịch</span>
              <span className="text-slate-800 font-mono font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{result.transactionRef}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 text-sm font-medium">Phương thức</span>
              <span className="text-slate-800 font-bold">{method === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
            </div>
            <div className="border-t border-slate-200/60 mt-4 pt-4 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Đã thanh toán</span>
              <span className="text-xl font-black text-green-600">{formatVND(result.amount)}</span>
            </div>
          </div>
          {result.notificationMessage && (
            <div className="p-4 bg-green-50/50 border border-green-200/50 rounded-2xl text-sm text-green-700 font-semibold mb-8">
              {result.notificationMessage}
            </div>
          )}
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => navigate('/orders')} className="flex-1">
              Xem đơn hàng
            </Button>
            <Button onClick={() => navigate('/foods')} className="flex-1">
              Mua tiếp
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Chọn phương thức thanh toán</h1>
        {order && (
          <p className="text-slate-500 text-sm">
            Mã đơn hàng <span className="font-mono text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-md font-bold ml-1">#{order.id?.slice(-8).toUpperCase()}</span>
          </p>
        )}
      </div>

      {/* Order Summary */}
      {order && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 mb-8 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tóm tắt đơn hàng</p>
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">
                  {item.foodName} <span className="text-slate-400 ml-1.5 font-bold bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100">×{item.quantity}</span>
                </span>
                <span className="text-slate-800 font-bold">{formatVND(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-slate-600 font-bold text-lg">Tổng thanh toán</span>
            <span className="text-3xl font-black text-primary-600">{formatVND(order.totalAmount)}</span>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-10">
        <div className="space-y-4">
          {PAYMENT_METHODS.map(({ value, label, icon: Icon, desc }) => (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={value}
              onClick={() => setMethod(value)}
              className={`w-full flex items-center gap-5 p-6 rounded-3xl border-2 transition-all duration-200 text-left bg-white ${
                method === value
                  ? 'border-primary-500 shadow-md shadow-primary-500/10 bg-primary-50/30'
                  : 'border-slate-200 hover:border-primary-300 hover:shadow-sm'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                method === value ? 'bg-primary-100 shadow-inner' : 'bg-slate-100'
              }`}>
                <Icon size={28} className={method === value ? 'text-primary-600' : 'text-slate-500'} />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-lg tracking-tight ${method === value ? 'text-primary-800' : 'text-slate-800'}`}>
                  {label}
                </p>
                <p className={`text-sm mt-1 font-medium ${method === value ? 'text-primary-600/80' : 'text-slate-500'}`}>
                  {desc}
                </p>
              </div>
              <div className={`w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all ${
                method === value ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
              }`}>
                {method === value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={handlePay}
        disabled={loading || !order}
        isLoading={loading}
        className="w-full text-lg shadow-xl shadow-primary-500/20 py-7"
      >
        {`Xác nhận thanh toán ${order ? formatVND(order.totalAmount) : ''}`}
      </Button>

      <div className="mt-8 text-center">
        <p className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5 uppercase tracking-widest">
          <ShieldCheck size={16} />
          Thanh toán an toàn & bảo mật
        </p>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
