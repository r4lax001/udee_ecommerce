import { useState } from 'react';

const SETTINGS_NAV = [
  { id: 'set-store', icon: 'storefront', label: 'ข้อมูลร้านค้า' },
  { id: 'set-notify', icon: 'notifications', label: 'การแจ้งเตือน' },
  { id: 'set-payment', icon: 'credit_card', label: 'การชำระเงิน' },
  { id: 'set-ship', icon: 'local_shipping', label: 'การจัดส่ง' },
  { id: 'set-account', icon: 'person', label: 'บัญชีผู้ใช้' },
  { id: 'set-security', icon: 'security', label: 'ความปลอดภัย' },
];

function SaveButton({ onClick }) {
  return (
    <div className="flex justify-end">
      <button 
        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all shadow-sm active:scale-[0.98]" 
        onClick={onClick}
      >
        <span className="material-symbols-outlined text-[18px]">save</span>
        บันทึกการเปลี่ยนแปลง
      </button>
    </div>
  );
}

function Toggle({ label, desc, on, onToggle }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 cursor-pointer" onClick={onToggle}>
      <div className="flex-1 pr-4">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${on ? 'bg-emerald-600' : 'bg-gray-200'}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${on ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('set-store');
  const [notifToggles, setNotifToggles] = useState({
    newOrder: true,
    payment: true,
    lowStock: true,
    newCustomer: false,
    dailyReport: false,
  });
  const [freeShip, setFreeShip] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const flipNotif = (key) => setNotifToggles((s) => ({ ...s, [key]: !s[key] }));

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-shrink-0 flex-col gap-1.5">
        {SETTINGS_NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10 scale-[1.02]' 
                : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'set-store' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-gray-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative">
                <div className="text-lg font-bold text-gray-900">ข้อมูลร้านค้า</div>
                <div className="text-sm text-gray-500 mb-6">ข้อมูลพื้นฐานที่แสดงในเว็บไซต์และใบเสร็จ</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อร้านค้า</label>
                    <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="UDEE Furniture" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
                    <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="02-123-4567" />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมลร้านค้า</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="contact@udee.co.th" />
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ที่อยู่ร้านค้า</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax ID</label>
                    <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="0105567123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">เว็บไซต์</label>
                    <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="https://udee.co.th" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="text-lg font-bold text-gray-900">โลโก้และรูปแบบ</div>
              <div className="text-sm text-gray-500 mb-6">อัปโหลดโลโก้และเลือกธีมสีของร้าน</div>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-gray-900/20">
                  U
                </div>
                <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  อัปโหลดโลโก้
                </button>
              </div>
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {activeTab === 'set-notify' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="text-lg font-bold text-gray-900">การแจ้งเตือน</div>
              <div className="text-sm text-gray-500 mb-4">เลือกประเภทการแจ้งเตือนที่ต้องการรับ</div>
              <div className="divide-y divide-gray-100">
                <Toggle
                  label="ออเดอร์ใหม่"
                  desc="แจ้งเตือนเมื่อมีคำสั่งซื้อใหม่เข้ามา"
                  on={notifToggles.newOrder}
                  onToggle={() => flipNotif('newOrder')}
                />
                <Toggle
                  label="การชำระเงิน"
                  desc="แจ้งเตือนเมื่อลูกค้าอัปโหลด Slip"
                  on={notifToggles.payment}
                  onToggle={() => flipNotif('payment')}
                />
                <Toggle
                  label="สต็อกใกล้หมด"
                  desc="แจ้งเตือนเมื่อสินค้าเหลือน้อยกว่า 5 ชิ้น"
                  on={notifToggles.lowStock}
                  onToggle={() => flipNotif('lowStock')}
                />
                <Toggle
                  label="ลูกค้าใหม่"
                  desc="แจ้งเตือนเมื่อมีลูกค้าสมัครสมาชิกใหม่"
                  on={notifToggles.newCustomer}
                  onToggle={() => flipNotif('newCustomer')}
                />
                <Toggle
                  label="รายงานรายวัน"
                  desc="ส่งสรุปยอดขายทุกวัน 8:00 น. ทางอีเมล"
                  on={notifToggles.dailyReport}
                  onToggle={() => flipNotif('dailyReport')}
                />
              </div>
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {activeTab === 'set-payment' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="text-lg font-bold text-gray-900">ข้อมูลบัญชีธนาคาร</div>
              <div className="text-sm text-gray-500 mb-6">บัญชีที่ลูกค้าจะโอนเงินมา</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ธนาคาร</label>
                  <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm">
                    <option>กรุงไทย</option>
                    <option>กสิกร</option>
                    <option>ไทยพาณิชย์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">เลขบัญชี</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="123-4-56789-0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อบัญชี</label>
                <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="บริษัท UDEE จำกัด" />
              </div>
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {activeTab === 'set-ship' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="text-lg font-bold text-gray-900">การจัดส่ง</div>
              <div className="text-sm text-gray-500 mb-6">ตั้งค่าค่าจัดส่งและเงื่อนไข</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ค่าจัดส่งปกติ (บาท)</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="150" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ยอดขั้นต่ำส่งฟรี (บาท)</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="3000" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <Toggle
                  label="จัดส่งฟรีเมื่อซื้อครบ"
                  desc="เปิดใช้งานการส่งฟรีเมื่อซื้อครบตามกำหนด"
                  on={freeShip}
                  onToggle={() => setFreeShip((v) => !v)}
                />
              </div>
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {activeTab === 'set-account' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="text-lg font-bold text-gray-900">ข้อมูลบัญชี</div>
              <div className="text-sm text-gray-500 mb-6">แก้ไขข้อมูลส่วนตัวของผู้ดูแลระบบ</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="ปัฐวัติ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">นามสกุล</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="แสนคำเพิงใจ" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
                <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" defaultValue="admin@udee.co.th" />
              </div>
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {activeTab === 'set-security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="text-lg font-bold text-gray-900">ความปลอดภัย</div>
              <div className="text-sm text-gray-500 mb-6">เปลี่ยนรหัสผ่านและตั้งค่าการยืนยันตัวตน</div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่านปัจจุบัน</label>
                <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" type="password" defaultValue="••••••••" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่านใหม่</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ยืนยันรหัสผ่านใหม่</label>
                  <input className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm" type="password" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <Toggle
                  label="Two-Factor Authentication"
                  desc="เพิ่มความปลอดภัยด้วยการยืนยันตัวตนสองขั้นตอน"
                  on={twoFactor}
                  onToggle={() => setTwoFactor((v) => !v)}
                />
              </div>
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="font-medium text-sm">บันทึกการตั้งค่าสำเร็จ!</span>
        </div>
      )}
    </div>
  );
}
