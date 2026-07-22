import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { checkoutPageData } from "../data/checkoutPageData";
import { createOrder } from "../services/orders";
import { useCart } from "../contexts";

const formatPrice = (value) => `฿${Number(value).toLocaleString("th-TH")}`;

const getNumber = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value).replace(/[^\d.-]/g, "")) || 0;
};

const readSlipQrCode = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const qrResult = jsQR(
          imageData.data,
          imageData.width,
          imageData.height,
        );

        resolve({
          previewUrl: reader.result,
          qrPayload: qrResult?.data || "",
        });
      };

      image.onerror = () => {
        reject(new Error("ไม่สามารถอ่านรูปภาพสลิปได้"));
      };

      image.src = reader.result;
    };

    reader.onerror = () => {
      reject(new Error("ไม่สามารถอ่านไฟล์สลิปได้"));
    };

    reader.readAsDataURL(file);
  });

const CheckoutPage = ({ checkout = checkoutPageData }) => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const transition = {
    duration: reduceMotion ? 0 : 0.24,
    ease: [0.22, 1, 0.36, 1],
  };

  const {
    items,
    subtotal,
    discount,
    shipping,
    total: cartTotal,
    clearCart,
  } = useCart();

  const isCartEmpty = items.length === 0;

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

  const [paymentInfo, setPaymentInfo] = useState({
    transferDate: "",
    amount: "",
    slip: null,
    slipName: "",
    slipPreview: "",
    qrPayload: "",
    qrStatus: "idle",
    qrMessage: "",
    verifyStatus: "pending_review",
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
        variant: item.variant,
        color: item.color,
        material: item.material,
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

  const handleSlipUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPaymentInfo((prev) => ({
        ...prev,
        slip: null,
        slipName: "",
        slipPreview: "",
        qrPayload: "",
        qrStatus: "idle",
        qrMessage: "",
      }));
      return;
    }

    setError("");

    setPaymentInfo((prev) => ({
      ...prev,
      slip: file,
      slipName: file.name,
      qrStatus: "reading",
      qrMessage: "กำลังอ่าน QR Code จากสลิป...",
    }));

    try {
      const result = await readSlipQrCode(file);

      if (!result.qrPayload) {
        setPaymentInfo((prev) => ({
          ...prev,
          slip: file,
          slipName: file.name,
          slipPreview: result.previewUrl,
          qrPayload: "",
          qrStatus: "failed",
          qrMessage: "ไม่พบ QR Code ในสลิป กรุณาอัปโหลดรูปสลิปที่ชัดเจน",
          verifyStatus: "qr_not_found",
        }));
        return;
      }

      setPaymentInfo((prev) => ({
        ...prev,
        slip: file,
        slipName: file.name,
        slipPreview: result.previewUrl,
        qrPayload: result.qrPayload,
        qrStatus: "success",
        qrMessage: "อ่าน QR Code จากสลิปสำเร็จ รอตรวจสอบโดยผู้จัดการ",
        verifyStatus: "pending_review",
      }));
    } catch {
      setPaymentInfo((prev) => ({
        ...prev,
        slip: file,
        slipName: file.name,
        slipPreview: "",
        qrPayload: "",
        qrStatus: "failed",
        qrMessage: "ไม่สามารถอ่านรูปภาพสลิปได้ กรุณาเลือกไฟล์ใหม่",
        verifyStatus: "qr_read_error",
      }));
    }
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

    if (getNumber(paymentInfo.amount) !== getNumber(total)) {
      setError(`จำนวนเงินต้องตรงกับยอดสุทธิ ${formatPrice(total)}`);
      return false;
    }

    if (paymentInfo.qrStatus !== "success" || !paymentInfo.qrPayload) {
      setError(
        "กรุณาอัปโหลดสลิปที่มี QR Code ชัดเจน เพื่อใช้ตรวจสอบการชำระเงิน",
      );
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

  if (isCartEmpty) {
    return (
      <main className="min-h-screen bg-[#FAF6F1] px-4 sm:px-6 py-16 text-[#1D1B1A]">
        <section className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm border border-[#E8E1DF]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E8E1DF] bg-white text-[#81756e] shadow-sm">
            <span className="material-symbols-outlined text-2xl">
              shopping_cart
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[#3D2B1F]">
            ตะกร้าของคุณว่างเปล่า
          </h1>

          <p className="mt-2 text-sm text-[#81756e]">
            กรุณาเลือกสินค้าใส่ตะกร้าก่อนเข้าสู่ขั้นตอนชำระเงิน
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center rounded-xl bg-[#3D2B1F] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2A1F14] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F] focus-visible:ring-offset-2"
            >
              ไปเลือกสินค้า
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="inline-flex items-center justify-center rounded-xl border border-[#E8E1DF] bg-white px-6 py-2.5 text-sm font-medium text-[#3D2B1F] transition-all hover:bg-[#FAF6F1] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F] focus-visible:ring-offset-2"
            >
              กลับไปตะกร้า
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <motion.main
      className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A] selection:bg-[#3D2B1F] selection:text-white"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px] items-start">
          <div className="flex flex-col space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-[#E8E1DF]">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#3D2B1F]">
                  {checkout.title}
                </h1>
                <p className="text-sm text-[#81756e] mt-1">
                  กรุณากรอกข้อมูลให้ครบถ้วนเพื่อดำเนินการต่อ
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        step === currentStep
                          ? "bg-[#3D2B1F] text-white"
                          : step < currentStep
                            ? "bg-[#E8E1DF] text-[#3D2B1F]"
                            : "bg-transparent border border-[#E8E1DF] text-[#a89f98]"
                      }`}
                    >
                      {step < currentStep ? <span className="material-symbols-outlined text-[14px]">check</span> : step}
                    </span>
                    {step < 3 && <div className={`h-px w-4 ${step < currentStep ? 'bg-[#E8E1DF]' : 'bg-[#E8E1DF]/50'}`} />}
                  </div>
                ))}
              </div>
            </header>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm font-medium text-red-600 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {currentStep === 1 ? (
              <motion.div 
                className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#E8E1DF]"
                initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h2 className="text-lg font-semibold tracking-tight text-[#3D2B1F] mb-6">
                  ข้อมูลการจัดส่ง
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {[
                    { label: "ชื่อ-นามสกุล", name: "name", type: "text" },
                    { label: "เบอร์โทรศัพท์", name: "phone", type: "tel" },
                    {
                      label: "ที่อยู่ (บ้านเลขที่, ถนน, ซอย)",
                      name: "address",
                      type: "text",
                      full: true,
                    },
                    { label: "เขต/อำเภอ", name: "district", type: "text" },
                    { label: "จังหวัด", name: "city", type: "text" },
                    { label: "รหัสไปรษณีย์", name: "zip", type: "text" },
                  ].map((field) => (
                    <div
                      key={field.name}
                      className={`${field.full ? "md:col-span-2" : ""} flex flex-col gap-1.5`}
                    >
                      <label htmlFor={`shipping-${field.name}`} className="text-[13px] font-medium text-[#5a4e46]">
                        {field.label}
                      </label>
                      <input
                        id={`shipping-${field.name}`}
                        type={field.type}
                        name={field.name}
                        value={shippingInfo[field.name]}
                        onChange={handleShippingChange}
                        className="rounded-xl border border-[#E8E1DF] bg-white px-3.5 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all hover:border-[#D2C4BC] focus:border-[#3D2B1F] focus:ring-1 focus:ring-[#3D2B1F]"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end border-t border-[#E8E1DF] pt-6">
                  <button
                    type="button"
                    onClick={goToPayment}
                    className="inline-flex items-center justify-center rounded-xl bg-[#3D2B1F] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2A1F14] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F] focus-visible:ring-offset-2"
                  >
                    ถัดไป: ชำระเงิน
                  </button>
                </div>
              </motion.div>            ) : currentStep === 2 ? (
              <motion.div 
                className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#E8E1DF]"
                initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h2 className="text-lg font-semibold tracking-tight text-[#3D2B1F] mb-6">
                  ช่องทางการชำระเงิน
                </h2>

                <div className="space-y-6">
                  <div className="rounded-xl border border-[#E8E1DF] bg-white overflow-hidden">
                    <div className="bg-[#FAF6F1] px-4 py-3 border-b border-[#E8E1DF] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#3D2B1F]">account_balance</span>
                      <p className="font-semibold text-sm text-[#3D2B1F]">โอนผ่านธนาคาร</p>
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-sm text-[#5a4e46] space-y-1">
                        <p className="font-medium text-[#3D2B1F]">ธนาคารกสิกรไทย (K-Bank)</p>
                        <p>บจก. ยูดี เฟอร์นิเจอร์ (UDEE Furniture)</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-[#FAF6F1] px-3 py-2 border border-[#E8E1DF]">
                        <p className="font-mono text-[13px] font-semibold text-[#3D2B1F] tracking-wide">123-4-56789-0</p>
                        <div className="h-4 w-px bg-[#D2C4BC]" />
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText("123-4-56789-0")}
                          className="text-[12px] font-semibold text-[#81756e] hover:text-[#3D2B1F] transition-colors focus-visible:outline-none"
                        >
                          คัดลอก
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="transferDate" className="text-[13px] font-medium text-[#5a4e46]">
                        วันที่โอน
                      </label>
                      <input
                        id="transferDate"
                        type="date"
                        name="transferDate"
                        value={paymentInfo.transferDate}
                        onChange={handlePaymentChange}
                        className="rounded-xl border border-[#E8E1DF] bg-white px-3.5 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all hover:border-[#D2C4BC] focus:border-[#3D2B1F] focus:ring-1 focus:ring-[#3D2B1F]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="amount" className="text-[13px] font-medium text-[#5a4e46]">
                        จำนวนเงิน (บาท)
                      </label>
                      <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={paymentInfo.amount}
                        onChange={handlePaymentChange}
                        placeholder={String(total)}
                        className="rounded-xl border border-[#E8E1DF] bg-white px-3.5 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all hover:border-[#D2C4BC] focus:border-[#3D2B1F] focus:ring-1 focus:ring-[#3D2B1F]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-[13px] font-medium text-[#5a4e46]">
                      อัปโหลดสลิปเพื่อยืนยัน
                    </label>
                    <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E8E1DF] bg-[#FAF6F1] px-6 py-8 text-center transition-colors hover:border-[#D2C4BC] focus-within:border-[#3D2B1F] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#3D2B1F]">
                      <span className="material-symbols-outlined text-3xl text-[#a89f98] mb-2">upload_file</span>
                      <p className="text-sm font-medium text-[#3D2B1F]">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่</p>
                      <p className="mt-1 text-xs text-[#81756e]">รองรับไฟล์ JPG, PNG</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                  </div>

                  {paymentInfo.slipPreview && (
                    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[#E8E1DF] bg-white shadow-sm items-start">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[#E8E1DF] bg-[#FAF6F1]">
                        <img
                          src={paymentInfo.slipPreview}
                          alt="ตัวอย่างสลิป"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {paymentInfo.qrStatus === "success" ? (
                            <span className="material-symbols-outlined text-[16px] text-[#4A7C59]">check_circle</span>
                          ) : paymentInfo.qrStatus === "failed" ? (
                            <span className="material-symbols-outlined text-[16px] text-red-600">error</span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px] text-[#A0724A] animate-pulse">hourglass_bottom</span>
                          )}
                          <p className={`text-sm font-semibold ${
                            paymentInfo.qrStatus === "success" ? "text-[#4A7C59]" :
                            paymentInfo.qrStatus === "failed" ? "text-red-600" :
                            "text-[#A0724A]"
                          }`}>
                            {paymentInfo.qrStatus === "success" ? "อ่านข้อมูลสำเร็จ" :
                             paymentInfo.qrStatus === "failed" ? "พบข้อผิดพลาด" :
                             "กำลังประมวลผล..."}
                          </p>
                        </div>
                        <p className="text-xs text-[#5a4e46] leading-relaxed line-clamp-2">
                          {paymentInfo.qrMessage}
                        </p>
                        {paymentInfo.qrPayload && (
                          <p className="mt-2 text-[10px] font-mono text-[#a89f98] truncate bg-[#FAF6F1] px-2 py-1 rounded">
                            {paymentInfo.qrPayload}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-[#E8E1DF] pt-6">
                  <button
                    type="button"
                    onClick={() => { setError(""); setCurrentStep(1); }}
                    className="inline-flex items-center justify-center rounded-xl border border-[#E8E1DF] bg-white px-6 py-2.5 text-sm font-medium text-[#3D2B1F] transition-all hover:bg-[#FAF6F1] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F]"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={goToConfirm}
                    className="inline-flex items-center justify-center rounded-xl bg-[#3D2B1F] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2A1F14] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F]"
                  >
                    ถัดไป: ยืนยันคำสั่งซื้อ
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#E8E1DF]"
                initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h2 className="text-lg font-semibold tracking-tight text-[#3D2B1F] mb-6">
                  ตรวจสอบและยืนยันคำสั่งซื้อ
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-xl border border-[#E8E1DF] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E8E1DF]">
                      <span className="material-symbols-outlined text-[18px] text-[#81756e]">local_shipping</span>
                      <h3 className="font-semibold text-sm text-[#3D2B1F]">ข้อมูลจัดส่ง</h3>
                    </div>
                    <dl className="space-y-2 text-[13px] text-[#5a4e46]">
                      <div className="flex justify-between gap-4"><dt className="text-[#81756e]">ชื่อ</dt><dd className="font-medium text-[#3D2B1F] text-right">{shippingInfo.name}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#81756e]">โทร</dt><dd className="font-medium text-[#3D2B1F] text-right">{shippingInfo.phone}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#81756e]">ที่อยู่</dt><dd className="font-medium text-[#3D2B1F] text-right">{shippingInfo.address}, {shippingInfo.district}, {shippingInfo.city} {shippingInfo.zip}</dd></div>
                    </dl>
                  </div>

                  <div className="rounded-xl border border-[#E8E1DF] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E8E1DF]">
                      <span className="material-symbols-outlined text-[18px] text-[#81756e]">payments</span>
                      <h3 className="font-semibold text-sm text-[#3D2B1F]">ข้อมูลการชำระเงิน</h3>
                    </div>
                    <dl className="space-y-2 text-[13px] text-[#5a4e46]">
                      <div className="flex justify-between gap-4"><dt className="text-[#81756e]">วันที่โอน</dt><dd className="font-medium text-[#3D2B1F] text-right">{paymentInfo.transferDate}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#81756e]">จำนวนเงิน</dt><dd className="font-medium text-[#3D2B1F] text-right">{formatPrice(paymentInfo.amount || 0)}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#81756e]">การยืนยัน</dt><dd className="font-medium text-[#4A7C59] text-right flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[14px]">verified</span> QR สมบูรณ์</dd></div>
                    </dl>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[#FAF6F1] p-4 text-[13px] text-[#5a4e46] border border-[#E8E1DF] flex items-start gap-3">
                  <span className="material-symbols-outlined text-[18px] text-[#A0724A] shrink-0 mt-0.5">info</span>
                  <p>หลังจากยืนยันคำสั่งซื้อ ระบบจะสร้างเลขออเดอร์และบันทึกข้อมูลสลิปเพื่อรอผู้จัดการตรวจสอบความถูกต้อง</p>
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-[#E8E1DF] pt-6">
                  <button
                    type="button"
                    onClick={() => { setError(""); setCurrentStep(2); }}
                    className="inline-flex items-center justify-center rounded-xl border border-[#E8E1DF] bg-white px-6 py-2.5 text-sm font-medium text-[#3D2B1F] transition-all hover:bg-[#FAF6F1] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F]"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateOrder}
                    className="inline-flex items-center justify-center rounded-xl bg-[#3D2B1F] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2A1F14] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2B1F]"
                  >
                    ยืนยันคำสั่งซื้อ
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <aside className="sticky top-24 flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E1DF]">
              <h3 className="text-base font-semibold tracking-tight text-[#3D2B1F] mb-4">
                สรุปคำสั่งซื้อ
              </h3>

              <ul className="flex flex-col m-0 p-0 list-none mb-4 space-y-3">
                {cartCheckoutData.products.map((product) => (
                  <li
                    key={`${product.name}-${product.qty}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E8E1DF] bg-white">
                      <img
                        className="h-full w-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a4e46] text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                        {product.qty}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-center min-w-0">
                      <p className="font-medium text-sm text-[#3D2B1F] truncate">{product.name}</p>
                      <p className="text-[13px] font-medium text-[#81756e]">
                        {product.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2.5 text-[13px] text-[#5a4e46]">
                <div className="flex items-center justify-between">
                  <dt>รวมรายการสินค้า</dt>
                  <dd className="font-medium text-[#3D2B1F]">{formatPrice(cartCheckoutData.totals.subtotal)}</dd>
                </div>

                {cartCheckoutData.totals.discount > 0 && (
                  <div className="flex items-center justify-between text-[#4A7C59]">
                    <dt>ส่วนลด</dt>
                    <dd className="font-semibold">-{formatPrice(cartCheckoutData.totals.discount)}</dd>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <dt>ค่าจัดส่ง</dt>
                  <dd className="font-medium text-[#3D2B1F]">
                    {cartCheckoutData.totals.shipping === 0
                      ? "ฟรี"
                      : formatPrice(cartCheckoutData.totals.shipping)}
                  </dd>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E8E1DF] flex items-center justify-between">
                  <dt className="text-sm font-semibold text-[#3D2B1F]">ยอดสุทธิ</dt>
                  <dd className="text-lg font-bold tracking-tight text-[#3D2B1F]">{formatPrice(total)}</dd>
                </div>
              </dl>
            </div>

            {/* Trust Badges section for premium feel */}
            <div className="rounded-2xl border border-[#E8E1DF] bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-[#5a4e46]">
                <span className="material-symbols-outlined text-[16px] text-[#4A7C59]">lock</span>
                <span>ข้อมูลของคุณถูกเข้ารหัสและปลอดภัย 100% (SSL)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#5a4e46]">
                <span className="material-symbols-outlined text-[16px] text-[#A0724A]">workspace_premium</span>
                <span>รับประกันคุณภาพสินค้า UDEE นาน 1 ปี</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#5a4e46]">
                <span className="material-symbols-outlined text-[16px] text-[#3D2B1F]">local_shipping</span>
                <span>บริการจัดส่งและประกอบหน้างานฟรี</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </motion.main>
  );
};

export default CheckoutPage;