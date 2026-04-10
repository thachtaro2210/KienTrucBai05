import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Badge from './ui/Badge';
import { motion } from 'framer-motion';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const FoodCard = ({ food }) => {
  const { addItem } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-white/60 backdrop-blur-3xl rounded-[24px] overflow-hidden group shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.06)] border border-white/80 hover:border-slate-200/60 flex flex-col h-full relative"
    >
      {/* Absolute image area for stretch */}
      <div className="relative h-[220px] overflow-hidden bg-slate-100/50 w-full rounded-t-[24px]">
        <img
          src={food.imageUrl || `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400`}
          alt={food.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[700ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400';
          }}
        />
        
        {/* Hover glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="primary" className="shadow-sm backdrop-blur-md bg-white/95">
            {food.category}
          </Badge>
        </div>

        {/* Floating Add Button (Absolute) */}
        {food.available && (
          <button
            onClick={() => addItem(food)}
            className="absolute bottom-4 right-4 w-11 h-11 bg-white text-slate-800 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:bg-slate-50 active:scale-90 transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Availability Overlay */}
        {!food.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
            <Badge variant="error" className="px-5 py-2 text-sm shadow-sm bg-white/90">
              Tạm hết hàng
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 bg-white/40">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-semibold text-slate-800 text-[17px] leading-snug tracking-tight line-clamp-2">
            {food.name}
          </h3>
        </div>
        
        {food.description && (
          <p className="text-[13px] text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">
            {food.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between">
          <span className="text-slate-800 font-bold text-lg tracking-tight">
            {formatVND(food.price)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
