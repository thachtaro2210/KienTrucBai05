import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FoodsPage    from './pages/FoodsPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CartPage     from './pages/CartPage';
import OrdersPage   from './pages/OrdersPage';
import PaymentPage  from './pages/PaymentPage';
import AdminDashboard from './pages/AdminDashboard';

/* Layout with Navbar */
const AppLayout = () => (
  <>
    <div className="bg-glow-1" />
    <div className="bg-glow-2" />
    <Navbar />
    <main className="min-h-[calc(100vh-4rem)] relative z-10">
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
            <Route path="/foods/:id"        element={<FoodDetailPage />} />
            <Route path="/cart"             element={<CartPage />} />
            <Route path="/orders"           element={<OrdersPage />} />
            <Route path="/payment/:orderId" element={<PaymentPage />} />
            <Route path="/admin"            element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/foods" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#334155',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
              borderRadius: '9999px',
              padding: '12px 24px',
              border: '1px solid #f1f5f9',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              iconTheme: {
                primary: '#0ea5e9',
                secondary: '#fff',
              },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
