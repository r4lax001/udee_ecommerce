<<<<<<< HEAD
import React from 'react';
=======
import React, { useState, useEffect } from 'react';
import { getUsers, updateUserStatus } from '../../services/admin';
>>>>>>> auth-system

const BAR_DATA = [42, 58, 35, 67, 89, 74, 95, 82, 61, 78, 55, 90];
const MONTH_LABELS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export function PagePlaceholder({ icon, text }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 40 }}>
      <i className={`ti ${icon}`} style={{ fontSize: 40, color: 'var(--bd)' }} aria-hidden="true"></i>
      <div style={{ fontSize: 15, color: 'var(--tm)', marginTop: 12 }}>{text}</div>
    </div>
  );
}

export function Dashboard() {
  const maxVal = Math.max(...BAR_DATA);

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">
            <i className="ti ti-currency-baht" aria-hidden="true"></i>
          </div>
          <div className="kpi-label">รายได้วันนี้</div>
          <div className="kpi-value">฿42,800</div>
          <span className="kpi-badge up">
            <i className="ti ti-trending-up" style={{ fontSize: 11 }}></i>+16%
          </span>
        </div>
        <div className="kpi-card orders">
          <div className="kpi-icon" style={{ background: '#EAF3DE', color: '#4A7C59' }}>
            <i className="ti ti-shopping-bag" aria-hidden="true"></i>
          </div>
          <div className="kpi-label">ยอดออเดอร์</div>
          <div className="kpi-value">124</div>
          <span className="kpi-badge up">
            <i className="ti ti-trending-up" style={{ fontSize: 11 }}></i>+8%
          </span>
        </div>
        <div className="kpi-card customers">
          <div className="kpi-icon" style={{ background: '#E6F1FB', color: '#185FA5' }}>
            <i className="ti ti-user-plus" aria-hidden="true"></i>
          </div>
          <div className="kpi-label">ลูกค้าใหม่</div>
          <div className="kpi-value">48</div>
          <span className="kpi-badge up">
            <i className="ti ti-trending-up" style={{ fontSize: 11 }}></i>+12%
          </span>
        </div>
        <div className="kpi-card stock">
          <div className="kpi-icon" style={{ background: '#FAEEDA', color: '#C17B2A' }}>
            <i className="ti ti-box" aria-hidden="true"></i>
          </div>
          <div className="kpi-label">สินค้าคงเหลือ</div>
          <div className="kpi-value">1,234</div>
          <span className="kpi-badge down">
            <i className="ti ti-trending-down" style={{ fontSize: 11 }}></i>-4%
          </span>
        </div>
      </div>

      <div className="row2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">ยอดขายรายเดือน</div>
              <div className="card-sub">เปรียบเทียบปีนี้ vs ปีที่แล้ว</div>
            </div>
            <select
              style={{
                fontSize: 12,
                border: '1px solid var(--bd)',
                borderRadius: 6,
                padding: '4px 8px',
                color: 'var(--tm)',
                background: 'var(--bg)',
              }}
            >
              <option>ปีนี้</option>
              <option>ปีที่แล้ว</option>
            </select>
          </div>
          <div className="chart-area">
            {BAR_DATA.map((v, i) => (
              <div className="bar-wrap" key={i}>
                <div
                  className="bar"
                  style={{
                    height: `${Math.round((v / maxVal) * 100)}%`,
                    background: v === maxVal ? '#3D2B1F' : v > 70 ? '#A0724A' : '#DDD0C4',
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, justifyContent: 'space-between' }}>
            {MONTH_LABELS.map((m) => (
              <span className="bar-lbl" key={m}>
                {m}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div className="card-head">
              <div className="card-title">การแจ้งเตือน</div>
              <span
                style={{
                  background: '#B94040',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 20,
                }}
              >
                2
              </span>
            </div>
            <div className="notif">
              <i className="ti ti-shopping-cart" aria-hidden="true"></i>
              <div>
                <div className="notif-title">คำสั่งซื้อใหม่ 25 รายการ</div>
                <div className="notif-time">1 ชั่วโมงที่แล้ว</div>
              </div>
            </div>
            <div className="notif" style={{ background: '#FCEBEB' }}>
              <i className="ti ti-alert-triangle" style={{ color: '#B94040' }} aria-hidden="true"></i>
              <div>
                <div className="notif-title">สต็อกสินค้าใกล้หมด</div>
                <div className="notif-time">3 ชั่วโมงที่แล้ว</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <div className="card-title">สินค้าขายดี</div>
            </div>
            <div className="top5-row">
              <div className="top5-rank">1</div>
              <div className="top5-img">
                <i className="ti ti-armchair" style={{ color: 'var(--ac)' }} aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <div className="top5-name">โต๊ะกินข้าวไม้แท้</div>
                <div className="top5-sales">ขาย 42 ชิ้น</div>
              </div>
              <div className="top5-val">฿84,000</div>
            </div>
            <div className="top5-row">
              <div className="top5-rank">2</div>
              <div className="top5-img">
                <i className="ti ti-device-laptop" style={{ color: 'var(--ac)' }} aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <div className="top5-name">โต๊ะคอมปรับระดับ</div>
                <div className="top5-sales">ขาย 38 ชิ้น</div>
              </div>
              <div className="top5-val">฿57,000</div>
            </div>
            <div className="top5-row">
              <div className="top5-rank">3</div>
              <div className="top5-img">
                <i className="ti ti-sofa" style={{ color: 'var(--ac)' }} aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <div className="top5-name">โต๊ะกาแฟตกแต่ง</div>
                <div className="top5-sales">ขาย 29 ชิ้น</div>
              </div>
              <div className="top5-val">฿43,500</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">ออเดอร์ล่าสุด</div>
          <a className="view-all">ดูทั้งหมด →</a>
        </div>
        <table>
          <tbody>
            <tr>
              <th>ORDER ID</th>
              <th>ลูกค้า</th>
              <th>สินค้า</th>
              <th>ยอด</th>
              <th>สถานะ</th>
              <th>วันที่</th>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>ORD-001</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar">สช</div>สมชาย ใจดี
                </div>
              </td>
              <td>โต๊ะกินข้าวไม้แท้</td>
              <td>฿45,900</td>
              <td>
                <span className="badge done">สำเร็จ</span>
              </td>
              <td style={{ color: 'var(--tm)' }}>2 ชม. ที่แล้ว</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>ORD-002</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar" style={{ background: '#E6F1FB', color: '#185FA5' }}>
                    วส
                  </div>
                  วิภา สุขสันต์
                </div>
              </td>
              <td>โต๊ะคอมปรับระดับ</td>
              <td>฿28,500</td>
              <td>
                <span className="badge process">กำลังดำเนินการ</span>
              </td>
              <td style={{ color: 'var(--tm)' }}>5 ชม. ที่แล้ว</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>ORD-003</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar" style={{ background: '#FAEEDA', color: '#854F0B' }}>
                    นร
                  </div>
                  นภูม รักษ์ดี
                </div>
              </td>
              <td>โต๊ะตกแต่งกาแฟ</td>
              <td>฿67,200</td>
              <td>
                <span className="badge pending">รอชำระเงิน</span>
              </td>
              <td style={{ color: 'var(--tm)' }}>1 วันที่แล้ว</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>ORD-004</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                    ปส
                  </div>
                  ปิยะ สมบัติ
                </div>
              </td>
              <td>โต๊ะกินข้าว 6 ที่นั่ง</td>
              <td>฿32,000</td>
              <td>
                <span className="badge cancel">ยกเลิก</span>
              </td>
              <td style={{ color: 'var(--tm)' }}>2 วันที่แล้ว</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

const CUSTOMERS = [
  {
    initials: 'สช',
    bg: 'var(--sa)',
    color: 'var(--ac)',
    name: 'สมชาย ใจดี',
    phone: '0812345678',
    email: 'somchai@gmail.com',
    total: '฿145,900',
    orders: 12,
    tag: 'vip',
    tagLabel: 'VIP',
    date: '15 ม.ค. 68',
  },
  {
    initials: 'วส',
    bg: '#E6F1FB',
    color: '#185FA5',
    name: 'วิภา สุขสันต์',
    phone: '0898765432',
    email: 'vipa@gmail.com',
    total: '฿28,500',
    orders: 3,
    tag: 'reg',
    tagLabel: 'ทั่วไป',
    date: '20 ม.ค. 68',
  },
  {
    initials: 'นร',
    bg: '#EAF3DE',
    color: '#3B6D11',
    name: 'นภูม รักษ์ดี',
    phone: '0876543210',
    email: 'napoom@hotmail.com',
    total: '฿5,200',
    orders: 1,
    tag: 'new',
    tagLabel: 'ใหม่',
    date: '2 มิ.ย. 68',
  },
  {
    initials: 'กพ',
    bg: '#FAEEDA',
    color: '#854F0B',
    name: 'กนกพร วงษ์ทอง',
    phone: '0654321098',
    email: 'kanok@yahoo.com',
    total: '฿89,300',
    orders: 7,
    tag: 'vip',
    tagLabel: 'VIP',
    date: '5 ก.พ. 68',
  },
];

export function Customers() {
<<<<<<< HEAD
=======
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'ไม่สามารถดึงข้อมูลสมาชิกได้');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleVerify = async (userId, currentVerified) => {
    try {
      const data = await updateUserStatus(userId, { isVerified: !currentVerified });
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !currentVerified } : u));
        alert('อัปเดตสถานะการยืนยันตัวตนสำเร็จ');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const handleToggleSuspend = async (userId, currentSuspended) => {
    const actionText = currentSuspended ? 'ต้องการยกเลิกการระงับบัญชีนี้?' : 'ต้องการระงับการใช้งานบัญชีนี้? ผู้ใช้จะไม่สามารถเข้าสู่ระบบได้';
    if (!confirm(actionText)) return;

    try {
      const data = await updateUserStatus(userId, { isSuspended: !currentSuspended });
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: !currentSuspended } : u));
        alert('อัปเดตสถานะบัญชีสำเร็จ');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการปรับสถานะบัญชี');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone && user.phone.includes(searchTerm));

    if (!matchesSearch) return false;

    if (activeFilter === 'verified') return user.isVerified;
    if (activeFilter === 'unverified') return !user.isVerified;
    if (activeFilter === 'suspended') return user.isSuspended;
    return true;
  });

  const countFilter = (filterType) => {
    return users.filter(user => {
      if (filterType === 'verified') return user.isVerified;
      if (filterType === 'unverified') return !user.isVerified;
      if (filterType === 'suspended') return user.isSuspended;
      return true;
    }).length;
  };

>>>>>>> auth-system
  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
<<<<<<< HEAD
          <div className="stat-num">1,284</div>
          <div className="stat-lbl">ลูกค้าทั้งหมด</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#4A7C59' }}>
            +48
          </div>
          <div className="stat-lbl">ลูกค้าใหม่เดือนนี้</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--ac)' }}>
            ฿3,420
          </div>
          <div className="stat-lbl">ค่าใช้จ่ายเฉลี่ย/คน</div>
=======
          <div className="stat-num">{users.length}</div>
          <div className="stat-lbl">สมาชิกทั้งหมด</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#4A7C59' }}>
            {countFilter('verified')}
          </div>
          <div className="stat-lbl">ยืนยันอีเมลแล้ว</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#B94040' }}>
            {countFilter('suspended')}
          </div>
          <div className="stat-lbl">บัญชีที่ถูกระงับ</div>
>>>>>>> auth-system
        </div>
      </div>
      <div className="card">
        <div className="card-head">
<<<<<<< HEAD
          <div className="card-title">รายชื่อลูกค้า</div>
          <button className="btn-save">
            <i className="ti ti-plus" aria-hidden="true"></i>เพิ่มลูกค้า
=======
          <div className="card-title">การจัดการผู้ใช้งานในระบบ</div>
          <button className="btn-save" onClick={fetchUsers}>
            <i className="ti ti-refresh" aria-hidden="true" style={{ marginRight: 4 }}></i>รีเฟรชข้อมูล
>>>>>>> auth-system
          </button>
        </div>
        <div className="search-bar">
          <i className="ti ti-search" aria-hidden="true"></i>
<<<<<<< HEAD
          <input placeholder="ค้นหาชื่อ, อีเมล, เบอร์..." />
        </div>
        <div className="filter-bar">
          <span className="filter-chip active">ทั้งหมด (1,284)</span>
          <span className="filter-chip">VIP (128)</span>
          <span className="filter-chip">ลูกค้าใหม่ (48)</span>
          <span className="filter-chip">ไม่ active (23)</span>
        </div>
        <table>
          <tbody>
            <tr>
              <th>ลูกค้า</th>
              <th>อีเมล</th>
              <th>ยอดซื้อรวม</th>
              <th>จำนวนออเดอร์</th>
              <th>ประเภท</th>
              <th>วันที่สมัคร</th>
            </tr>
            {CUSTOMERS.map((c) => (
              <tr key={c.phone}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar" style={{ background: c.bg, color: c.color }}>
                      {c.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--tm)' }}>{c.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--tm)', fontSize: 12 }}>{c.email}</td>
                <td style={{ fontWeight: 500 }}>{c.total}</td>
                <td style={{ textAlign: 'center' }}>{c.orders}</td>
                <td>
                  <span className={`tag ${c.tag}`}>{c.tagLabel}</span>
                </td>
                <td style={{ color: 'var(--tm)', fontSize: 12 }}>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
=======
          <input 
            placeholder="ค้นหาด้วยชื่อ, อีเมล หรือเบอร์โทรศัพท์..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-bar">
          <span 
            className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            ทั้งหมด ({users.length})
          </span>
          <span 
            className={`filter-chip ${activeFilter === 'verified' ? 'active' : ''}`}
            onClick={() => setActiveFilter('verified')}
          >
            ยืนยันอีเมลแล้ว ({countFilter('verified')})
          </span>
          <span 
            className={`filter-chip ${activeFilter === 'unverified' ? 'active' : ''}`}
            onClick={() => setActiveFilter('unverified')}
          >
            ยังไม่ยืนยันอีเมล ({countFilter('unverified')})
          </span>
          <span 
            className={`filter-chip ${activeFilter === 'suspended' ? 'active' : ''}`}
            onClick={() => setActiveFilter('suspended')}
          >
            บัญชีที่ถูกระงับ ({countFilter('suspended')})
          </span>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--tm)' }}>
            กำลังโหลดข้อมูลสมาชิก...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#B94040' }}>
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--tm)' }}>
            ไม่พบข้อมูลผู้ใช้งานที่ตรงตามเงื่อนไข
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ padding: '10px' }}>ลูกค้า</th>
                <th style={{ padding: '10px' }}>อีเมล</th>
                <th style={{ padding: '10px' }}>สิทธิ์</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>ยืนยันเมล</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>สถานะบัญชี</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ background: '#F2EBE2', color: '#3D2B1F' }}>
                        {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tm)' }}>{c.phone || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px', color: 'var(--tm)', fontSize: 12 }}>{c.email}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`tag ${c.role === 'ADMIN' ? 'vip' : 'reg'}`}>
                      {c.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span className={`badge ${c.isVerified ? 'done' : 'pending'}`}>
                      {c.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span className={`badge ${c.isSuspended ? 'cancel' : 'done'}`}>
                      {c.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button
                        onClick={() => handleToggleVerify(c.id, c.isVerified)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border: '1px solid var(--bd)',
                          background: 'white',
                          cursor: 'pointer',
                          color: 'var(--tx)',
                        }}
                      >
                        {c.isVerified ? 'ยกเลิกยืนยัน' : 'ยืนยัน'}
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(c.id, c.isSuspended)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border: '1px solid ' + (c.isSuspended ? '#4A7C59' : '#B94040'),
                          background: 'white',
                          color: c.isSuspended ? '#4A7C59' : '#B94040',
                          cursor: 'pointer',
                        }}
                      >
                        {c.isSuspended ? 'ปลดแบน' : 'ระงับการใช้งาน'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
>>>>>>> auth-system
      </div>
    </>
  );
}

