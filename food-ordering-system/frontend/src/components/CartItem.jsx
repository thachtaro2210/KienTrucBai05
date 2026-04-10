import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const CartItem = ({ item }) => {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 p-4 glass-card hover:border-slate-300 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 text-sm truncate">{item.foodName}</p>
        <p className="text-primary-600 text-sm font-semibold mt-0.5">{formatVND(item.price)}</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
        <button
          onClick={() => updateQty(item.foodId, item.quantity - 1)}
          className="w-7 h-7 rounded-md bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm transition-colors border border-slate-200"
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
        <button
          onClick={() => updateQty(item.foodId, item.quantity + 1)}
          className="w-7 h-7 rounded-md bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm transition-colors border border-slate-200"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Subtotal */}
      <span className="text-sm font-bold text-slate-700 w-28 text-right">
        {formatVND(item.price * item.quantity)}
      </span>

      {/* Delete */}
      <button
        onClick={() => removeItem(item.foodId)}
        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
