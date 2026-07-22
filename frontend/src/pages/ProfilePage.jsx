import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts'
import * as authService from '../services/auth'
import * as addressService from '../services/address'
import * as ordersService from '../services/orders'

// ─── Helper ────────────────────────────────────────────────────────────────────

const isValidThaiPhone = (phone) => /^0[0-9]{9}$/.test(phone.trim())
const isValidPostalCode = (code) => /^\d{5}$/.test(code.trim())

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatAddress = (addr) => {
  if (!addr) return '-'
  const parts = [
    addr.houseNo,
    addr.soi ? `ซ.${addr.soi}` : '',
    addr.road ? `ถ.${addr.road}` : '',
    addr.subDistrict ? `แขวง${addr.subDistrict}` : '',
    addr.district ? `เขต${addr.district}` : '',
    addr.province,
    addr.postalCode,
  ].filter(Boolean)
  return parts.join(' ')
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ message, type = 'success', onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className={`fixed top-6 right-6 z-[100] flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium max-w-sm border ${
      type === 'success'
        ? 'bg-white text-[#111111] border-[#EAEAEA]'
        : 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]'
    }`}
  >
    <span className="material-symbols-outlined text-lg" style={{ color: type === 'success' ? '#10B981' : '#EF4444' }}>
      {type === 'success' ? 'check_circle' : 'error'}
    </span>
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="ml-2 text-[#888888] hover:text-[#111111] transition-colors focus-visible:outline-none">
      <span className="material-symbols-outlined text-base">close</span>
    </button>
  </motion.div>
)

// ─── Edit Profile Modal ─────────────────────────────────────────────────────────

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!name.trim()) { setError('กรุณากรอกชื่อ-นามสกุล'); return }
    if (name.trim().length < 2) { setError('ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร'); return }
    if (phone && !isValidThaiPhone(phone)) { setError('รูปแบบเบอร์โทรไม่ถูกต้อง (กรุณากรอก 10 หลัก เช่น 0812345678)'); return }

    setLoading(true)
    try {
      const data = await authService.updateProfile({ name: name.trim(), phone: phone.trim() })
      if (data.success) {
        onSave(data.user)
        onClose()
      } else {
        setError(data.message || 'ไม่สามารถบันทึกข้อมูลได้')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-xl border border-[#EAEAEA] p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#111111]">แก้ไขข้อมูลส่วนตัว</h3>
          <button onClick={onClose} className="text-[#888888] hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] px-4 py-3 text-sm text-[#991B1B]">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#666666] uppercase tracking-wide">ชื่อ-นามสกุล</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อ-นามสกุล"
              className="w-full rounded-lg border border-[#EAEAEA] bg-white px-3 py-2 text-sm text-[#111111] outline-none transition-all focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#666666] uppercase tracking-wide">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08x-xxx-xxxx"
              className="w-full rounded-lg border border-[#EAEAEA] bg-white px-3 py-2 text-sm text-[#111111] outline-none transition-all focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#666666] hover:bg-[#F9F9F9] hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-[#111111] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Edit Address Modal ─────────────────────────────────────────────────────────

const EditAddressModal = ({ address, onClose, onSave }) => {
  const [houseNo, setHouseNo] = useState(address?.houseNo || '')
  const [soi, setSoi] = useState(address?.soi || '')
  const [road, setRoad] = useState(address?.road || '')
  const [subDistrict, setSubDistrict] = useState(address?.subDistrict || '')
  const [district, setDistrict] = useState(address?.district || '')
  const [province, setProvince] = useState(address?.province || '')
  const [postalCode, setPostalCode] = useState(address?.postalCode || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!houseNo.trim() || !subDistrict.trim() || !district.trim() || !province.trim() || !postalCode.trim()) {
      setError('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน'); return
    }
    if (!isValidPostalCode(postalCode)) {
      setError('รูปแบบรหัสไปรษณีย์ไม่ถูกต้อง (กรุณากรอก 5 หลัก)'); return
    }

    setLoading(true)
    try {
      const payload = { houseNo: houseNo.trim(), soi: soi.trim(), road: road.trim(), subDistrict: subDistrict.trim(), district: district.trim(), province: province.trim(), postalCode: postalCode.trim() }
      let data
      if (address?.id) {
        data = await addressService.updateAddress(address.id, payload)
      } else {
        data = await addressService.createMyAddress(payload)
      }
      if (data.success) {
        onSave(data.address)
        onClose()
      } else {
        setError(data.error || 'ไม่สามารถบันทึกที่อยู่ได้')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-[#EAEAEA] bg-white px-3 py-2 text-sm text-[#111111] outline-none transition-all focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
  const labelClass = "mb-1.5 block text-xs font-semibold text-[#666666] uppercase tracking-wide"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4 py-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-xl border border-[#EAEAEA] p-6 w-full max-w-lg max-h-full overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#111111]">{address?.id ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}</h3>
          <button onClick={onClose} className="text-[#888888] hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] px-4 py-3 text-sm text-[#991B1B]">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className={labelClass}>บ้านเลขที่/อาคาร/ชั้น *</label>
            <input type="text" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} placeholder="เช่น 123/45 อาคาร A ชั้น 5" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ซอย</label>
              <input type="text" value={soi} onChange={(e) => setSoi(e.target.value)} placeholder="ซอย (ถ้ามี)" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>ถนน</label>
              <input type="text" value={road} onChange={(e) => setRoad(e.target.value)} placeholder="ถนน (ถ้ามี)" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>แขวง/ตำบล *</label>
              <input type="text" value={subDistrict} onChange={(e) => setSubDistrict(e.target.value)} placeholder="แขวง/ตำบล" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>เขต/อำเภอ *</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="เขต/อำเภอ" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>จังหวัด *</label>
              <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} placeholder="จังหวัด" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>รหัสไปรษณีย์ *</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="10101"
              maxLength={5}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#666666] hover:bg-[#F9F9F9] hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]">
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-[#111111] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#333333] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Order Status Badge ─────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    PENDING:    { label: 'รอดำเนินการ',   cls: 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB]' },
    CONFIRMED:  { label: 'ยืนยันแล้ว',     cls: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' },
    PROCESSING: { label: 'กำลังเตรียม',    cls: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]' },
    SHIPPED:    { label: 'จัดส่งแล้ว',     cls: 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]' },
    DELIVERED:  { label: 'ส่งถึงแล้ว',     cls: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]' },
    CANCELLED:  { label: 'ยกเลิก',         cls: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]' },
  }
  const s = map[status] || { label: status, cls: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]' }
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border ${s.cls}`}>
      {s.label}
    </span>
  )
}

// ─── Main ProfilePage ───────────────────────────────────────────────────────────

const ProfilePage = () => {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user: authUser, isAuthenticated, updateUser } = useAuth()

  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [toast, setToast] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    setLoadingAddresses(true)
    addressService.getMyAddresses()
      .then((data) => { if (data.success) setAddresses(data.addresses) })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false))
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    setLoadingOrders(true)
    ordersService.getMyOrders()
      .then((data) => { if (data.success) setOrders(data.orders) })
      .catch(() => {})
      .finally(() => setLoadingOrders(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-6 text-[#111111]">
        <span className="material-symbols-outlined text-4xl text-[#CCCCCC] mb-4">lock</span>
        <h2 className="text-xl font-semibold text-[#111111] mb-2 tracking-tight">Access Restricted</h2>
        <p className="text-sm text-[#666666] mb-6 text-center max-w-sm">
          Please sign in to access your profile, order history, and saved addresses.
        </p>
        <Link to="/login" className="rounded-lg bg-[#111111] px-6 py-2.5 font-medium text-white text-sm hover:bg-[#333333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]">
          Sign In
        </Link>
      </div>
    )
  }

  const user = authUser

  const handleProfileSaved = (updatedUser) => {
    updateUser(updatedUser)
    showToast('อัปเดตข้อมูลส่วนตัวสำเร็จ!')
  }

  const handleAddressSaved = (savedAddr) => {
    setAddresses((prev) => {
      const idx = prev.findIndex((a) => a.id === savedAddr.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = savedAddr
        return updated
      }
      return [...prev, savedAddr]
    })
    showToast(editingAddress?.id ? 'อัปเดตที่อยู่สำเร็จ!' : 'เพิ่มที่อยู่ใหม่สำเร็จ!')
  }

  const tabs = [
    { id: 'dashboard', label: 'ภาพรวมบัญชี', icon: 'dashboard' },
    { id: 'profile',   label: 'ข้อมูลส่วนตัว', icon: 'person' },
    { id: 'address',   label: 'ที่อยู่จัดส่ง',  icon: 'location_on' },
    { id: 'orders',    label: 'ประวัติการสั่งซื้อ', icon: 'receipt_long' },
    { id: 'settings',  label: 'การตั้งค่า',    icon: 'settings' },
  ]

  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0)

  const stats = [
    { label: 'ออเดอร์ทั้งหมด', value: orders.length.toString(), icon: 'shopping_bag' },
    { label: 'ส่งถึงแล้ว',    value: deliveredCount.toString(), icon: 'local_shipping' },
    { label: 'ที่อยู่จัดส่ง',  value: addresses.length.toString(), icon: 'home' },
    { label: 'ยอดรวมทั้งหมด', value: `฿${totalSpent.toLocaleString()}`, icon: 'payments' },
  ]

  return (
    <motion.main
      className="min-h-screen bg-[#F9F9F9] text-[#111111] pb-16"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showEditProfile && (
          <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} onSave={handleProfileSaved} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddressModal && (
          <EditAddressModal address={editingAddress} onClose={() => { setShowAddressModal(false); setEditingAddress(null) }} onSave={handleAddressSaved} />
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="bg-white border-b border-[#EAEAEA] pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-[#F0F0F0] border border-[#EAEAEA] flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-3xl text-[#888888]">person</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">{user?.name || '-'}</h1>
            <p className="text-sm text-[#666666] mt-1">{user?.email || '-'}</p>
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-2 rounded-lg border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-medium text-[#111111] hover:bg-[#F9F9F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Stats Row */}
        <div className="mb-10 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-xl bg-white p-5 border border-[#EAEAEA] shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
              initial={reduceMotion ? false : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold text-[#111111]">{stat.value}</p>
                </div>
                <span className="material-symbols-outlined text-[20px] text-[#CCCCCC]">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Nav */}
          <aside className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-white'
                    : 'text-[#666666] hover:bg-white hover:text-[#111111]'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${activeTab === tab.id ? 'text-white' : 'text-[#888888]'}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_2px_20px_rgb(0,0,0,0.02)] min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* ── Dashboard ── */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-8"
                >
                  <h2 className="text-lg font-semibold text-[#111111] mb-6">Recent Orders</h2>
                  {loadingOrders ? (
                    <div className="py-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EAEAEA] border-t-[#111111]" /></div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-[#666666]">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between rounded-xl border border-[#EAEAEA] p-4 hover:shadow-sm transition-shadow">
                          <div>
                            <p className="text-sm font-semibold text-[#111111] font-mono">#{order.orderNumber || `ORD-${order.id}`}</p>
                            <p className="text-xs text-[#888888] mt-1">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-sm font-semibold text-[#111111]">฿{Number(order.total || 0).toLocaleString()}</p>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Profile ── */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-8"
                >
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAEAEA]">
                    <h2 className="text-lg font-semibold text-[#111111]">Personal Information</h2>
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="text-sm font-medium text-[#666666] underline hover:text-[#111111] focus-visible:outline-none"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid gap-6 max-w-2xl">
                    <div className="grid grid-cols-3 items-center border-b border-[#EAEAEA] pb-4">
                      <span className="text-sm text-[#666666]">Name</span>
                      <span className="col-span-2 text-sm font-medium text-[#111111]">{user?.name || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center border-b border-[#EAEAEA] pb-4">
                      <span className="text-sm text-[#666666]">Email</span>
                      <span className="col-span-2 text-sm font-medium text-[#111111]">{user?.email || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center border-b border-[#EAEAEA] pb-4">
                      <span className="text-sm text-[#666666]">Phone</span>
                      <span className="col-span-2 text-sm font-medium text-[#111111]">{user?.phone || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center pb-4">
                      <span className="text-sm text-[#666666]">Member since</span>
                      <span className="col-span-2 text-sm font-medium text-[#111111]">{formatDate(user?.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Address ── */}
              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-8"
                >
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAEAEA]">
                    <h2 className="text-lg font-semibold text-[#111111]">Saved Addresses</h2>
                    <button
                      onClick={() => { setEditingAddress({}); setShowAddressModal(true) }}
                      className="text-sm font-medium text-[#111111] flex items-center gap-1 hover:underline focus-visible:outline-none"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span> Add New
                    </button>
                  </div>

                  {loadingAddresses ? (
                    <div className="py-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EAEAEA] border-t-[#111111]" /></div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-[#666666] mb-4">No addresses saved yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {addresses.map((addr, idx) => (
                        <div key={addr.id} className="relative rounded-xl border border-[#EAEAEA] p-5 hover:border-[#CCCCCC] hover:shadow-sm transition-all group">
                          {idx === 0 && (
                            <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-semibold text-[#666666] bg-[#F5F5F5] px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-[#111111] mb-1">{addr.houseNo}</p>
                            <p className="text-xs leading-relaxed text-[#666666] pr-12">{formatAddress(addr)}</p>
                          </div>
                          <button
                            onClick={() => { setEditingAddress(addr); setShowAddressModal(true) }}
                            className="text-xs font-medium text-[#666666] hover:text-[#111111] underline focus-visible:outline-none"
                          >
                            Edit
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Orders ── */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-8"
                >
                  <h2 className="text-lg font-semibold text-[#111111] mb-6 pb-4 border-b border-[#EAEAEA]">Order History</h2>
                  {loadingOrders ? (
                    <div className="py-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EAEAEA] border-t-[#111111]" /></div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-[#666666] mb-4">No orders found.</p>
                      <Link to="/products" className="text-sm font-medium text-[#111111] underline">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#EAEAEA]">
                            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#666666]">Order</th>
                            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#666666]">Date</th>
                            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#666666]">Status</th>
                            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#666666] text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAEAEA]">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-[#F9F9F9] transition-colors">
                              <td className="py-4 px-4 text-sm font-mono text-[#111111]">#{order.orderNumber || `ORD-${order.id}`}</td>
                              <td className="py-4 px-4 text-sm text-[#666666]">{formatDate(order.createdAt)}</td>
                              <td className="py-4 px-4"><StatusBadge status={order.status} /></td>
                              <td className="py-4 px-4 text-sm font-medium text-[#111111] text-right">฿{Number(order.total || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Settings ── */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-8"
                >
                  <h2 className="text-lg font-semibold text-[#111111] mb-6 pb-4 border-b border-[#EAEAEA]">Preferences</h2>
                  <div className="max-w-xl space-y-4">
                    {[
                      { label: 'Email Notifications', desc: 'Receive order updates and offers', enabled: true },
                      { label: 'SMS Notifications', desc: 'Receive delivery updates via SMS', enabled: false },
                    ].map((setting, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[#EAEAEA]">
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{setting.label}</p>
                          <p className="text-xs text-[#666666] mt-0.5">{setting.desc}</p>
                        </div>
                        <button 
                          className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 ${setting.enabled ? 'bg-[#111111]' : 'bg-[#EAEAEA]'}`}
                          aria-label={`Toggle ${setting.label}`}
                        >
                          <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.main>
  )
}

export default ProfilePage
