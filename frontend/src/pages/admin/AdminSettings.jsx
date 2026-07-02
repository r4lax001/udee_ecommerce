import React, { useState } from 'react';

const SETTINGS_NAV = [
  { id: 'set-store', icon: 'ti-building-store', label: 'ข้อมูลร้านค้า' },
  { id: 'set-notify', icon: 'ti-bell', label: 'การแจ้งเตือน' },
  { id: 'set-payment', icon: 'ti-credit-card', label: 'การชำระเงิน' },
  { id: 'set-ship', icon: 'ti-truck', label: 'การจัดส่ง' },
  { id: 'set-account', icon: 'ti-user', label: 'บัญชีผู้ใช้' },
  { id: 'set-security', icon: 'ti-shield', label: 'ความปลอดภัย' },
];

function SaveButton() {
  return (
    <button className="btn-save">
      <i className="ti ti-device-floppy" aria-hidden="true"></i>บันทึกการเปลี่ยนแปลง
    </button>
  );
}

function Toggle({ label, desc, on, onToggle }) {
  return (
    <div className="toggle">
      <div className="toggle-info">
        <div className="toggle-label">{label}</div>
        <div className="toggle-desc">{desc}</div>
      </div>
      <div className={`switch ${on ? 'on' : 'off'}`} onClick={onToggle}></div>
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

  const flipNotif = (key) => setNotifToggles((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="settings-grid">
      <div className="settings-nav">
        {SETTINGS_NAV.map((item) => (
          <div
            key={item.id}
            className={`settings-nav-item${activeTab === item.id ? ' active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`ti ${item.icon}`} aria-hidden="true"></i>
            {item.label}
          </div>
        ))}
      </div>
      <div className="settings-content">
        {activeTab === 'set-store' && (
          <div>
            <div className="settings-section">
              <div className="settings-section-title">ข้อมูลร้านค้า</div>
              <div className="settings-section-desc">ข้อมูลพื้นฐานที่แสดงในเว็บไซต์และใบเสร็จ</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ชื่อร้านค้า</label>
                  <input className="form-input" defaultValue="UDEE Furniture" />
                </div>
                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์</label>
                  <input className="form-input" defaultValue="02-123-4567" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">อีเมลร้านค้า</label>
                <input className="form-input" defaultValue="contact@udee.co.th" />
              </div>
              <div className="form-group">
                <label className="form-label">ที่อยู่ร้านค้า</label>
                <input className="form-input" defaultValue="123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tax ID</label>
                  <input className="form-input" defaultValue="0105567123456" />
                </div>
                <div className="form-group">
                  <label className="form-label">เว็บไซต์</label>
                  <input className="form-input" defaultValue="https://udee.co.th" />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="settings-section">
              <div className="settings-section-title">โลโก้และรูปแบบ</div>
              <div className="settings-section-desc">อัปโหลดโลโก้และเลือกธีมสีของร้าน</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    background: 'var(--pr)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  U
                </div>
                <button
                  style={{
                    border: '1px solid var(--bd)',
                    background: 'var(--bg)',
                    borderRadius: 8,
                    padding: '7px 14px',
                    fontSize: 12,
                    color: 'var(--tm)',
                    cursor: 'pointer',
                  }}
                >
                  <i className="ti ti-upload" aria-hidden="true"></i> อัปโหลดโลโก้
                </button>
              </div>
            </div>
            <SaveButton />
          </div>
        )}

        {activeTab === 'set-notify' && (
          <div>
            <div className="settings-section">
              <div className="settings-section-title">การแจ้งเตือน</div>
              <div className="settings-section-desc">เลือกประเภทการแจ้งเตือนที่ต้องการรับ</div>
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
            <SaveButton />
          </div>
        )}

        {activeTab === 'set-payment' && (
          <div>
            <div className="settings-section">
              <div className="settings-section-title">ข้อมูลบัญชีธนาคาร</div>
              <div className="settings-section-desc">บัญชีที่ลูกค้าจะโอนเงินมา</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ธนาคาร</label>
                  <select className="form-input">
                    <option>กรุงไทย</option>
                    <option>กสิกร</option>
                    <option>ไทยพาณิชย์</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">เลขบัญชี</label>
                  <input className="form-input" defaultValue="123-4-56789-0" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">ชื่อบัญชี</label>
                <input className="form-input" defaultValue="บริษัท UDEE จำกัด" />
              </div>
            </div>
            <SaveButton />
          </div>
        )}

        {activeTab === 'set-ship' && (
          <div>
            <div className="settings-section">
              <div className="settings-section-title">การจัดส่ง</div>
              <div className="settings-section-desc">ตั้งค่าค่าจัดส่งและเงื่อนไข</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ค่าจัดส่งปกติ (บาท)</label>
                  <input className="form-input" defaultValue="150" />
                </div>
                <div className="form-group">
                  <label className="form-label">ยอดขั้นต่ำส่งฟรี (บาท)</label>
                  <input className="form-input" defaultValue="3000" />
                </div>
              </div>
              <Toggle
                label="จัดส่งฟรีเมื่อซื้อครบ"
                desc="เปิดใช้งานการส่งฟรีเมื่อซื้อครบตามกำหนด"
                on={freeShip}
                onToggle={() => setFreeShip((v) => !v)}
              />
            </div>
            <SaveButton />
          </div>
        )}

        {activeTab === 'set-account' && (
          <div>
            <div className="settings-section">
              <div className="settings-section-title">ข้อมูลบัญชี</div>
              <div className="settings-section-desc">แก้ไขข้อมูลส่วนตัวของผู้ดูแลระบบ</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ชื่อ</label>
                  <input className="form-input" defaultValue="ปัฐวัติ" />
                </div>
                <div className="form-group">
                  <label className="form-label">นามสกุล</label>
                  <input className="form-input" defaultValue="แสนคำเพิงใจ" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">อีเมล</label>
                <input className="form-input" defaultValue="admin@udee.co.th" />
              </div>
            </div>
            <SaveButton />
          </div>
        )}

        {activeTab === 'set-security' && (
          <div>
            <div className="settings-section">
              <div className="settings-section-title">ความปลอดภัย</div>
              <div className="settings-section-desc">เปลี่ยนรหัสผ่านและตั้งค่าการยืนยันตัวตน</div>
              <div className="form-group">
                <label className="form-label">รหัสผ่านปัจจุบัน</label>
                <input className="form-input" type="password" defaultValue="••••••••" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">รหัสผ่านใหม่</label>
                  <input className="form-input" type="password" />
                </div>
                <div className="form-group">
                  <label className="form-label">ยืนยันรหัสผ่านใหม่</label>
                  <input className="form-input" type="password" />
                </div>
              </div>
              <Toggle
                label="Two-Factor Authentication"
                desc="เพิ่มความปลอดภัยด้วยการยืนยันตัวตนสองขั้นตอน"
                on={twoFactor}
                onToggle={() => setTwoFactor((v) => !v)}
              />
            </div>
            <SaveButton />
          </div>
        )}
      </div>
    </div>
  );
}
