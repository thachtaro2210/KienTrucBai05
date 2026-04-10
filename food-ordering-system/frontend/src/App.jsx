import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FoodsPage    from './pages/FoodsPage';
import CartPage     from './pages/CartPage';
import OrdersPage   from './pages/OrdersPage';
import PaymentPage  from './pages/PaymentPage';

/* Layout with Navbar */
const AppLayout = () => (
  <>
    <Navbar />
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <Outlet />
    </main>
  </>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/foods"            element={<FoodsPage />} />
            <Route path="/cart"             element={<CartPage />} />
            <Route path="/orders"           element={<OrdersPage />} />
            <Route path="/payment/:orderId" element={<PaymentPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/foods" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: 'hot-toast-custom',
          }}
        />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
