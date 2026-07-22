import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts";

const formatPrice = (value) => `฿${Number(value).toLocaleString("th-TH")}`;

const CartPage = () => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const transition = {
    duration: reduceMotion ? 0 : 0.2,
    ease: [0.22, 1, 0.36, 1],
  };

  const { items, subtotal, discount, shipping, total, totalItems, applyCoupon, updateQuantity, removeItem, clearCart } = useCart();

  const isCartEmpty = items.length === 0;

  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  const handleApplyCoupon = () => {
    applyCoupon(coupon);
    setApplied(Boolean(coupon.trim()));
  };

  const handleGoToCheckout = () => {
    if (isCartEmpty) return;
    navigate("/checkout");
  };

  return (
    <motion.main
      className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A] selection:bg-[#3D2B1F] selection:text-white"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px] items-start">
          
          {/* Left Column: Cart Items */}
          <div className="flex flex-col">
            <header className="flex items-end justify-between pb-4 border-b border-[#E8E1DF]">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[#3D2B1F]">
                  ตะกร้าสินค้า
                </h1>
                <span className="inline-flex items-center justify-center rounded-md bg-[#E8E1DF] px-2 py-0.5 text-xs font-medium text-[#5a4e46]">
                  {items.length}
                </span>
              </div>
              {!isCartEmpty && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="group flex items-center gap-1.5 text-sm font-medium text-[#81756e] hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md px-2 py-1 -mr-2"
                >
                  <span className="material-symbols-outlined text-[16px] opacity-70 group-hover:opacity-100">delete</span>
                  <span>ลบทั้งหมด</span>
                </button>
              )}
            </header>

            {isCartEmpty ? (
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#E8E1DF] text-[#81756e] shadow-sm">
                    <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[#3D2B1F] tracking-tight">ตะกร้าของคุณว่างเปล่า</h2>
                  <p className="mt-2 text-sm text-[#81756e] max-w-sm">
                    คุณยังไม่ได้เลือกสินค้าใดๆ เข้าตะกร้า ลองดูสินค้าที่น่าสนใจจากแคตตาล็อกของเรา
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#3D2B1F] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2A1F14] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F1]"
                  >
                    เลือกซื้อสินค้า
                  </button>
                </div>
            ) : (
              <ul className="flex flex-col m-0 p-0 list-none">
                {items.map((item, index) => (
                  <motion.li
                    key={item.variantId || item.id || item.name}
                    className="flex flex-col sm:flex-row gap-5 py-6 border-b border-[#E8E1DF] last:border-0"
                    initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...transition, delay: index * 0.05 }}
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white border border-[#E8E1DF] shadow-sm">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>

                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          {item.category && (
                            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[#81756e]">
                              {item.category}
                            </p>
                          )}
                          <h3 className="text-base font-semibold text-[#3D2B1F] truncate">
                            {item.name}
                          </h3>
                          
                          <dl className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#81756e]">
                            {item.color && (
                              <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Color</dt>
                                <dd className="flex items-center gap-1.5">
                                  <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                                  <span>{item.color}</span>
                                </dd>
                              </div>
                            )}
                            {item.variant && (
                              <div className="flex items-center gap-1">
                                <dt>Size:</dt>
                                <dd className="font-medium text-[#3D2B1F]">{item.variant}</dd>
                              </div>
                            )}
                            {item.material && (
                              <div className="flex items-center gap-1">
                                <dt>Material:</dt>
                                <dd className="font-medium text-[#3D2B1F]">{item.material}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                        
                        <p className="text-base font-semibold text-[#3D2B1F] whitespace-nowrap">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-[#E8E1DF] bg-white shadow-sm p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[#5a4e46] transition-colors hover:bg-[#F2EBE2] disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F]"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-[#3D2B1F] select-none" aria-live="polite">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[#5a4e46] transition-colors hover:bg-[#F2EBE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F]"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#81756e] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                          aria-label={`Remove ${item.name}`}
                          title="ลบสินค้า"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Column: Summary */}
          <aside className="sticky top-24 flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E1DF]">
              <h2 className="text-base font-semibold tracking-tight text-[#3D2B1F] mb-4">
                สรุปคำสั่งซื้อ
              </h2>
              
              <dl className="space-y-3 text-sm text-[#5a4e46]">
                <div className="flex items-center justify-between">
                  <dt>ยอดรวมสินค้า ({totalItems} ชิ้น)</dt>
                  <dd className="font-medium text-[#3D2B1F]">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>ค่าจัดส่ง</dt>
                  <dd className="font-medium text-[#3D2B1F]">{shipping === 0 ? "ฟรี" : formatPrice(shipping)}</dd>
                </div>
                
                {applied && (
                  <div className="flex items-center justify-between text-[#4A7C59]">
                    <dt className="flex items-center gap-1.5">
                      ส่วนลด
                      <span className="inline-flex rounded bg-[#4A7C59]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4A7C59]">
                        CODE
                      </span>
                    </dt>
                    <dd className="font-semibold">- {formatPrice(discount)}</dd>
                  </div>
                )}

                <div className="pt-3 mt-3 border-t border-[#E8E1DF] flex items-center justify-between">
                  <dt className="text-sm font-semibold text-[#3D2B1F]">ยอดชำระสุทธิ</dt>
                  <dd className="text-lg font-bold tracking-tight text-[#3D2B1F]">{formatPrice(total)}</dd>
                </div>
              </dl>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  disabled={isCartEmpty}
                  onClick={handleGoToCheckout}
                  className="w-full flex items-center justify-center rounded-xl bg-[#3D2B1F] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2A1F14] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F] focus-visible:ring-offset-2"
                >
                  ชำระเงิน
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="w-full flex items-center justify-center rounded-xl border border-[#E8E1DF] bg-white px-4 py-2.5 text-sm font-medium text-[#3D2B1F] transition-all hover:bg-[#FAF6F1] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F] focus-visible:ring-offset-2"
                >
                  เลือกซื้อสินค้าต่อ
                </button>
              </div>
            </div>

            {/* Promo Code Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E1DF]">
              <h3 className="text-sm font-medium text-[#3D2B1F] mb-2.5">โค้ดส่วนลด</h3>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder="กรอกโค้ดส่วนลด"
                  disabled={isCartEmpty}
                  className="w-full rounded-xl border border-[#E8E1DF] bg-white pl-3.5 pr-20 py-2.5 text-sm outline-none transition-colors focus:border-[#3D2B1F] focus:ring-1 focus:ring-[#3D2B1F] disabled:bg-[#FAF6F1] disabled:text-[#81756e] placeholder:text-[#a89f98]"
                  aria-label="รหัสส่วนลด"
                />
                <button
                  type="submit"
                  disabled={isCartEmpty || !coupon.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-[#F2EBE2] px-3 text-xs font-semibold text-[#3D2B1F] transition-colors hover:bg-[#E8E1DF] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F]"
                >
                  ใช้คูปอง
                </button>
              </form>
              {applied && (
                <p className="mt-2.5 text-xs font-medium text-[#4A7C59] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  ใช้โค้ดส่วนลดแล้ว
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  );
};

export default CartPage;
