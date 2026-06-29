import { useState } from 'react'
import { productDetailPageData } from '../data/productDetailPageData'

const ProductDetailPage = ({ product = productDetailPageData }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedMaterial, setSelectedMaterial] = useState(product.materialOptions[0])
  const [quantity, setQuantity] = useState(1)

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#FAF6F1] shadow-2xl">
              <img src={product.gallery[0]} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
              <div className="absolute left-6 top-6 rounded-full bg-[#C8A882] px-4 py-2 text-sm font-semibold text-[#2A1F14]">
                {product.badge}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.gallery.map((src) => (
                <button key={src} type="button" className="overflow-hidden rounded-2xl border border-[#E8E1DF] bg-white">
                  <img src={src} alt="Gallery" className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-semibold text-[#3D2B1F]">{product.name}</h1>
              <div className="mt-4 flex items-end gap-4">
                <span className="text-4xl font-bold text-[#3D2B1F]">{product.price}</span>
                <span className="text-sm line-through text-[#81756E]">{product.oldPrice}</span>
              </div>
            </div>
            <p className="text-sm leading-7 text-[#5a4e46]">{product.description}</p>
            <div className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#81756E]">ขนาดความยาว</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                          selectedVariant === variant
                            ? 'bg-[#3D2B1F] text-white'
                            : 'border border-[#D2C4BC] text-[#5a4e46] hover:bg-[#F3ECEA]'
                        }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#81756E]">เฉดสีไม้</p>
                  <div className="mt-3 flex items-center gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 w-10 rounded-full border-2 ${
                          selectedColor === color ? 'border-[#3D2B1F]' : 'border-[#E8E1DF]'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#81756E] block mb-3">วัสดุหน้าท็อป</label>
                  <select
                    value={selectedMaterial}
                    onChange={(event) => setSelectedMaterial(event.target.value)}
                    className="w-full rounded-2xl border border-[#D2C4BC] bg-[#F9F2F0] px-4 py-3 text-sm outline-none focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  >
                    {product.materialOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center border border-[#D2C4BC] rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-3 text-[#5a4e46] hover:bg-[#F3ECEA]"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                      className="w-16 border-none text-center text-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-4 py-3 text-[#5a4e46] hover:bg-[#F3ECEA]"
                    >
                      +
                    </button>
                  </div>
                  <button className="w-full rounded-2xl bg-[#3D2B1F] px-8 py-4 text-white font-semibold hover:opacity-90 transition sm:w-auto">
                    เพิ่มลงตะกร้า
                  </button>
                </div>
                <button className="w-full rounded-2xl border border-[#3D2B1F] px-8 py-4 text-[#3D2B1F] font-semibold hover:bg-[#F3ECEA] transition">
                  สั่งซื้อเลย
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 text-sm shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <p className="font-semibold text-[#3D2B1F]">จัดส่งฟรี</p>
                <p className="text-[#81756e] mt-2">ทั่วประเทศเมื่อสั่งซื้อครบตามเงื่อนไข</p>
              </div>
              <div className="rounded-3xl bg-white p-6 text-sm shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <p className="font-semibold text-[#3D2B1F]">รับประกัน 5 ปี</p>
                <p className="text-[#81756e] mt-2">คุณภาพไม้แท้ที่มั่นใจได้</p>
              </div>
              <div className="rounded-3xl bg-white p-6 text-sm shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <p className="font-semibold text-[#3D2B1F]">คืนสินค้า 30 วัน</p>
                <p className="text-[#81756e] mt-2">นโยบายง่ายและเป็นมิตร</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-3xl bg-white p-10 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
          <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">รายละเอียดสินค้า</h2>
          <p className="text-sm leading-7 text-[#5a4e46]">{product.description}</p>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-sm text-[#5a4e46]">
            {product.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">สินค้าที่คล้ายกัน</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {product.gallery.map((src, index) => (
              <div key={index} className="min-w-[260px] rounded-3xl bg-white p-4 shadow-[0_2px_8px_rgba(61,43,31,0.08)]">
                <img className="h-[320px] w-full rounded-3xl object-cover" src={src} alt="Related product" />
                <div className="mt-4">
                  <p className="font-semibold text-[#3D2B1F]">Related Product</p>
                  <p className="text-sm text-[#A0724A]">฿5,200</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetailPage
