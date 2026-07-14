import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderTrackingPageData } from "../data/orderTrackingPageData";
import { getOrderByNumber } from "../services/orders";

const OrderTrackingPage = ({ order: initialOrder }) => {
  const navigate = useNavigate();
  const { orderNumber } = useParams();

  const [searchOrderNumber, setSearchOrderNumber] = useState(orderNumber || "");
  const [order, setOrder] = useState(initialOrder || orderTrackingPageData);

  useEffect(() => {
    const nextOrder = getOrderByNumber(orderNumber);
    setOrder(initialOrder || nextOrder);
    setSearchOrderNumber(orderNumber || "");
  }, [orderNumber, initialOrder]);

  const orderItems = useMemo(() => order?.items || [], [order]);
  const orderSteps = useMemo(() => order?.steps || [], [order]);
  const orderTotals = order?.totals || {
    subtotal: "฿0",
    shipping: "ฟรี",
    discount: "-฿0",
    total: "฿0",
  };

  const handleSearchOrder = (event) => {
    event.preventDefault();

    const cleanOrderNumber = searchOrderNumber.trim();

    if (!cleanOrderNumber) return;

    navigate(`/order-tracking/${cleanOrderNumber}`);
  };

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
          <form
            onSubmit={handleSearchOrder}
            className="flex flex-col gap-4 md:flex-row md:items-center"
          >
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-[#81756e]">
                ค้นหาเลขคำสั่งซื้อ
              </label>

              <input
                type="text"
                value={searchOrderNumber}
                onChange={(event) => setSearchOrderNumber(event.target.value)}
                placeholder="เช่น UDEE-260706-123"
                className="w-full rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-[#3D2B1F] px-8 py-3 font-semibold text-white transition hover:opacity-90 md:mt-7"
            >
              ติดตามคำสั่งซื้อ
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-4xl font-semibold text-[#3D2B1F]">
                    {order?.title || "ติดตามคำสั่งซื้อ"}
                  </h1>

                  <p className="mt-2 text-sm text-[#5a4e46]">
                    หมายเลขคำสั่งซื้อ: {order?.orderNumber || "-"}
                  </p>

                  <p className="text-sm text-[#5a4e46]">
                    วันที่สั่งซื้อ: {order?.orderDate || "-"}
                  </p>
                </div>

                <span className="inline-flex rounded-full bg-[#C8A882] px-4 py-2 text-sm font-semibold text-[#2A1F14]">
                  {order?.statusTag || "กำลังตรวจสอบ"}
                </span>
              </div>
            </div>

            {order?.shippingInfo && (
              <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <h2 className="mb-6 text-2xl font-semibold text-[#3D2B1F]">
                  ข้อมูลการจัดส่ง
                </h2>

                <div className="grid gap-4 text-sm text-[#5a4e46] md:grid-cols-2">
                  <p>
                    <span className="font-medium text-[#3D2B1F]">
                      ชื่อผู้รับ:
                    </span>{" "}
                    {order.shippingInfo.name || "-"}
                  </p>

                  <p>
                    <span className="font-medium text-[#3D2B1F]">
                      เบอร์โทร:
                    </span>{" "}
                    {order.shippingInfo.phone || "-"}
                  </p>

                  <p className="md:col-span-2">
                    <span className="font-medium text-[#3D2B1F]">ที่อยู่:</span>{" "}
                    {order.shippingInfo.address || "-"}
                    {order.shippingInfo.district
                      ? `, ${order.shippingInfo.district}`
                      : ""}
                    {order.shippingInfo.city
                      ? `, ${order.shippingInfo.city}`
                      : ""}
                    {order.shippingInfo.zip ? ` ${order.shippingInfo.zip}` : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <h2 className="mb-8 text-2xl font-semibold text-[#3D2B1F]">
                สถานะการจัดส่ง
              </h2>

              <div className="space-y-9">
                {orderSteps.map((step, index) => (
                  <div key={step.label} className="relative pl-14">
                    {index !== orderSteps.length - 1 && (
                      <div className="absolute left-5 top-10 h-full w-0.5 bg-[#D2C4BC]" />
                    )}

                    <div
                      className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${
                        step.completed || step.active
                          ? "bg-[#3D2B1F] text-white"
                          : "bg-white text-[#81756e]"
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        {step.completed ? "check" : step.icon}
                      </span>
                    </div>

                    <div>
                      <p
                        className={`text-lg font-semibold ${
                          step.active || step.completed
                            ? "text-[#3D2B1F]"
                            : "text-[#5a4e46]"
                        }`}
                      >
                        {step.label}
                      </p>

                      <p className="mt-1 text-sm text-[#5a4e46]">
                        {step.detail}
                      </p>

                      {step.datetime && (
                        <p className="mt-1 text-xs text-[#81756e]">
                          {step.datetime}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="w-full space-y-8 lg:w-[380px]">
            <div className="rounded-3xl bg-white p-8 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <h3 className="mb-6 text-2xl font-semibold text-[#3D2B1F]">
                สรุปรายการสินค้า
              </h3>

              {orderItems.length === 0 ? (
                <div className="rounded-2xl bg-[#F9F2F0] p-6 text-center text-sm text-[#81756e]">
                  ไม่พบรายการสินค้าในคำสั่งซื้อนี้
                </div>
              ) : (
                <div className="space-y-5">
                  {orderItems.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#F3ECEA]">
                        <img
                          className="h-full w-full object-cover"
                          src={item.image}
                          alt={item.title}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-[#3D2B1F]">
                          {item.title}
                        </p>

                        <p className="text-sm text-[#81756e]">
                          จำนวน: {item.qty}
                        </p>

                        {(item.variant || item.color || item.material) && (
                          <p className="mt-1 text-xs text-[#81756e]">
                            ตัวเลือก: {item.variant || "Standard"}
                            {item.color ? ` · ${item.color}` : ""}
                            {item.material ? ` · ${item.material}` : ""}
                          </p>
                        )}

                        {item.unitPrice && (
                          <p className="mt-1 text-xs text-[#81756e]">
                            ราคาต่อชิ้น: {item.unitPrice}
                          </p>
                        )}

                        <p className="mt-2 text-sm font-semibold text-[#A0724A]">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 space-y-3 border-t border-[#E8E1DF] pt-6 text-sm text-[#5a4e46]">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า</span>
                  <span>{orderTotals.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{orderTotals.shipping}</span>
                </div>

                <div className="flex justify-between text-[#BA1A1A]">
                  <span>ส่วนลด</span>
                  <span>{orderTotals.discount}</span>
                </div>

                <div className="flex justify-between border-t border-[#E8E1DF] pt-4 text-lg font-bold text-[#3D2B1F]">
                  <span>ยอดสุทธิ</span>
                  <span>{orderTotals.total}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#FEF4EA] p-6 text-sm text-[#5a4e46] shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#A0724A]">
                  info
                </span>
                <p>
                  {order?.note || "สามารถใช้เลขคำสั่งซื้อเพื่อติดตามสถานะได้"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderTrackingPage;
