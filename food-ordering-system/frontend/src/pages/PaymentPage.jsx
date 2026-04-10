import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, CheckCircle2, ShieldCheck, ChevronLeft } from 'lucide-react';
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
  const isAlreadyPaid           = order?.status === 'PAID';

  useEffect(() => {
    if (!order) {
      OrderService.getById(orderId)
        .then((r) => setOrder(r.data?.data))
        .catch(() => toast.error('Không tìm thấy đơn hàng'));
    }
  }, [orderId, order]);

  const handlePay = async () => {
    if (isAlreadyPaid) {
      toast('Đơn này đã được thanh toán rồi.');
      return;
    }

    try {
      setLoading(true);
      const res = await PaymentService.process({
        orderId,
        userId: user.id,
        method,
      });
      const payment = res.data?.data;
      if (payment?.method) {
        setMethod(payment.method);
      }
      setResult(payment);
      toast.success('Thanh toán thành công!');
    } catch (err) {
      const errorCode = err.response?.data?.errorCode;
      if (errorCode === 'ORDER_ALREADY_PAID') {
        toast('Đơn này đã thanh toán trước đó.');
        navigate('/orders');
        return;
      }
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
        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <CheckCircle2 size={48} className="text-green-500 animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Thanh toán thành công!</h2>
          <div className="bg-slate-50/50 rounded-[32px] p-8 mb-8 text-left border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 text-sm font-medium">Mã giao dịch</span>
              <span className="text-slate-800 font-mono font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{result.transactionRef}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 text-sm font-medium">Phương thức</span>
              <span className="text-slate-800 font-bold">{result.method === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
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
      <div className="text-center mb-10 relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full hidden sm:grid place-items-center hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          title="Quay lại"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Chọn phương thức thanh toán</h1>
        {order && (
          <p className="text-slate-500 text-sm">
            Mã đơn hàng <span className="font-mono text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-md font-bold ml-1">#{order.id?.slice(-8).toUpperCase()}</span>
          </p>
        )}
      </div>

      {/* Order Summary */}
      {order && (
        <div className="bg-white border border-slate-100 rounded-[40px] p-10 mb-8 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Tóm tắt đơn hàng</p>
          <div className="space-y-4 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 mb-8">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-bold">
                  {item.foodName} <span className="text-slate-400 ml-2 font-black bg-white px-1.5 py-0.5 rounded border border-slate-100 text-[10px] tracking-tighter uppercase">×{item.quantity}</span>
                </span>
                <span className="text-slate-900 font-black">{formatVND(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-slate-900 font-black text-xl tracking-tight">Tổng thanh toán</span>
            <span className="text-4xl font-black text-primary-500 tracking-tighter">{formatVND(order.totalAmount)}</span>
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
              className={`w-full flex items-center gap-6 p-6 lg:p-8 rounded-[32px] border-2 transition-all duration-300 text-left bg-white ${
                method === value
                  ? 'border-primary-500 shadow-xl shadow-primary-500/10'
                  : 'border-slate-100 hover:border-primary-200 hover:shadow-sm'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                method === value ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 text-slate-400'
              }`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <p className={`font-black text-xl tracking-tight ${method === value ? 'text-slate-900' : 'text-slate-800'}`}>
                  {label}
                </p>
                <p className={`text-sm mt-1 font-bold ${method === value ? 'text-primary-600/60' : 'text-slate-400'}`}>
                  {desc}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-all ${
                method === value ? 'border-primary-500 bg-primary-500' : 'border-slate-200'
              }`}>
                {method === value && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={handlePay}
        disabled={loading || !order || isAlreadyPaid}
        isLoading={loading}
        className="w-full text-lg shadow-xl shadow-primary-500/20 py-7"
      >
        {isAlreadyPaid
          ? 'Đơn đã thanh toán'
          : `Xác nhận thanh toán ${order ? formatVND(order.totalAmount) : ''}`}
      </Button>

      {isAlreadyPaid && (
        <p className="mt-3 text-center text-sm text-emerald-600 font-semibold">
          Đơn hàng này đã được thanh toán. Bạn có thể xem lại trong mục Đơn hàng.
        </p>
      )}

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
