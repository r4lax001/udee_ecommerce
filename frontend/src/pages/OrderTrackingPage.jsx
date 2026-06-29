import { orderTrackingPageData } from '../data/orderTrackingPageData'

const OrderTrackingPage = ({ order = orderTrackingPageData }) => {
  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-4xl font-semibold text-[#3D2B1F]">{order.title}</h1>
                  <p className="text-sm text-[#5a4e46] mt-2">หมายเลขคำสั่งซื้อ: {order.orderNumber}</p>
                  <p className="text-sm text-[#5a4e46]">วันที่สั่งซื้อ: {order.orderDate}</p>
                </div>
                <span className="inline-flex rounded-full bg-[#C8A882] px-4 py-2 text-sm font-semibold text-[#2A1F14]">
                  {order.statusTag}
                </span>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <h2 className="mb-8 text-2xl font-semibold text-[#3D2B1F]">สถานะการจัดส่ง</h2>
              <div className="space-y-9">
                {order.steps.map((step) => (
                  <div key={step.label} className="relative pl-14">
                    <div className="absolute left-5 top-0 h-full w-0.5 bg-[#D2C4BC]" />
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                      <span className={`material-symbols-outlined ${step.active ? 'text-[#3D2B1F]' : 'text-[#81756e]'}`}>
                        {step.icon}
                      </span>
                    </div>
                    <div>
                      <p className={`text-lg font-semibold ${step.active ? 'text-[#3D2B1F]' : 'text-[#5a4e46]'}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-[#5a4e46] mt-1">{step.detail}</p>
                      {step.datetime && <p className="text-xs text-[#81756e] mt-1">{step.datetime}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="w-full lg:w-[380px] space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <h3 className="text-2xl font-semibold text-[#3D2B1F] mb-6">สรุปรายการสินค้า</h3>
              <div className="space-y-5">
                {order.items.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#F3ECEA]">
                      <img className="h-full w-full object-cover" src={item.image} alt={item.title} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#3D2B1F]">{item.title}</p>
                      <p className="text-sm text-[#81756e]">จำนวน: {item.qty}</p>
                      <p className="text-sm font-semibold text-[#A0724A] mt-2">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-[#E8E1DF] pt-6 space-y-3 text-sm text-[#5a4e46]">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า</span>
                  <span>{order.totals.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{order.totals.shipping}</span>
                </div>
                <div className="flex justify-between text-[#BA1A1A]">
                  <span>ส่วนลด</span>
                  <span>{order.totals.discount}</span>
                </div>
                <div className="flex justify-between pt-4 text-lg font-bold text-[#3D2B1F] border-t border-[#E8E1DF]">
                  <span>ยอดสุทธิ</span>
                  <span>{order.totals.total}</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-[#FEF4EA] p-6 text-sm text-[#5a4e46] shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#A0724A]">info</span>
                <p>{order.note}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default OrderTrackingPage
