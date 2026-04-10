import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UtensilsCrossed, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ username: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      setLoading(true);
      const user = await login(form);
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/foods');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary-300/30 rounded-full blur-3xl" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <div className="text-center mb-10">
          <img 
            src="data:image/webp;base64,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"
            alt="FoodOrder Logo"
            className="w-20 h-20 object-contain mx-auto group"
          />
          <h1 className="text-4xl font-black gradient-text tracking-tighter">FoodOrder</h1>
          <p className="text-slate-400 mt-2 text-sm font-bold uppercase tracking-widest">Mini Food Ordering System</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">Đăng nhập tài khoản</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="login-username">
                Tên đăng nhập
              </label>
              <Input
                id="login-username"
                name="username"
                type="text"
                icon={User}
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin / user1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="login-password">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  icon={Lock}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              id="login-submit"
              type="submit"
              isLoading={loading}
              className="w-full mt-2"
            >
              Đăng nhập ngay
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
