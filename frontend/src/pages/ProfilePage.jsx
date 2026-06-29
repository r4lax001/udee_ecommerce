import { useState } from 'react'
import { profilePageData } from '../data/profilePageData'

const defaultUser = profilePageData.user
const purchases = profilePageData.history

const ProfilePage = ({ user = defaultUser, history = purchases }) => {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <main className="min-h-screen bg-[#F8F3EE] text-[#1D1B1A]">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-[2rem] bg-white p-10 shadow-[0_2px_25px_rgba(61,43,31,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#A0724A]">บัญชีของฉัน</p>
              <h1 className="mt-3 text-4xl font-semibold text-[#3D2B1F]">{user.name}</h1>
            </div>
            <button className="rounded-2xl bg-[#3D2B1F] px-6 py-3 text-white hover:opacity-90 transition">
              อัปเดตโปรไฟล์
            </button>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-6 rounded-[2rem] bg-[#FEF4EA] p-8">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <p className="text-sm text-[#81756e]">สมาชิกตั้งแต่</p>
                <p className="mt-3 text-xl font-semibold text-[#3D2B1F]">{user.joined}</p>
              </div>
              <div className="space-y-3">
                {['profile', 'orders', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`w-full rounded-2xl px-5 py-4 text-left text-sm font-semibold transition ${
                      activeTab === tab ? 'bg-[#3D2B1F] text-white' : 'bg-white text-[#3D2B1F] hover:bg-[#F3ECEA]'
                    }`}
                  >
                    {tab === 'profile' ? 'ข้อมูลส่วนตัว' : tab === 'orders' ? 'ประวัติการสั่งซื้อ' : 'การตั้งค่า'}
                  </button>
                ))}
              </div>
            </aside>
            <div className="space-y-8">
              {activeTab === 'profile' && (
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ข้อมูลส่วนตัว</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {[
                      { label: 'ชื่อ-นามสกุล', value: user.name },
                      { label: 'อีเมล', value: user.email },
                      { label: 'เบอร์โทรศัพท์', value: user.phone },
                      { label: 'ที่อยู่', value: user.address },
                    ].map((field) => (
                      <div key={field.label} className="rounded-3xl bg-[#F8F3EE] p-6">
                        <p className="text-sm text-[#81756e]">{field.label}</p>
                        <p className="mt-3 text-lg font-medium text-[#3D2B1F]">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'orders' && (
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">ประวัติการสั่งซื้อ</h2>
                  <div className="mt-8 space-y-4">
                    {history.map((purchase) => (
                      <div key={purchase.id} className="rounded-3xl border border-[#E8E1DF] p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-[#3D2B1F]">{purchase.id}</p>
                            <p className="text-sm text-[#81756e]">{purchase.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#81756e]">ยอดรวม</p>
                            <p className="text-lg font-semibold text-[#A0724A]">{purchase.total}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-[#5a4e46]">สถานะ: {purchase.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-[#3D2B1F]">การตั้งค่า</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div className="rounded-3xl bg-[#F8F3EE] p-6">
                      <p className="text-sm text-[#81756e]">การแจ้งเตือน</p>
                      <p className="mt-3 text-lg text-[#3D2B1F]">เปิดใช้งาน</p>
                    </div>
                    <div className="rounded-3xl bg-[#F8F3EE] p-6">
                      <p className="text-sm text-[#81756e]">ภาษา</p>
                      <p className="mt-3 text-lg text-[#3D2B1F]">ไทย</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProfilePage
