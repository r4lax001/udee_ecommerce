import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { checkoutPageData } from "../data/checkoutPageData";
import { createOrder } from "../services/orders";
import { useCart } from "../contexts";

const formatPrice = (value) => `฿${Number(value).toLocaleString("th-TH")}`;

const CheckoutPage = ({ checkout = checkoutPageData }) => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const transition = {
    duration: reduceMotion ? 0 : 0.24,
    ease: [0.22, 1, 0.36, 1],
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    zip: "",
  });

  const {
    items,
    subtotal,
    discount,
    shipping,
    total: cartTotal,
    clearCart,
  } = useCart();

  const isCartEmpty = items.length === 0;

  const [paymentInfo, setPaymentInfo] = useState({
    transferDate: "",
    amount: "",
    slip: null,
  });

  useEffect(() => {
    if (cartTotal > 0) {
      setPaymentInfo((prev) => ({
        ...prev,
        amount: String(cartTotal),
      }));
    }
  }, [cartTotal]);

  const cartCheckoutData = useMemo(
    () => ({
      ...checkout,
      products: items.map((item) => ({
        name: item.name,
        qty: item.qty,
        price:
          typeof item.price === "number"
            ? `฿${item.price.toLocaleString("th-TH")}`
            : item.price,
        image: item.image,
      })),
      totals: {
        subtotal,
        discount,
        shipping,
      },
    }),
    [checkout, items, subtotal, discount, shipping],
  );

  const total = cartTotal;
  if (isCartEmpty) {
    return (
      <main className="min-h-screen bg-[#F2EBE2] px-6 py-16 text-[#1D1B1A]">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF4EA] text-[#A0724A]">
            <span className="material-symbols-outlined text-4xl">
              shopping_cart
            </span>
          </div>

          <h1 className="text-3xl font-semibold text-[#3D2B1F]">
            ยังไม่มีสินค้าในตะกร้า
          </h1>

          <p className="mt-4 text-sm text-[#5a4e46]">
            กรุณาเลือกสินค้าใส่ตะกร้าก่อนเข้าสู่ขั้นตอนชำระเงิน
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-2xl bg-[#3D2B1F] px-8 py-3 font-semibold text-white transition hover:opacity-90"
            >
              ไปเลือกสินค้า
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="rounded-2xl border border-[#3D2B1F] px-8 py-3 font-semibold text-[#3D2B1F] transition hover:bg-[#F3ECEA]"
            >
              กลับไปตะกร้า
            </button>
          </div>
        </section>
      </main>
    );
  }

  const handleShippingChange = (event) => {
    const { name, value } = event.target;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShipping = () => {
    const requiredFields = [
      "name",
      "phone",
      "address",
      "city",
      "district",
      "zip",
    ];
    const isComplete = requiredFields.every((field) =>
      shippingInfo[field].trim(),
    );

    if (!isComplete) {
      setError("กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน");
      return false;
    }

    setError("");
    return true;
  };

  const validatePayment = () => {
    if (!paymentInfo.transferDate || !paymentInfo.amount || !paymentInfo.slip) {
      setError("กรุณากรอกข้อมูลการชำระเงินและอัปโหลดสลิปให้ครบถ้วน");
      return false;
    }

    setError("");
    return true;
  };

  const goToPayment = () => {
    if (!validateShipping()) return;
    setCurrentStep(2);
  };

  const goToConfirm = () => {
    if (!validatePayment()) return;
    setCurrentStep(3);
  };

  const handleCreateOrder = () => {
    if (isCartEmpty) {
      setError("ไม่สามารถสร้างคำสั่งซื้อได้ เพราะยังไม่มีสินค้าในตะกร้า");
      setCurrentStep(1);
      return;
    }

    const order = createOrder({
      shippingInfo,
      paymentInfo,
      checkout: cartCheckoutData,
    });

    clearCart();
    navigate(`/order-tracking/${order.orderNumber}`);
  };

  return (
    <motion.main
      className="min-h-screen bg-[#F2EBE2] text-[#1D1B1A]"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={transition}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-[#3D2B1F]">
                    {checkout.title}
                  </h1>
                  <p className="text-sm text-[#5a4e46] mt-2">
                    เลือกขั้นตอนแล้วกรอกข้อมูลให้ครบถ้วน
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {checkout.steps.map((step, index) => (
                    <span
                      key={step}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        index + 1 === currentStep
                          ? "bg-[#3D2B1F] text-white"
                          : "bg-[#F3ECEA] text-[#5a4e46]"
                      }`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {currentStep === 1 ? (
              <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <h2 className="text-2xl font-semibold mb-8 text-[#3D2B1F]">
                  ข้อมูลการจัดส่ง
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { label: "ชื่อ-นามสกุล", name: "name", type: "text" },
                    { label: "เบอร์โทรศัพท์", name: "phone", type: "tel" },
                    {
                      label: "ที่อยู่",
                      name: "address",
                      type: "text",
                      full: true,
                    },
                    { label: "จังหวัด", name: "city", type: "text" },
                    { label: "เขต/อำเภอ", name: "district", type: "text" },
                    { label: "รหัสไปรษณีย์", name: "zip", type: "text" },
                  ].map((field) => (
                    <label
                      key={field.name}
                      className={`${field.full ? "md:col-span-2" : ""} flex flex-col gap-2`}
                    >
                      <span className="text-sm font-medium text-[#81756E]">
                        {field.label}
                      </span>

                      <input
                        type={field.type}
                        name={field.name}
                        value={shippingInfo[field.name]}
                        onChange={handleShippingChange}
                        className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    type="button"
                    onClick={goToPayment}
                    className="rounded-2xl bg-[#3D2B1F] px-8 py-3 text-white hover:opacity-90 transition"
                  >
                    ถัดไป: ชำระเงิน
                  </button>
                </div>
              </div>
            ) : currentStep === 2 ? (
              <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)] space-y-10">
                <div>
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">
                    ช่องทางการชำระเงิน
                  </h2>

                  <div className="mt-6 grid gap-6">
                    <div className="rounded-3xl bg-[#FEF4EA] p-6 border border-[#E8E1DF]">
                      <p className="font-semibold text-[#3D2B1F]">
                        โอนผ่านธนาคาร
                      </p>
                      <p className="text-sm text-[#5a4e46] mt-3">
                        ธนาคารกสิกรไทย (K-Bank)
                      </p>
                      <p className="text-sm text-[#5a4e46]">
                        ชื่อบัญชี: บจก. ยูดี เฟอร์นิเจอร์ (UDEE Furniture)
                      </p>

                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                        <p className="font-semibold">123-4-56789-0</p>
                        <button
                          type="button"
                          onClick={() =>
                            navigator.clipboard.writeText("123-4-56789-0")
                          }
                          className="text-[#A0724A] font-medium"
                        >
                          คัดลอก
                        </button>
                      </div>
                    </div>

                    <div className="rounded-3xl p-6 border border-[#E8E1DF]">
                      <div className="grid gap-6 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm text-[#81756E]">
                          วันที่โอน
                          <input
                            type="date"
                            name="transferDate"
                            value={paymentInfo.transferDate}
                            onChange={handlePaymentChange}
                            className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                          />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-[#81756E]">
                          จำนวนเงิน (บาท)
                          <input
                            type="number"
                            name="amount"
                            value={paymentInfo.amount}
                            onChange={handlePaymentChange}
                            placeholder={String(total)}
                            className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                          />
                        </label>
                      </div>

                      <label className="mt-6 flex flex-col gap-2 text-sm text-[#81756E]">
                        อัปโหลดสลิป
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            setPaymentInfo((prev) => ({
                              ...prev,
                              slip: event.target.files?.[0] ?? null,
                            }))
                          }
                          className="rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 outline-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setCurrentStep(1);
                    }}
                    className="rounded-2xl border border-[#3D2B1F] px-8 py-3 text-[#3D2B1F] hover:bg-[#F3ECEA] transition"
                  >
                    ย้อนกลับ
                  </button>

                  <button
                    type="button"
                    onClick={goToConfirm}
                    className="rounded-2xl bg-[#3D2B1F] px-8 py-3 text-white hover:opacity-90 transition"
                  >
                    ถัดไป: ตรวจสอบคำสั่งซื้อ
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <h2 className="text-2xl font-semibold text-[#3D2B1F]">
                  ตรวจสอบและยืนยันคำสั่งซื้อ
                </h2>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-[#E8E1DF] bg-[#F9F2F0] p-6">
                    <h3 className="font-semibold text-[#3D2B1F]">
                      ข้อมูลจัดส่ง
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-[#5a4e46]">
                      <p>ชื่อ: {shippingInfo.name}</p>
                      <p>เบอร์โทร: {shippingInfo.phone}</p>
                      <p>ที่อยู่: {shippingInfo.address}</p>
                      <p>
                        {shippingInfo.district}, {shippingInfo.city}{" "}
                        {shippingInfo.zip}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#E8E1DF] bg-[#F9F2F0] p-6">
                    <h3 className="font-semibold text-[#3D2B1F]">
                      ข้อมูลการชำระเงิน
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-[#5a4e46]">
                      <p>วันที่โอน: {paymentInfo.transferDate}</p>
                      <p>จำนวนเงิน: {formatPrice(paymentInfo.amount || 0)}</p>
                      <p>สลิป: {paymentInfo.slip?.name || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl bg-[#FEF4EA] p-6 text-sm text-[#5a4e46]">
                  หลังจากยืนยันคำสั่งซื้อ ระบบจะสร้างเลขออเดอร์
                  และพาไปหน้าติดตามคำสั่งซื้อทันที
                </div>

                <div className="mt-10 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setCurrentStep(2);
                    }}
                    className="rounded-2xl border border-[#3D2B1F] px-8 py-3 text-[#3D2B1F] hover:bg-[#F3ECEA] transition"
                  >
                    ย้อนกลับ
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateOrder}
                    className="rounded-2xl bg-[#3D2B1F] px-8 py-3 text-white hover:opacity-90 transition"
                  >
                    ยืนยันคำสั่งซื้อ
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 sticky top-24 self-start space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-[0_2px_8px_rgba(61,43,31,0.08)] border border-[#E8E1DF]">
              <h3 className="text-2xl font-semibold text-[#3D2B1F] mb-6">
                สรุปคำสั่งซื้อ
              </h3>

              {cartCheckoutData.products.map((product) => (
                <div
                  key={`${product.name}-${product.qty}`}
                  className="flex gap-4 border-b border-[#E8E1DF] pb-4 mb-4"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#F3ECEA]">
                    <img
                      className="h-full w-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-[#3D2B1F]">{product.name}</p>
                    <p className="text-sm text-[#81756E]">
                      จำนวน: {product.qty}
                    </p>
                  </div>

                  <p className="font-semibold text-[#A0724A]">
                    {product.price}
                  </p>
                </div>
              ))}

              <div className="space-y-3 text-sm text-[#5a4e46]">
                <div className="flex justify-between">
                  <span>รวมรายการสินค้า</span>
                  <span>{formatPrice(cartCheckoutData.totals.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>ส่วนลด</span>
                  <span className="text-[#A0724A]">
                    -{formatPrice(cartCheckoutData.totals.discount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>
                    {cartCheckoutData.totals.shipping === 0
                      ? "ฟรี"
                      : formatPrice(cartCheckoutData.totals.shipping)}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#E8E1DF] pt-4 flex justify-between text-lg font-bold text-[#3D2B1F]">
                <span>ยอดสุทธิ</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="mt-6 rounded-2xl bg-[#FFF1E7] p-4 text-sm text-[#5a4e46]">
                บริการจัดส่งและประกอบหน้างานฟรี พร้อมรับประกันคุณภาพจาก UDEE
              </div>
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  );
};

export default CheckoutPage;
