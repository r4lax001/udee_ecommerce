import { useEffect, useState } from 'react'
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAnalyticsData,
  getAdminProducts,
  getAdminOrders,
  updateOrderStatus,
} from '../../services/admin'

// ─── Shared Loading / Error ─────────────────────────────────────────────────
function LoadingCard({ text = 'กำลังโหลดข้อมูล...' }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>
      {text}
    </div>
  )
}
function ErrorCard({ text }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 40, color: '#B94040' }}>
      {text}
    </div>
  )
}

// ─── PagePlaceholder ─────────────────────────────────────────────────────────
export function PagePlaceholder({ icon, text }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 40 }}>
      <i className={`ti ${icon}`} style={{ fontSize: 40, color: 'var(--bd)' }} aria-hidden="true" />
      <div style={{ fontSize: 15, color: 'var(--tm)', marginTop: 12 }}>{text}</div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
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

  if (loading) return <LoadingCard text="กำลังโหลดข้อมูลแดชบอร์ด..." />
  if (error) return <ErrorCard text={error} />

  const kpi = stats?.kpi || {}
  const monthlySales = stats?.monthlySales || []
  const recentOrders = stats?.recentOrders || []
  const topProducts = stats?.topProducts || []
  const notifications = stats?.notifications || []

  const STATUS_BADGE = {
    Completed: 'done',
    Shipped: 'process',
    Pending: 'pending',
    'Waiting for Payment': 'pending',
    Cancelled: 'cancel',
    Paid: 'done',
  }

  return (
    <div className="space-y-4">
      <div className="kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-label">รายได้วันนี้</div>
          <div className="kpi-value">
            {(kpi.revenueToday || 0).toLocaleString('th-TH', {
              style: 'currency',
              currency: 'THB',
              maximumFractionDigits: 0,
            })}
          </div>
          <span className={`kpi-badge ${(kpi.revenueChange || '').startsWith('-') ? 'down' : 'up'}`}>
            {kpi.revenueChange || '0%'} vs เมื่อวาน
          </span>
        </div>
        <div className="kpi-card orders">
          <div className="kpi-label">ยอดออเดอร์วันนี้</div>
          <div className="kpi-value">{kpi.ordersToday || 0}</div>
          <span className={`kpi-badge ${(kpi.ordersChange || '').startsWith('-') ? 'down' : 'up'}`}>
            {kpi.ordersChange || '0%'} vs เมื่อวาน
          </span>
        </div>
        <div className="kpi-card customers">
          <div className="kpi-label">ลูกค้าใหม่วันนี้</div>
          <div className="kpi-value">{kpi.newCustomers || 0}</div>
          <span className={`kpi-badge ${(kpi.customersChange || '').startsWith('-') ? 'down' : 'up'}`}>
            {kpi.customersChange || '0%'} vs เมื่อวาน
          </span>
        </div>
        <div className="kpi-card stock">
          <div className="kpi-label">สินค้าคงเหลือรวม</div>
          <div className="kpi-value">{(kpi.totalStock || 0).toLocaleString()}</div>
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
            {monthlySales.map((value, index) => {
              const maxVal = Math.max(...monthlySales, 1)
              const heightPct = Math.max(6, (value / maxVal) * 100)
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: '100%', height: 140, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 28,
                        height: `${heightPct}%`,
                        background: value > 0 ? '#A0724A' : '#DDD0C4',
                        borderRadius: '8px 8px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                      title={`฿${value.toLocaleString('th-TH')}`}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--tm)' }}>
                    {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][index]}
                  </span>
                </div>
              )
            })}
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
                  <i className="ti ti-bell" aria-hidden="true" />
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
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <i className="ti ti-box" style={{ color: 'var(--ac)' }} aria-hidden="true" />
                    )}
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
        {recentOrders.length === 0 ? (
          <div style={{ color: 'var(--tm)', padding: 16 }}>ยังไม่มีออเดอร์</div>
        ) : (
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
                  <td>
                    <span className={`badge ${STATUS_BADGE[order.status] || 'pending'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--tm)' }}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Customers ───────────────────────────────────────────────────────────────
export function Customers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
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

  useEffect(() => { fetchUsers() }, [])

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
    const matchesSearch =
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm)
    if (!matchesSearch) return false
    if (activeFilter === 'verified') return user.isVerified
    if (activeFilter === 'unverified') return !user.isVerified
    if (activeFilter === 'suspended') return user.isSuspended
    return true
  })

  const countFilter = (filterType) =>
    users.filter((user) => {
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
          <i className="ti ti-search" aria-hidden="true" />
          <input
            placeholder="ค้นหาด้วยชื่อ, อีเมล หรือเบอร์โทรศัพท์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                      <div className="avatar" style={{ background: '#F2EBE2', color: '#3D2B1F' }}>
                        {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tm)' }}>{c.phone || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 10, color: 'var(--tm)', fontSize: 12 }}>{c.email}</td>
                  <td style={{ padding: 10 }}><span className={`tag ${c.role === 'ADMIN' ? 'vip' : 'reg'}`}>{c.role}</span></td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <span className={`badge ${c.isVerified ? 'done' : 'pending'}`}>{c.isVerified ? 'Verified' : 'Unverified'}</span>
                  </td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <span className={`badge ${c.isSuspended ? 'cancel' : 'done'}`}>{c.isSuspended ? 'Suspended' : 'Active'}</span>
                  </td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button
                        onClick={() => handleToggleVerify(c.id, c.isVerified)}
                        style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid var(--bd)', background: 'white', cursor: 'pointer', color: 'var(--tx)' }}
                      >
                        {c.isVerified ? 'ยกเลิกยืนยัน' : 'ยืนยัน'}
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(c.id, c.isSuspended)}
                        style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px', border: `1px solid ${c.isSuspended ? '#4A7C59' : '#B94040'}`, background: 'white', color: c.isSuspended ? '#4A7C59' : '#B94040', cursor: 'pointer' }}
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
      </div>
    </div>
  )
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const result = await getAnalyticsData()
        setData(result)
      } catch (err) {
        setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูล Analytics ได้')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return <LoadingCard text="กำลังโหลดข้อมูล Analytics..." />
  if (error) return <ErrorCard text={error} />

  const sales = data?.sales || {}
  const ordersReport = data?.orders || {}
  const productsReport = data?.products || {}

  const totalRevenue = sales.totalRevenue || 0
  const totalOrders = sales.totalOrders || 0
  const avgOrderValue = sales.avgOrderValue || 0

  // Status breakdown for donut chart
  const statusBreakdown = ordersReport.statusBreakdown || []
  const totalOrdersAll = statusBreakdown.reduce((sum, s) => sum + (s._count || 0), 0) || 1
  const statusColors = {
    DELIVERED: '#4A7C59',
    CONFIRMED: '#2C6FAC',
    SHIPPED: '#A0724A',
    PENDING: '#C17B2A',
    CANCELLED: '#B94040',
  }
  const statusLabels = {
    DELIVERED: 'สำเร็จ',
    CONFIRMED: 'ยืนยันแล้ว',
    SHIPPED: 'จัดส่งแล้ว',
    PENDING: 'รอดำเนินการ',
    CANCELLED: 'ยกเลิก',
  }

  // Category breakdown from products report
  const topProducts = productsReport.topProducts || []
  const categoryMap = {}
  topProducts.forEach((p) => {
    if (!categoryMap[p.category]) categoryMap[p.category] = 0
    categoryMap[p.category] += p.totalSold
  })
  const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxCatVal = Math.max(...categoryEntries.map((c) => c[1]), 1)
  const catColors = ['#A0724A', '#4A7C59', '#2C6FAC', '#C17B2A', '#B94040']

  // Donut chart segments
  let donutOffset = 0
  const circumference = 2 * Math.PI * 40 // r=40
  const donutSegments = statusBreakdown.map((s) => {
    const pct = (s._count || 0) / totalOrdersAll
    const dashArray = `${(pct * circumference).toFixed(1)} ${((1 - pct) * circumference).toFixed(1)}`
    const dashOffset = -(donutOffset * circumference)
    donutOffset += pct
    return { ...s, dashArray, dashOffset, pct, color: statusColors[s.status] || '#DDD0C4' }
  })

  return (
    <>
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <div className="kpi-card revenue">
          <div className="kpi-label">รายได้รวมปีนี้</div>
          <div className="kpi-value">
            {totalRevenue.toLocaleString('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 })}
          </div>
          <span className="kpi-badge up">ข้อมูลจริงจาก DB</span>
        </div>
        <div className="kpi-card orders">
          <div className="kpi-label">ออเดอร์ทั้งหมด (ปีนี้)</div>
          <div className="kpi-value">{totalOrders.toLocaleString()}</div>
          <span className="kpi-badge up">ข้อมูลจริงจาก DB</span>
        </div>
        <div className="kpi-card customers">
          <div className="kpi-label">มูลค่าเฉลี่ยต่อออเดอร์</div>
          <div className="kpi-value">
            {avgOrderValue.toLocaleString('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 })}
          </div>
          <span className="kpi-badge up">ข้อมูลจริงจาก DB</span>
        </div>
      </div>

      <div className="ana-grid">
        {/* Category breakdown */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>ยอดขายตามประเภทสินค้า</div>
          {categoryEntries.length === 0 ? (
            <div style={{ color: 'var(--tm)', fontSize: 13 }}>ยังไม่มีข้อมูลยอดขาย</div>
          ) : (
            categoryEntries.map(([cat, sold], i) => {
              const pct = Math.round((sold / maxCatVal) * 100)
              return (
                <div key={cat} className="progress-row">
                  <div className="progress-lbl">{cat}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: catColors[i] }} />
                  </div>
                  <div className="progress-val">{sold} ชิ้น</div>
                </div>
              )
            })
          )}
        </div>

        {/* Order status donut */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>สถานะออเดอร์</div>
          {statusBreakdown.length === 0 ? (
            <div style={{ color: 'var(--tm)', fontSize: 13 }}>ยังไม่มีข้อมูลออเดอร์</div>
          ) : (
            <div className="donut-wrap">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="40" fill="none" stroke="#F2EBE2" strokeWidth="18" />
                {donutSegments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="55" cy="55" r="40"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    transform="rotate(-90 55 55)"
                  />
                ))}
                <text x="55" y="51" textAnchor="middle" fontSize="16" fontWeight="600" fill="#2A1F14">
                  {ordersReport.totalOrders || 0}
                </text>
                <text x="55" y="64" textAnchor="middle" fontSize="10" fill="#7A6355">ออเดอร์</text>
              </svg>
              <div style={{ flex: 1 }}>
                {statusBreakdown.map((s) => (
                  <div key={s.status} className="legend-item">
                    <div className="legend-dot" style={{ background: statusColors[s.status] || '#DDD0C4' }} />
                    <div className="legend-lbl">{statusLabels[s.status] || s.status}</div>
                    <div className="legend-val">{Math.round(((s._count || 0) / totalOrdersAll) * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">สินค้าขายดีสูงสุด (Top 10)</div>
        </div>
        {topProducts.length === 0 ? (
          <div style={{ color: 'var(--tm)', padding: 16 }}>ยังไม่มีข้อมูลยอดขาย</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>สินค้า</th>
                <th>หมวดหมู่</th>
                <th>ราคา</th>
                <th>ยอดขาย (ชิ้น)</th>
                <th>รายได้รวม</th>
                <th>Stock คงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--tm)', fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="tag reg">{p.category}</span></td>
                  <td>{Number(p.price).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: '#A0724A' }}>{p.totalSold}</td>
                  <td style={{ fontWeight: 500 }}>
                    {Number(p.revenue).toLocaleString('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${p.stock === 0 ? 'cancel' : p.stock <= 5 ? 'pending' : 'done'}`}>
                      {p.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

// ─── Products (Admin) ─────────────────────────────────────────────────────────
export function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getAdminProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลสินค้าได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = products.filter((p) =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  return (
    <div className="space-y-4">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-num">{products.length}</div>
          <div className="stat-lbl">สินค้าทั้งหมด</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#C17B2A' }}>{lowStock}</div>
          <div className="stat-lbl">ใกล้หมด (≤5 ชิ้น)</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#B94040' }}>{outOfStock}</div>
          <div className="stat-lbl">หมดสต็อก</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">รายการสินค้าทั้งหมด</div>
          <button className="btn-save" onClick={fetchProducts}>รีเฟรชข้อมูล</button>
        </div>
        <div className="search-bar">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            placeholder="ค้นหาด้วยชื่อสินค้า หรือหมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>กำลังโหลดข้อมูลสินค้า...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#B94040' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>ไม่พบสินค้าที่ตรงตามเงื่อนไข</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>สินค้า</th>
                <th>หมวดหมู่</th>
                <th style={{ textAlign: 'right' }}>ราคา</th>
                <th style={{ textAlign: 'center' }}>Stock</th>
                <th style={{ textAlign: 'center' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const img = p.images?.[0]?.imageUrl
                return (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--tm)', fontSize: 12 }}>#{p.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 8, overflow: 'hidden',
                          background: 'var(--sa)', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {img ? (
                            <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <i className="ti ti-box" style={{ color: 'var(--ac)', fontSize: 18 }} aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--tm)', marginTop: 2 }}>
                            {p.description ? p.description.slice(0, 40) + (p.description.length > 40 ? '...' : '') : '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="tag reg">{p.category?.name || '-'}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>
                      {Number(p.price).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.stock}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${p.stock === 0 ? 'cancel' : p.stock <= 5 ? 'pending' : 'done'}`}>
                        {p.stock === 0 ? 'หมดสต็อก' : p.stock <= 5 ? 'ใกล้หมด' : 'ปกติ'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <div style={{ padding: '10px 0 0', fontSize: 12, color: 'var(--tm)' }}>
          แสดง {filtered.length} จาก {products.length} รายการ | Stock รวม: {totalStock.toLocaleString()} ชิ้น
        </div>
      </div>
    </div>
  )
}

// ─── Orders (Admin) ───────────────────────────────────────────────────────────
const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_LABEL = {
  PENDING: 'รอดำเนินการ',
  CONFIRMED: 'ยืนยันแล้ว',
  SHIPPED: 'จัดส่งแล้ว',
  DELIVERED: 'สำเร็จ',
  CANCELLED: 'ยกเลิก',
}
const STATUS_BADGE_MAP = {
  PENDING: 'pending',
  CONFIRMED: 'process',
  SHIPPED: 'process',
  DELIVERED: 'done',
  CANCELLED: 'cancel',
}

export function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [updating, setUpdating] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getAdminOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลออเดอร์ได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`เปลี่ยนสถานะออเดอร์ #${orderId} เป็น "${STATUS_LABEL[newStatus]}"?`)) return
    try {
      setUpdating(orderId)
      await updateOrderStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filterStatus === 'ALL' ? orders : orders.filter((o) => o.status === filterStatus)

  const countByStatus = (s) => orders.filter((o) => o.status === s).length

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total), 0)

  return (
    <div className="space-y-4">
      <div className="kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-label">รายได้รวม (ไม่รวมยกเลิก)</div>
          <div className="kpi-value" style={{ fontSize: 18 }}>
            {totalRevenue.toLocaleString('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="kpi-card orders">
          <div className="kpi-label">ออเดอร์ทั้งหมด</div>
          <div className="kpi-value">{orders.length}</div>
        </div>
        <div className="kpi-card customers">
          <div className="kpi-label">รอดำเนินการ</div>
          <div className="kpi-value" style={{ color: '#C17B2A' }}>{countByStatus('PENDING')}</div>
        </div>
        <div className="kpi-card stock">
          <div className="kpi-label">สำเร็จแล้ว</div>
          <div className="kpi-value" style={{ color: '#4A7C59' }}>{countByStatus('DELIVERED')}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">จัดการออเดอร์</div>
          <button className="btn-save" onClick={fetchOrders}>รีเฟรชข้อมูล</button>
        </div>

        {/* Status filter */}
        <div className="filter-bar">
          <span className={`filter-chip ${filterStatus === 'ALL' ? 'active' : ''}`} onClick={() => setFilterStatus('ALL')}>
            ทั้งหมด ({orders.length})
          </span>
          {ORDER_STATUSES.map((s) => (
            <span
              key={s}
              className={`filter-chip ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {STATUS_LABEL[s]} ({countByStatus(s)})
            </span>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>กำลังโหลดข้อมูลออเดอร์...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#B94040' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--tm)' }}>ไม่พบออเดอร์ที่ตรงตามเงื่อนไข</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>ลูกค้า</th>
                <th>สินค้า</th>
                <th style={{ textAlign: 'right' }}>ยอดรวม</th>
                <th style={{ textAlign: 'center' }}>สถานะปัจจุบัน</th>
                <th>วันที่สั่ง</th>
                <th style={{ textAlign: 'center' }}>เปลี่ยนสถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} style={{ opacity: updating === o.id ? 0.6 : 1 }}>
                  <td style={{ fontWeight: 600, color: 'var(--ac)' }}>
                    ORD-{String(o.id).padStart(3, '0')}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{o.user?.name || '-'}</div>
                    <div style={{ fontSize: 11, color: 'var(--tm)' }}>{o.user?.email || ''}</div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--tm)' }}>
                    {o.items?.slice(0, 2).map((item) => item.product?.name).filter(Boolean).join(', ')}
                    {o.items?.length > 2 ? ` +${o.items.length - 2} รายการ` : ''}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>
                    {Number(o.total).toLocaleString('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${STATUS_BADGE_MAP[o.status] || 'pending'}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--tm)', fontSize: 12 }}>
                    {new Date(o.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <select
                      value={o.status}
                      disabled={updating === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      style={{
                        padding: '4px 8px', fontSize: '11px', borderRadius: '6px',
                        border: '1px solid var(--bd)', background: 'white', cursor: 'pointer',
                        color: 'var(--tx)', outline: 'none',
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ padding: '10px 0 0', fontSize: 12, color: 'var(--tm)' }}>
          แสดง {filtered.length} จาก {orders.length} ออเดอร์
        </div>
      </div>
    </div>
  )
}

export default { PagePlaceholder, Dashboard, Customers, Analytics, Products, Orders }
