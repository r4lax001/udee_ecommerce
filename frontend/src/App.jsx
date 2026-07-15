import "./App.css";
import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
<<<<<<< HEAD
import { CartProvider } from "./contexts";
=======
import { CartProvider, AuthProvider } from "./contexts";
>>>>>>> auth-system

const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CartPage = lazy(() => import("./pages/CartPage"));

function LoadingFallback() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6F1] px-6">
      <motion.div
        className="flex items-center gap-3 rounded-full border border-[#E8E1DF] bg-white px-5 py-3 shadow-sm"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.span
          className="h-2.5 w-2.5 rounded-full bg-[#A0724A]"
          animate={
            reduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }
          }
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <span className="text-sm font-medium text-[#5a4e46]">
          Loading experience...
        </span>
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <CartProvider>
        <Suspense fallback={<LoadingFallback />}>
=======
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<LoadingFallback />}>
>>>>>>> auth-system
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="auth" element={<AuthPage />} />

              <Route path="order-tracking" element={<OrderTrackingPage />} />
              <Route
                path="order-tracking/:orderNumber"
                element={<OrderTrackingPage />}
              />

              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="checkout-v2" element={<CheckoutPage />} />

              <Route
                path="product-detail/:id"
                element={<ProductDetailPage />}
              />
              <Route path="products" element={<CategoriesPage />} />
              <Route path="profile" element={<ProfilePage />} />

              <Route path="cart" element={<CartPage />} />
              <Route path="cart-v2" element={<CartPage />} />
            </Route>

            <Route path="admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="admin-products" element={<AdminProductsPage />} />
            <Route path="admin-orders" element={<AdminOrdersPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
          </Routes>
<<<<<<< HEAD
        </Suspense>
      </CartProvider>
=======
          </Suspense>
        </CartProvider>
      </AuthProvider>
>>>>>>> auth-system
    </BrowserRouter>
  );
}

export default App;
