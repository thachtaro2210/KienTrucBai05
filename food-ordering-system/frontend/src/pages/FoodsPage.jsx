import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Pencil, Trash2, Loader2, UtensilsCrossed, PackageOpen } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import FoodService from '../services/foodService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const FoodsPage = () => {
  const { isAdmin } = useAuth();
  const [foods, setFoods]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editFood, setEditFood]   = useState(null);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await FoodService.getAll();
      setFoods(res.data?.data || []);
    } catch {
      toast.error('Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(); }, []);

  const categories = useMemo(
    () => ['', ...new Set(foods.map((f) => f.category))],
    [foods],
  );

  const filtered = useMemo(() =>
    foods.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchCat    = !category || f.category === category;
      return matchSearch && matchCat;
    }),
  [foods, search, category]);

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa món ăn này?')) return;
    try {
      await FoodService.delete(id);
      toast.success('Đã xóa món ăn');
      fetchFoods();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={20} />
            </div>
            Thực Đơn
          </h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} món ăn được tìm thấy</p>
        </div>
        {isAdmin && (
          <Button onClick={() => { setEditFood(null); setShowForm(true); }}>
            <Plus size={18} className="mr-2" /> Thêm món
          </Button>
        )}
      </motion.div>

      {/* Search & Filter */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Tìm kiếm món ăn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-transparent bg-slate-50 hover:bg-slate-100 focus-visible:bg-white transition-colors"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-transparent bg-slate-50 hover:bg-slate-100 px-3 pl-10 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/10 focus-visible:bg-white transition-colors appearance-none cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {categories.filter(Boolean).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden h-[300px] flex flex-col">
              <div className="h-44 w-full skeleton rounded-none"></div>
              <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="h-4 w-3/4 skeleton"></div>
                <div className="h-3 w-1/2 skeleton"></div>
                <div className="mt-auto flex justify-between items-center pt-2">
                  <div className="h-5 w-1/3 skeleton"></div>
                  <div className="h-8 w-1/4 skeleton"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageOpen size={40} className="animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Không tìm thấy món ăn</h3>
          <p className="text-slate-500 text-sm mt-1">Vui lòng thử từ khóa tìm kiếm khác.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {filtered.map((food) => (
              <motion.div 
                key={food.id} 
                variants={itemVariants}
                layout
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <FoodCard food={food} />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditFood(food); setShowForm(true); }}
                      className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg shadow-sm flex items-center justify-center text-slate-600 hover:text-primary-600 border border-slate-200 hover:border-primary-300 transition-all active:scale-95 hover:shadow-md"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg shadow-sm flex items-center justify-center text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-300 transition-all active:scale-95 hover:shadow-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Food Form Modal */}
      <AnimatePresence>
        {showForm && (
          <FoodFormModal
            food={editFood}
            onClose={() => setShowForm(false)}
            onSuccess={() => { setShowForm(false); fetchFoods(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Food Form Modal (Admin only) ──────────────────────────────── */
const FoodFormModal = ({ food, onClose, onSuccess }) => {
  const isEdit = !!food;
  const [form, setForm]       = useState({
    name: food?.name || '',
    description: food?.description || '',
    price: food?.price || '',
    category: food?.category || '',
    imageUrl: food?.imageUrl || '',
    stock: food?.stock || 100,
    available: food?.available ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (isEdit) {
        await FoodService.update(food.id, payload);
        toast.success('Cập nhật món ăn thành công');
      } else {
        await FoodService.create(payload);
        toast.success('Thêm món ăn thành công');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi lưu món ăn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-slate-100 relative z-10"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          {isEdit ? <Pencil size={20} className="text-primary-500" /> : <Plus size={24} className="text-primary-500" />}
          {isEdit ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name',        label: 'Tên món',      type: 'text',   req: true },
            { name: 'description', label: 'Mô tả',        type: 'text' },
            { name: 'price',       label: 'Giá (VNĐ)',    type: 'number', req: true },
            { name: 'category',    label: 'Danh mục',     type: 'text',   req: true },
            { name: 'imageUrl',    label: 'URL ảnh',      type: 'url' },
            { name: 'stock',       label: 'Số lượng',     type: 'number' },
          ].map(({ name, label, type, req }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">{label}{req && <span className="text-red-500">*</span>}</label>
              <Input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                required={req}
              />
            </div>
          ))}
          
          <label className="flex items-center gap-3 cursor-pointer mt-6 bg-slate-50 hover:bg-slate-100 transition-colors p-4 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
              className="w-5 h-5 accent-primary-500 rounded text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm font-semibold text-slate-700">Trạng thái: Đang bán</span>
          </label>
          
          <div className="flex gap-3 pt-6 mt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" isLoading={loading} className="flex-1">
              Lưu món ăn
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FoodsPage;
