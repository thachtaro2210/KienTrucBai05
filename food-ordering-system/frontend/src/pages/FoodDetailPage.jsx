import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Minus, ShoppingCart, Clock, Utensils, Info } from 'lucide-react';
import FoodService from '../services/foodService';
import { useCart } from '../context/CartContext';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const FoodDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await FoodService.getById(id);
        setFood(res.data?.data);
      } catch (err) {
        toast.error('Không thể tải thông tin món ăn');
        navigate('/foods');
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id, navigate]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(food);
    }
    toast.success(`Đã thêm ${quantity} ${food.name} vào giỏ hàng`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] rounded-[40px]" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4 rounded-full" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="pt-8 space-y-4">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!food) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-16">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors group"
      >
        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary-200 group-hover:bg-primary-50 transition-all">
          <ChevronLeft size={20} />
        </div>
        Quay lại thực đơn
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left: Image Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100"
        >
          <img
            src={food.imageUrl || `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800`}
            alt={food.name}
            className="w-full aspect-square object-cover"
          />
          {!food.available && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
              <Badge variant="error" className="px-8 py-3 text-lg font-bold shadow-lg">Tạm hết hàng</Badge>
            </div>
          )}
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col h-full"
        >
          <div className="mb-6">
            <Badge variant="primary" className="mb-4 px-4 py-1 text-xs uppercase tracking-widest font-bold">
              {food.category}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              {food.name}
            </h1>
            <p className="text-3xl font-bold text-primary-600 tracking-tighter">
              {formatVND(food.price)}
            </p>
          </div>

          <div className="space-y-8 flex-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={16} /> Mô tả món ăn
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {food.description || 'Món ăn mang hương vị đặc trưng, nguyên liệu tươi sạch được chế biến công phu từ những đầu bếp hàng đầu.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Giao hàng</p>
                  <p className="text-sm font-bold text-slate-700">15-30 phút</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
                  <Utensils size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Chất lượng</p>
                  <p className="text-sm font-bold text-slate-700">Tươi sạch</p>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-8 mt-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-[200px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <Minus size={20} />
                </button>
                <span className="font-black text-xl text-slate-800 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                disabled={!food.available}
                onClick={handleAddToCart}
                className="btn-primary w-full flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart size={24} />
                Thêm vào giỏ hàng — {formatVND(food.price * quantity)}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
