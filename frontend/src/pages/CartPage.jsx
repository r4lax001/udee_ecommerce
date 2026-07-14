import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts";

const formatPrice = (value) => `฿${Number(value).toLocaleString("th-TH")}`;

const CartPage = () => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const transition = {
    duration: reduceMotion ? 0 : 0.24,
    ease: [0.22, 1, 0.36, 1],
  };

  const { items, subtotal, discount, shipping, total, applyCoupon } = useCart();

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
      className="min-h-screen bg-[#F7F2EC] text-[#1D1B1A]"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <motion.div
              className="rounded-[2rem] bg-white p-10 shadow-[0_2px_25px_rgba(61,43,31,0.08)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={transition}
            >
              <h1 className="mb-4 text-4xl font-semibold text-[#3D2B1F]">
                ตะกร้าสินค้าของคุณ
              </h1>

              <p className="text-sm text-[#5a4e46]">
                พร้อมสำหรับการชำระเงินและจัดส่ง
              </p>
            </motion.div>

            <motion.div
              className="rounded-[2rem] bg-white p-8 shadow-[0_2px_15px_rgba(61,43,31,0.08)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.1 }}
            >
              {isCartEmpty ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF4EA] text-[#A0724A]">
                    <span className="material-symbols-outlined text-4xl">
                      shopping_cart
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">
                    ยังไม่มีสินค้าในตะกร้า
                  </h2>

                  <p className="mt-3 text-sm text-[#81756e]">
                    เลือกสินค้าก่อนเข้าสู่ขั้นตอนการชำระเงิน
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="mt-8 rounded-2xl bg-[#3D2B1F] px-8 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    ไปเลือกสินค้า
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.variantId || item.id || item.name}
                      className="flex flex-col gap-4 rounded-[1.5rem] border border-[#E8E1DF] p-5 sm:flex-row sm:items-center"
                      initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ ...transition, delay: 0.15 + index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="h-28 w-full overflow-hidden rounded-3xl bg-[#F3ECEA] sm:w-36">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-xl font-semibold text-[#3D2B1F]">
                          {item.name}
                        </p>

                        <p className="mt-2 text-sm text-[#81756e]">
                          จำนวน: {item.qty}
                        </p>

                        <p className="mt-1 text-sm text-[#81756e]">
                          ตัวเลือก: {item.variant || "Standard"}
                          {item.color ? ` · ${item.color}` : ""}
                          {item.material ? ` · ${item.material}` : ""}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#A0724A]">
                          {formatPrice(item.price * item.qty)}
                        </p>

                        <p className="text-sm text-[#81756e]">
                          หน่วยละ {formatPrice(item.price)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_2px_15px_rgba(61,43,31,0.08)]">
              <h2 className="mb-6 text-2xl font-semibold text-[#3D2B1F]">
                สรุปคำสั่งซื้อ
              </h2>

              <div className="space-y-4 text-sm text-[#5a4e46]">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>คูปอง</span>
                  <span>{applied ? `- ${formatPrice(discount)}` : "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{shipping === 0 ? "ฟรี" : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E8E1DF] pt-6 text-lg font-bold text-[#3D2B1F]">
                <span>ยอดชำระทั้งหมด</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                disabled={isCartEmpty}
                onClick={handleGoToCheckout}
                className={`mt-8 w-full rounded-2xl px-6 py-4 font-semibold transition ${
                  isCartEmpty
                    ? "cursor-not-allowed bg-[#D2C4BC] text-white"
                    : "bg-[#3D2B1F] text-white hover:opacity-90"
                }`}
              >
                {isCartEmpty ? "ยังไม่มีสินค้าในตะกร้า" : "ไปที่การชำระเงิน"}
              </button>

              {isCartEmpty && (
                <p className="mt-3 text-center text-sm text-[#81756e]">
                  กรุณาเลือกสินค้าใส่ตะกร้าก่อนเข้าสู่ขั้นตอนชำระเงิน
                </p>
              )}
            </div>

            <div className="rounded-[2rem] bg-[#FEF4EA] p-8 shadow-[0_2px_15px_rgba(61,43,31,0.08)]">
              <h3 className="mb-4 text-xl font-semibold text-[#3D2B1F]">
                มีโค้ดส่วนลด?
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder="กรอกโค้ดส่วนลด"
                  disabled={isCartEmpty}
                  className="w-full rounded-2xl border border-[#D2C4BC] bg-white px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20 disabled:cursor-not-allowed disabled:bg-[#F3ECEA]"
                />

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isCartEmpty}
                  className={`w-full rounded-2xl px-6 py-3 text-white transition ${
                    isCartEmpty
                      ? "cursor-not-allowed bg-[#D2C4BC]"
                      : "bg-[#3D2B1F] hover:opacity-90"
                  }`}
                >
                  ใช้คูปอง
                </button>

                {applied && (
                  <p className="text-sm text-[#3D2B1F]">
                    โค้ดส่วนลดของคุณถูกนำไปใช้แล้ว
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  );
};

export default CartPage;
