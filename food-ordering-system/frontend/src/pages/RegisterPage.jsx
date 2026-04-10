import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Eye, EyeOff, User, Mail, Lock, Type } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({ username: '', email: '', fullName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Mật khẩu phải từ 6 ký tự');
      return;
    }
    try {
      setLoading(true);
      await register(form);
      toast.success('Đăng ký thành công! Hãy đăng nhập');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-200/40 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 9, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow mb-4">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">FoodOrder</h1>
        </div>

        <div className="bg-white border border-slate-100 p-8 lg:p-10 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.04)]">
          <h2 className="text-2xl font-black text-slate-800 mb-8 text-center tracking-tight">Tạo tài khoản mới</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Họ và tên</label>
              <Input name="fullName" type="text" icon={Type} value={form.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tên đăng nhập</label>
              <Input name="username" type="text" icon={User} value={form.username} onChange={handleChange} placeholder="nguyenvana" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
              <Input name="email" type="email" icon={Mail} value={form.email} onChange={handleChange} placeholder="email@example.com" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  icon={Lock}
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

            <Button type="submit" isLoading={loading} className="w-full mt-4">
              Đăng ký ngay
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
