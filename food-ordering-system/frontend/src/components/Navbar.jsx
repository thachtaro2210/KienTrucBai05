import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, ClipboardList, LogOut, User, Shield, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems }            = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/foods',  label: 'Menu',     icon: UtensilsCrossed },
    { to: '/orders', label: 'Đơn hàng', icon: ClipboardList },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Dashboard', icon: LayoutDashboard });
  }

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/foods" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">FoodOrder</span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100'
                    : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50 hover:shadow-sm active:scale-95'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/cart')
                  ? 'bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100'
                  : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50 hover:shadow-sm active:scale-95'
              }`}
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:block">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-dot shadow-sm">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </nav>

          {/* User section */}
          <div className="flex items-center gap-2">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
              {isAdmin ? <Shield size={14} className="text-primary-600" /> : <User size={14} className="text-slate-500" />}
              <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user?.fullName || user?.username}</span>
              {isAdmin && <span className="badge-primary">Admin</span>}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
