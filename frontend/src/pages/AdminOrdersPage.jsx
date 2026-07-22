import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { adminOrdersPageData } from "../data/adminOrdersPageData";
import {
  getLocalOrders,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "../services/orders";

export default function AdminOrdersPage({
  reduceMotion = false,
  transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
}) {
  const [searchText, setSearchText] = useState("");
  const [localOrders, setLocalOrders] = useState(getLocalOrders());
  const [selectedOrder, setSelectedOrder] = useState(null);

  const demoOrders = adminOrdersPageData.map((order) => ({
    orderNumber: order.id,
    customerName: order.customer,
    orderDate: order.date,
    itemCount: order.items,
    total: order.total,
    status: order.status,
    statusTag: getStatusText(order.status),
    paymentInfo: null,
    shippingInfo: null,
    items: [],
    isDemo: true,
  }));

  const orders = localOrders.length > 0 ? localOrders : demoOrders;

  const filteredOrders = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const orderNumber = String(order.orderNumber || "").toLowerCase();
      const customerName = String(
        order.shippingInfo?.name || order.customerName || "",
      ).toLowerCase();

      return orderNumber.includes(keyword) || customerName.includes(keyword);
    });
  }, [orders, searchText]);

  function refreshOrders() {
    const nextOrders = getLocalOrders();
    setLocalOrders(nextOrders);

    if (selectedOrder) {
      const updatedSelected = nextOrders.find(
        (order) => order.orderNumber === selectedOrder.orderNumber,
      );

      setSelectedOrder(updatedSelected || null);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "Completed":
      case "delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Processing":
      case "packing":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Pending":
      case "pending":
      case "pending_payment":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Shipped":
      case "shipped":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Cancelled":
      case "rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      case "paid":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "Completed":
      case "delivered":
        return "สำเร็จ";
      case "Processing":
      case "packing":
        return "กำลังเตรียมสินค้า";
      case "Pending":
      case "pending":
      case "pending_payment":
        return "รอตรวจสอบสลิป";
      case "Shipped":
      case "shipped":
        return "จัดส่งแล้ว";
      case "Cancelled":
      case "rejected":
        return "สลิปไม่ถูกต้อง";
      case "paid":
        return "ชำระเงินแล้ว";
      default:
        return status || "ไม่ทราบสถานะ";
    }
  }

  function getPaymentStatusColor(status) {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      case "qr_not_found":
      case "qr_read_error":
        return "bg-red-50 text-red-700 border border-red-200";
      case "pending_review":
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  }

  function handleApprovePayment(orderNumber) {
    updateOrderPaymentStatus(orderNumber, "approved");
    refreshOrders();
  }

  function handleRejectPayment(orderNumber) {
    updateOrderPaymentStatus(orderNumber, "rejected");
    refreshOrders();
  }

  function handleChangeStatus(orderNumber, nextStatus) {
    updateOrderStatus(orderNumber, nextStatus);
    refreshOrders();
  }

  return (
    <div className="max-w-7xl space-y-5">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9CA3AF]">
            search
          </span>

          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="ค้นหาออเดอร์..."
            className="w-64 rounded-xl border border-[#E5E7EB] bg-white py-2 pl-9 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={refreshOrders}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-[#F9FAFB]"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            โหลดใหม่
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-[#F9FAFB]"
          >
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            ตัวกรอง
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3D2B1F] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d2318]"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            ส่งออก
          </button>
        </div>
      </div>

      <motion.div
        className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white"
        initial={reduceMotion ? false : { y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transition, delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {[
                  "Order ID",
                  "ลูกค้า",
                  "วันที่",
                  "จำนวน",
                  "ยอดรวม",
                  "ชำระเงิน",
                  "สถานะ",
                  "จัดการ",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredOrders.map((order, index) => {
                const paymentInfo = order.paymentInfo;
                const customerName =
                  order.shippingInfo?.name || order.customerName || "-";
                const orderDate = order.orderDate || order.date || "-";
                const itemCount =
                  order.items?.reduce(
                    (sum, item) => sum + Number(item.qty || 0),
                    0,
                  ) ||
                  order.itemCount ||
                  0;
                const orderTotal = order.totals?.total || order.total || "-";

                return (
                  <motion.tr
                    key={order.orderNumber}
                    className="transition-colors hover:bg-[#FAFAFA]"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ...transition, delay: 0.15 + index * 0.04 }}
                  >
                    <td className="px-5 py-3.5 font-bold text-[#3D2B1F]">
                      {order.orderNumber}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-[#374151]">
                      {customerName}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-[#9CA3AF]">
                      {orderDate}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-[#6B7280]">
                      {itemCount} ชิ้น
                    </td>

                    <td className="px-5 py-3.5 text-xs font-semibold text-[#111827]">
                      {orderTotal}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          paymentInfo
                            ? getPaymentStatusColor(paymentInfo.verifyStatus)
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {paymentInfo?.verifyStatusText || "ไม่มีข้อมูล"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.statusTag || getStatusText(order.status)}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[#6B7280] transition hover:bg-[#E5E7EB] hover:text-[#3D2B1F]"
                          title="ดูรายละเอียด"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                        </button>

                        {!order.isDemo && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleApprovePayment(order.orderNumber)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-green-50 text-green-700 transition hover:bg-green-100"
                              title="อนุมัติสลิป"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                check
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleRejectPayment(order.orderNumber)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-700 transition hover:bg-red-100"
                              title="ปฏิเสธสลิป"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                close
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <motion.div
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={transition}
          >
            <div className="flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#A0724A]">
                  Order Detail
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[#3D2B1F]">
                  {selectedOrder.orderNumber}
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  ลูกค้า:{" "}
                  {selectedOrder.shippingInfo?.name ||
                    selectedOrder.customerName ||
                    "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280] transition hover:bg-[#E5E7EB] hover:text-[#3D2B1F]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-semibold text-[#3D2B1F]">ข้อมูลจัดส่ง</h3>

                  <div className="mt-4 grid gap-3 text-sm text-[#4B5563] md:grid-cols-2">
                    <p>
                      <span className="font-medium text-[#111827]">
                        ชื่อผู้รับ:
                      </span>{" "}
                      {selectedOrder.shippingInfo?.name || "-"}
                    </p>
                    <p>
                      <span className="font-medium text-[#111827]">
                        เบอร์โทร:
                      </span>{" "}
                      {selectedOrder.shippingInfo?.phone || "-"}
                    </p>
                    <p className="md:col-span-2">
                      <span className="font-medium text-[#111827]">
                        ที่อยู่:
                      </span>{" "}
                      {selectedOrder.shippingInfo?.address || "-"}
                      {selectedOrder.shippingInfo?.district
                        ? `, ${selectedOrder.shippingInfo.district}`
                        : ""}
                      {selectedOrder.shippingInfo?.city
                        ? `, ${selectedOrder.shippingInfo.city}`
                        : ""}
                      {selectedOrder.shippingInfo?.zip
                        ? ` ${selectedOrder.shippingInfo.zip}`
                        : ""}
                    </p>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-semibold text-[#3D2B1F]">รายการสินค้า</h3>

                  <div className="mt-4 space-y-4">
                    {selectedOrder.items?.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="flex gap-4 rounded-2xl bg-[#F9FAFB] p-4"
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-xl bg-[#F3ECEA]">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <p className="font-medium text-[#111827]">
                              {item.title}
                            </p>
                            <p className="text-xs text-[#6B7280]">
                              จำนวน {item.qty} ชิ้น · {item.unitPrice}
                            </p>
                            <p className="mt-1 text-xs text-[#9CA3AF]">
                              {item.variant || "Standard"}
                              {item.color ? ` · ${item.color}` : ""}
                              {item.material ? ` · ${item.material}` : ""}
                            </p>
                          </div>

                          <p className="text-sm font-semibold text-[#A0724A]">
                            {item.price}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#6B7280]">
                        ไม่มีรายการสินค้า
                      </p>
                    )}
                  </div>
                </section>

                {!selectedOrder.isDemo && (
                  <section className="rounded-2xl border border-[#E5E7EB] p-5">
                    <h3 className="font-semibold text-[#3D2B1F]">
                      จัดการสถานะออเดอร์
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleChangeStatus(selectedOrder.orderNumber, "paid")
                        }
                        className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        ชำระเงินแล้ว
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleChangeStatus(
                            selectedOrder.orderNumber,
                            "packing",
                          )
                        }
                        className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        กำลังเตรียมสินค้า
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleChangeStatus(
                            selectedOrder.orderNumber,
                            "shipped",
                          )
                        }
                        className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
                      >
                        กำลังจัดส่ง
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleChangeStatus(
                            selectedOrder.orderNumber,
                            "delivered",
                          )
                        }
                        className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                      >
                        จัดส่งสำเร็จ
                      </button>
                    </div>
                  </section>
                )}
              </div>

              <aside className="space-y-6">
                <section className="rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-semibold text-[#3D2B1F]">
                    ข้อมูลการชำระเงิน
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-[#4B5563]">
                    <p>
                      <span className="font-medium text-[#111827]">สถานะ:</span>{" "}
                      {selectedOrder.paymentInfo?.verifyStatusText ||
                        "ไม่มีข้อมูล"}
                    </p>
                    <p>
                      <span className="font-medium text-[#111827]">
                        วันที่โอน:
                      </span>{" "}
                      {selectedOrder.paymentInfo?.transferDate || "-"}
                    </p>
                    <p>
                      <span className="font-medium text-[#111827]">
                        จำนวนเงิน:
                      </span>{" "}
                      {selectedOrder.paymentInfo?.amount
                        ? `฿${Number(
                            selectedOrder.paymentInfo.amount,
                          ).toLocaleString("th-TH")}`
                        : "-"}
                    </p>
                    <p>
                      <span className="font-medium text-[#111827]">
                        ไฟล์สลิป:
                      </span>{" "}
                      {selectedOrder.paymentInfo?.slipName || "-"}
                    </p>
                  </div>

                  {selectedOrder.paymentInfo?.slipPreview ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB]">
                      <img
                        src={selectedOrder.paymentInfo.slipPreview}
                        alt="สลิปการโอนเงิน"
                        className="max-h-80 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 flex h-48 items-center justify-center rounded-2xl bg-[#F9FAFB] text-sm text-[#9CA3AF]">
                      ไม่มีรูปสลิป
                    </div>
                  )}

                  {!selectedOrder.isDemo && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleApprovePayment(selectedOrder.orderNumber)
                        }
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        อนุมัติสลิป
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleRejectPayment(selectedOrder.orderNumber)
                        }
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-semibold text-[#3D2B1F]">
                    QR Slip Verification
                  </h3>

                  <div className="mt-4 rounded-2xl bg-[#F9FAFB] p-4 text-sm text-[#4B5563]">
                    <p>
                      <span className="font-medium text-[#111827]">
                        สถานะ QR:
                      </span>{" "}
                      {selectedOrder.paymentInfo?.qrStatus === "success"
                        ? "อ่าน QR สำเร็จ"
                        : "อ่าน QR ไม่สำเร็จ"}
                    </p>
                    <p className="mt-2">
                      {selectedOrder.paymentInfo?.qrMessage ||
                        "ไม่มีข้อมูลการอ่าน QR"}
                    </p>
                  </div>

                  {selectedOrder.paymentInfo?.qrPayload && (
                    <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
                      <p className="text-sm font-semibold text-[#111827]">
                        QR Payload
                      </p>
                      <p className="mt-2 break-all text-xs text-[#6B7280]">
                        {selectedOrder.paymentInfo.qrPayload}
                      </p>
                    </div>
                  )}
                </section>
              </aside>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