const HOURLY_HEIGHTS = [30, 20, 35, 45, 70, 85, 100, 90, 75, 40, 30, 25];
const HOURLY_COLORS = (h) => (h >= 90 ? '#3D2B1F' : h >= 60 ? '#A0724A' : h >= 35 ? '#DDD0C4' : '#F2EBE2');

export function Analytics() {
  return (
    <>
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <div className="kpi-card revenue">
          <div className="kpi-label">รายได้รวมปีนี้</div>
          <div className="kpi-value">฿1.2M</div>
          <span className="kpi-badge up">+24% vs ปีที่แล้ว</span>
        </div>
        <div className="kpi-card orders">
          <div className="kpi-label">ออเดอร์ทั้งหมด</div>
          <div className="kpi-value">842</div>
          <span className="kpi-badge up">+18%</span>
        </div>
        <div className="kpi-card customers">
          <div className="kpi-label">Conversion Rate</div>
          <div className="kpi-value">3.2%</div>
          <span className="kpi-badge up">+0.5%</span>
        </div>
        <div className="kpi-card stock">
          <div className="kpi-label">ค่า Bounce Rate</div>
          <div className="kpi-value">42%</div>
          <span className="kpi-badge down">+3%</span>
        </div>
      </div>
      <div className="ana-grid">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>
            ยอดขายตามประเภทสินค้า
          </div>
          <div className="progress-row">
            <div className="progress-lbl">โต๊ะกินข้าว</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '65%' }}></div>
            </div>
            <div className="progress-val">65%</div>
          </div>
          <div className="progress-row">
            <div className="progress-lbl">โต๊ะคอม</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '25%', background: '#4A7C59' }}></div>
            </div>
            <div className="progress-val">25%</div>
          </div>
          <div className="progress-row">
            <div className="progress-lbl">โต๊ะตกแต่ง</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '10%', background: '#2C6FAC' }}></div>
            </div>
            <div className="progress-val">10%</div>
          </div>
          <div className="divider"></div>
          <div className="card-title" style={{ marginBottom: 16 }}>
            แหล่งที่มาของลูกค้า
          </div>
          <div className="progress-row">
            <div className="progress-lbl">Organic</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '45%', background: '#4A7C59' }}></div>
            </div>
            <div className="progress-val">45%</div>
          </div>
          <div className="progress-row">
            <div className="progress-lbl">Social Media</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '30%' }}></div>
            </div>
            <div className="progress-val">30%</div>
          </div>
          <div className="progress-row">
            <div className="progress-lbl">Direct</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '15%', background: '#C17B2A' }}></div>
            </div>
            <div className="progress-val">15%</div>
          </div>
          <div className="progress-row">
            <div className="progress-lbl">Referral</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '10%', background: '#2C6FAC' }}></div>
            </div>
            <div className="progress-val">10%</div>
          </div>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>
            สถานะออเดอร์
          </div>
          <div className="donut-wrap">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="40" fill="none" stroke="#F2EBE2" strokeWidth="18" />
              <circle
                cx="55"
                cy="55"
                r="40"
                fill="none"
                stroke="#4A7C59"
                strokeWidth="18"
                strokeDasharray="163 88"
                strokeDashoffset="-1"
                transform="rotate(-90 55 55)"
              />
              <circle
                cx="55"
                cy="55"
                r="40"
                fill="none"
                stroke="#A0724A"
                strokeWidth="18"
                strokeDasharray="63 188"
                strokeDashoffset="-163"
                transform="rotate(-90 55 55)"
              />
              <circle
                cx="55"
                cy="55"
                r="40"
                fill="none"
                stroke="#C17B2A"
                strokeWidth="18"
                strokeDasharray="18 233"
                strokeDashoffset="-226"
                transform="rotate(-90 55 55)"
              />
              <text x="55" y="51" textAnchor="middle" fontSize="16" fontWeight="600" fill="#2A1F14">
                842
              </text>
              <text x="55" y="64" textAnchor="middle" fontSize="10" fill="#7A6355">
                ออเดอร์
              </text>
            </svg>
            <div style={{ flex: 1 }}>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#4A7C59' }}></div>
                <div className="legend-lbl">สำเร็จ</div>
                <div className="legend-val">65%</div>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#A0724A' }}></div>
                <div className="legend-lbl">กำลังดำเนินการ</div>
                <div className="legend-val">25%</div>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#C17B2A' }}></div>
                <div className="legend-lbl">รอชำระ</div>
                <div className="legend-val">7%</div>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#B94040' }}></div>
                <div className="legend-lbl">ยกเลิก</div>
                <div className="legend-val">3%</div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="card-title" style={{ marginBottom: 14 }}>
            ช่วงเวลาขายดี (ชั่วโมง)
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
            {HOURLY_HEIGHTS.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: HOURLY_COLORS(h),
                  borderRadius: '3px 3px 0 0',
                  height: `${h}%`,
                }}
              ></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--tm)' }}>8:00</span>
            <span style={{ fontSize: 10, color: 'var(--tm)' }}>12:00</span>
            <span style={{ fontSize: 10, color: 'var(--tm)' }}>18:00</span>
            <span style={{ fontSize: 10, color: 'var(--tm)' }}>22:00</span>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">ยอดขายรายสัปดาห์ (7 วันล่าสุด)</div>
        </div>
        <table>
          <tbody>
            <tr>
              <th>วันที่</th>
              <th>ออเดอร์</th>
              <th>รายได้</th>
              <th>ลูกค้าใหม่</th>
              <th>เทียบวันก่อน</th>
            </tr>
            <tr>
              <td>จ. 30 มิ.ย.</td>
              <td>18</td>
              <td>฿54,200</td>
              <td>5</td>
              <td>
                <span className="kpi-badge up">+12%</span>
              </td>
            </tr>
            <tr>
              <td>อ. 1 ก.ค.</td>
              <td>22</td>
              <td>฿66,800</td>
              <td>8</td>
              <td>
                <span className="kpi-badge up">+23%</span>
              </td>
            </tr>
            <tr>
              <td>พ. 2 ก.ค.</td>
              <td>15</td>
              <td>฿42,800</td>
              <td>4</td>
              <td>
                <span className="kpi-badge down">-8%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
