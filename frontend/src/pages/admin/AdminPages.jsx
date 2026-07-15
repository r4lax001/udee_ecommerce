import React, { useEffect, useState } from 'react'
import { getDashboardStats, getUsers, updateUserStatus } from '../../services/admin'

export function PagePlaceholder({ icon, text }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 40 }}>
      <i className={`ti ${icon}`} style={{ fontSize: 40, color: 'var(--bd)' }} aria-hidden="true"></i>
      <div style={{ fontSize: 15, color: 'var(--tm)', marginTop: 12 }}>{text}</div>
    </div>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลแดชบอร์ดได้')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>กำลังโหลดข้อมูลแดชบอร์ด...</div>
  }

  if (error) {
    return <div className="card" style={{ textAlign: 'center', padding: 40, color: '#B94040' }}>{error}</div>
  }

  const kpi = stats?.kpi || {}
  const monthlySales = stats?.monthlySales || []
  const recentOrders = stats?.recentOrders || []
  const topProducts = stats?.topProducts || []
  const notifications = stats?.notifications || []

  return (
    <div className="space-y-4">
      <div className="kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-label">รายได้วันนี้</div>
          <div className="kpi-value">{(kpi.revenueToday || 0).toLocaleString('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 })}</div>
          <span className="kpi-badge up">{kpi.revenueChange || '0%'}</span>
        </div>
        <div className="kpi-card orders">
          <div className="kpi-label">ยอดออเดอร์วันนี้</div>
          <div className="kpi-value">{kpi.ordersToday || 0}</div>
          <span className="kpi-badge up">{kpi.ordersChange || '0%'}</span>
        </div>
        <div className="kpi-card customers">
          <div className="kpi-label">ลูกค้าใหม่วันนี้</div>
          <div className="kpi-value">{kpi.newCustomers || 0}</div>
          <span className="kpi-badge up">{kpi.customersChange || '0%'}</span>
        </div>
        <div className="kpi-card stock">
          <div className="kpi-label">สินค้าคงเหลือรวม</div>
          <div className="kpi-value">{kpi.totalStock || 0}</div>
          <span className="kpi-badge down">สินค้าทั้งหมดในคลัง</span>
        </div>
      </div>

      <div className="row2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">ยอดขายรายเดือน</div>
              <div className="card-sub">อัปเดตจากข้อมูลคำสั่งซื้อจริง</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, marginTop: 12 }}>
            {monthlySales.map((value, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', height: 140, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: 28, height: `${Math.max(12, (value / Math.max(...monthlySales, 1)) * 100)}%`, background: '#A0724A', borderRadius: '8px 8px 0 0' }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--tm)' }}>{['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div className="card-head">
              <div className="card-title">การแจ้งเตือน</div>
            </div>
            {notifications.length === 0 ? (
              <div style={{ color: 'var(--tm)', paddingTop: 8 }}>ไม่มีการแจ้งเตือนในตอนนี้</div>
            ) : (
              notifications.map((item, index) => (
                <div key={index} className="notif" style={{ background: item.urgent ? '#FCEBEB' : undefined }}>
                  <i className={`ti ti-${item.icon}`} aria-hidden="true"></i>
                  <div>
                    <div className="notif-title">{item.title}</div>
                    <div className="notif-time">{item.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">สินค้าขายดี</div>
            </div>
            {topProducts.length === 0 ? (
              <div style={{ color: 'var(--tm)', paddingTop: 8 }}>ยังไม่มีข้อมูลยอดขาย</div>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="top5-row">
                  <div className="top5-rank">{index + 1}</div>
                  <div className="top5-img">
                    {product.image ? <img src={product.image} alt={product.name} style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 8 }} /> : <i className="ti ti-box" style={{ color: 'var(--ac)' }} aria-hidden="true"></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="top5-name">{product.name}</div>
                    <div className="top5-sales">ขาย {product.sales} ชิ้น</div>
                  </div>
                  <div className="top5-val">{product.revenue}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">ออเดอร์ล่าสุด</div>
        </div>
        <table>
          <tbody>
            <tr>
              <th>ORDER ID</th>
              <th>ลูกค้า</th>
              <th>ยอด</th>
              <th>สถานะ</th>
              <th>วันที่</th>
            </tr>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 500 }}>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.amount}</td>
                <td><span className="badge done">{order.status}</span></td>
                <td style={{ color: 'var(--tm)' }}>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Customers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      if (data.success) {
        setUsers(data.users || [])
      } else {
        setError(data.message || 'ไม่สามารถดึงข้อมูลสมาชิกได้')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleVerify = async (userId, currentVerified) => {
    try {
      const data = await updateUserStatus(userId, { isVerified: !currentVerified })
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isVerified: !currentVerified } : u)))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')
    }
  }

  const handleToggleSuspend = async (userId, currentSuspended) => {
    if (!window.confirm(currentSuspended ? 'ต้องการยกเลิกการระงับบัญชีนี้?' : 'ต้องการระงับการใช้งานบัญชีนี้?')) return
    try {
      const data = await updateUserStatus(userId, { isSuspended: !currentSuspended })
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isSuspended: !currentSuspended } : u)))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการปรับสถานะบัญชี')
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || (user.phone || '').includes(searchTerm)
    if (!matchesSearch) return false
    if (activeFilter === 'verified') return user.isVerified
    if (activeFilter === 'unverified') return !user.isVerified
    if (activeFilter === 'suspended') return user.isSuspended
    return true
  })

  const countFilter = (filterType) => users.filter((user) => {
    if (filterType === 'verified') return user.isVerified
    if (filterType === 'unverified') return !user.isVerified
    if (filterType === 'suspended') return user.isSuspended
    return true
  }).length

  return (
    <div className="space-y-4">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-num">{users.length}</div>
          <div className="stat-lbl">สมาชิกทั้งหมด</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#4A7C59' }}>{countFilter('verified')}</div>
          <div className="stat-lbl">ยืนยันอีเมลแล้ว</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#B94040' }}>{countFilter('suspended')}</div>
          <div className="stat-lbl">บัญชีที่ถูกระงับ</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">การจัดการผู้ใช้งานในระบบ</div>
          <button className="btn-save" onClick={fetchUsers}>รีเฟรชข้อมูล</button>
        </div>
        <div className="search-bar">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input placeholder="ค้นหาด้วยชื่อ, อีเมล หรือเบอร์โทรศัพท์..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-bar">
          <span className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>ทั้งหมด ({users.length})</span>
          <span className={`filter-chip ${activeFilter === 'verified' ? 'active' : ''}`} onClick={() => setActiveFilter('verified')}>ยืนยันอีเมลแล้ว ({countFilter('verified')})</span>
          <span className={`filter-chip ${activeFilter === 'unverified' ? 'active' : ''}`} onClick={() => setActiveFilter('unverified')}>ยังไม่ยืนยันอีเมล ({countFilter('unverified')})</span>
          <span className={`filter-chip ${activeFilter === 'suspended' ? 'active' : ''}`} onClick={() => setActiveFilter('suspended')}>บัญชีที่ถูกระงับ ({countFilter('suspended')})</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>กำลังโหลดข้อมูลสมาชิก...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#B94040' }}>{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>ไม่พบข้อมูลผู้ใช้งานที่ตรงตามเงื่อนไข</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ padding: 10 }}>ลูกค้า</th>
                <th style={{ padding: 10 }}>อีเมล</th>
                <th style={{ padding: 10 }}>สิทธิ์</th>
                <th style={{ padding: 10, textAlign: 'center' }}>ยืนยันเมล</th>
                <th style={{ padding: 10, textAlign: 'center' }}>สถานะบัญชี</th>
                <th style={{ padding: 10, textAlign: 'center' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ background: '#F2EBE2', color: '#3D2B1F' }}>{c.name ? c.name.charAt(0).toUpperCase() : 'U'}</div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tm)' }}>{c.phone || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 10, color: 'var(--tm)', fontSize: 12 }}>{c.email}</td>
                  <td style={{ padding: 10 }}><span className={`tag ${c.role === 'ADMIN' ? 'vip' : 'reg'}`}>{c.role}</span></td>
                  <td style={{ padding: 10, textAlign: 'center' }}><span className={`badge ${c.isVerified ? 'done' : 'pending'}`}>{c.isVerified ? 'Verified' : 'Unverified'}</span></td>
                  <td style={{ padding: 10, textAlign: 'center' }}><span className={`badge ${c.isSuspended ? 'cancel' : 'done'}`}>{c.isSuspended ? 'Suspended' : 'Active'}</span></td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => handleToggleVerify(c.id, c.isVerified)} style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid var(--bd)', background: 'white', cursor: 'pointer', color: 'var(--tx)' }}>{c.isVerified ? 'ยกเลิกยืนยัน' : 'ยืนยัน'}</button>
                      <button onClick={() => handleToggleSuspend(c.id, c.isSuspended)} style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid ' + (c.isSuspended ? '#4A7C59' : '#B94040'), background: 'white', color: c.isSuspended ? '#4A7C59' : '#B94040', cursor: 'pointer' }}>{c.isSuspended ? 'ปลดแบน' : 'ระงับการใช้งาน'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function Analytics() {
  return (
    <>
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <div className="kpi-card revenue">
          <div className="kpi-label">รายได้รวมปีนี้</div>
          <div className="kpi-value">฿1.2M</div>
          <span className="kpi-badge up">+24%</span>
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
      </div>

      <div className="ana-grid">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>ยอดขายตามประเภทสินค้า</div>
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
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>สถานะออเดอร์</div>
          <div className="donut-wrap">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="40" fill="none" stroke="#F2EBE2" strokeWidth="18" />
              <circle cx="55" cy="55" r="40" fill="none" stroke="#4A7C59" strokeWidth="18" strokeDasharray="163 88" strokeDashoffset="-1" transform="rotate(-90 55 55)" />
              <circle cx="55" cy="55" r="40" fill="none" stroke="#A0724A" strokeWidth="18" strokeDasharray="63 188" strokeDashoffset="-163" transform="rotate(-90 55 55)" />
              <circle cx="55" cy="55" r="40" fill="none" stroke="#C17B2A" strokeWidth="18" strokeDasharray="18 233" strokeDashoffset="-226" transform="rotate(-90 55 55)" />
              <text x="55" y="51" textAnchor="middle" fontSize="16" fontWeight="600" fill="#2A1F14">842</text>
              <text x="55" y="64" textAnchor="middle" fontSize="10" fill="#7A6355">ออเดอร์</text>
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
              <td><span className="kpi-badge up">+12%</span></td>
            </tr>
            <tr>
              <td>อ. 1 ก.ค.</td>
              <td>22</td>
              <td>฿66,800</td>
              <td>8</td>
              <td><span className="kpi-badge up">+23%</span></td>
            </tr>
            <tr>
              <td>พ. 2 ก.ค.</td>
              <td>15</td>
              <td>฿42,800</td>
              <td>4</td>
              <td><span className="kpi-badge down">-8%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default { PagePlaceholder, Dashboard, Customers, Analytics }