import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';
import Badge from './ui/Badge';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const FoodCard = ({ food }) => {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-3xl overflow-hidden group hover:border-primary-300 transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={food.imageUrl || `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400`}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400';
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="shadow-sm backdrop-blur-md bg-white/90">
            {food.category}
          </Badge>
        </div>
        {/* Availability Overlay */}
        {!food.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
            <Badge variant="error" className="px-4 py-1.5 text-sm shadow-sm bg-white">
              Tạm hết hàng
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">
          {food.name}
        </h3>
        {food.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{food.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <span className="text-primary-600 font-black text-xl tracking-tight">
            {formatVND(food.price)}
          </span>

          <Button
            size="sm"
            onClick={() => food.available && addItem(food)}
            disabled={!food.available}
            className="rounded-xl shadow-md shadow-primary-500/20"
          >
            <Plus size={16} className="mr-1" /> Thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
