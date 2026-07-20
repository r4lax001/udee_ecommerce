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
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
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
    className={`fixed top-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl text-sm font-medium max-w-sm backdrop-blur-xl ${
      type === 'success'
        ? 'bg-gradient-to-r from-[#3D2B1F] to-[#5D4B3F] text-white border border-[#FFC698]/30'
        : 'bg-gradient-to-r from-[#FFDBD6] to-[#FFE5E0] text-[#7F1A18] border border-[#BA1A1A]/30'
    }`}
  >
    <span className="material-symbols-outlined text-lg">
      {type === 'success' ? 'check_circle' : 'error'}
    </span>
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#3D2B1F]">แก้ไขข้อมูลส่วนตัว</h3>
          <button onClick={onClose} className="text-[#81756E] hover:text-[#3D2B1F] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#FFDBD6] px-4 py-3 text-sm text-[#7F1A18]">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#4F453F]">ชื่อ-นามสกุล</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อ-นามสกุล"
              className="w-full rounded-xl border-2 border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition-all focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#4F453F]">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08x-xxx-xxxx"
              className="w-full rounded-xl border-2 border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition-all focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-[#D2C4BC] py-3 text-sm font-semibold text-[#4F453F] hover:bg-[#F8F3EB] transition"
          >
            ยกเลิก
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#3D2B1F] to-[#5D4B3F] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="material-symbols-outlined text-base">refresh</motion.span>
                กำลังบันทึก...
              </span>
            ) : 'บันทึก'}
          </motion.button>
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

  const inputClass = "w-full rounded-xl border-2 border-[#D2C4BC] bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
  const labelClass = "mb-1.5 block text-xs font-semibold text-[#4F453F]"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#3D2B1F]">{address?.id ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}</h3>
          <button onClick={onClose} className="text-[#81756E] hover:text-[#3D2B1F] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#FFDBD6] px-4 py-3 text-sm text-[#7F1A18]">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
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

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border-2 border-[#D2C4BC] py-3 text-sm font-semibold text-[#4F453F] hover:bg-[#F8F3EB] transition">
            ยกเลิก
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#3D2B1F] to-[#5D4B3F] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="material-symbols-outlined text-base">refresh</motion.span>
                กำลังบันทึก...
              </span>
            ) : 'บันทึก'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Order Status Badge ─────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    PENDING:    { label: 'รอดำเนินการ',   cls: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED:  { label: 'ยืนยันแล้ว',     cls: 'bg-blue-100 text-blue-800' },
    PROCESSING: { label: 'กำลังเตรียม',    cls: 'bg-purple-100 text-purple-800' },
    SHIPPED:    { label: 'จัดส่งแล้ว',     cls: 'bg-indigo-100 text-indigo-800' },
    DELIVERED:  { label: 'ส่งถึงแล้ว',     cls: 'bg-green-100 text-green-800' },
    CANCELLED:  { label: 'ยกเลิก',         cls: 'bg-red-100 text-red-800' },
  }
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
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

  // State
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [toast, setToast] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null) // null = closed, {} = new, {id,...} = edit
  const [showAddressModal, setShowAddressModal] = useState(false)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // Load addresses
  useEffect(() => {
    if (!isAuthenticated) return
    setLoadingAddresses(true)
    addressService.getMyAddresses()
      .then((data) => { if (data.success) setAddresses(data.addresses) })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false))
  }, [isAuthenticated])

  // Load orders
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF6F1] px-6 text-[#1D1B1A]">
        <span className="material-symbols-outlined text-6xl text-[#D2C4BC] mb-4">lock</span>
        <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">กรุณาเข้าสู่ระบบก่อน</h2>
        <p className="text-sm text-[#81756E] mb-6 text-center max-w-md">
          คุณต้องเข้าสู่ระบบสมาชิก UDEE เพื่อเข้าถึงข้อมูลส่วนตัว รายการโปรด และประวัติการสั่งซื้อของคุณ
        </p>
        <Link to="/login" className="rounded-xl bg-[#3D2B1F] px-6 py-3 font-semibold text-white hover:opacity-90 active:scale-95 transition">
          เข้าสู่ระบบสมาชิก
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
    { id: 'orders',    label: 'ประวัติการสั่งซื้อ', icon: 'shopping_bag' },
    { id: 'settings',  label: 'การตั้งค่า',    icon: 'settings' },
  ]

  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0)

  const stats = [
    { label: 'ออเดอร์ทั้งหมด', value: orders.length.toString(), icon: 'shopping_cart' },
    { label: 'ส่งถึงแล้ว',    value: deliveredCount.toString(), icon: 'local_shipping' },
    { label: 'ที่อยู่จัดส่ง',  value: addresses.length.toString(), icon: 'location_on' },
    { label: 'ยอดรวมทั้งหมด', value: `฿${totalSpent.toLocaleString()}`, icon: 'payments' },
  ]

  return (
    <motion.main
      className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A]"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showEditProfile && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditProfile(false)}
            onSave={handleProfileSaved}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddressModal && (
          <EditAddressModal
            address={editingAddress}
            onClose={() => { setShowAddressModal(false); setEditingAddress(null) }}
            onSave={handleAddressSaved}
          />
        )}
      </AnimatePresence>

      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Card */}
        <motion.div
          className="mb-10 rounded-[2rem] bg-gradient-to-r from-[#3D2B1F] to-[#5a4e46] p-10 text-white shadow-[0_24px_70px_rgba(61,43,31,0.15)]"
          initial={reduceMotion ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={transition}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <motion.div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/30 bg-white/10 shadow-xl" whileHover={{ scale: 1.05 }}>
              <div className="flex h-full w-full items-center justify-center bg-[#A0724A]/20">
                <span className="material-symbols-outlined text-4xl text-white/80">person</span>
              </div>
            </motion.div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.28em] text-[#F4E7D9]">บัญชีของฉัน</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-semibold">{user?.name || '-'}</h1>
              <p className="mt-1 text-[#E7D7C9]">{user?.email || '-'}</p>
              <p className="mt-1 text-sm text-[#F4E7D9]/80">
                สมาชิกตั้งแต่ {formatDate(user?.createdAt)}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditProfile(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-[#3D2B1F] shadow-lg hover:bg-[#F8F3EB] transition"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              แก้ไขโปรไฟล์
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_30px_rgba(61,43,31,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(61,43,31,0.2)]"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...transition, delay: 0.15 + index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#81756e]">{stat.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-[#3D2B1F]">{stat.value}</p>
                </div>
                <span className="material-symbols-outlined text-4xl text-[#A0724A]/40">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <motion.aside
            className="space-y-6"
            initial={reduceMotion ? false : { x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.2 }}
          >
            <div className="rounded-[2rem] bg-white p-5 shadow-[0_12px_30px_rgba(61,43,31,0.08)]">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? 'bg-[#3D2B1F] text-white'
                        : 'text-[#3D2B1F] hover:bg-[#F8F3EB]'
                    }`}
                    whileHover={{ scale: activeTab !== tab.id ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            className="space-y-8"
            initial={reduceMotion ? false : { x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...transition, delay: 0.25 }}
          >
            <AnimatePresence mode="wait">
              {/* ── Dashboard ── */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">ออเดอร์ล่าสุด</h2>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-10">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="material-symbols-outlined text-3xl text-[#A0724A]">refresh</motion.span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="material-symbols-outlined text-5xl text-[#D2C4BC] block mb-3">shopping_bag</span>
                      <p className="text-[#81756E]">ยังไม่มีออเดอร์</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between rounded-2xl border border-[#E8E1DF] p-5 hover:bg-[#FAF6F1] transition">
                          <div>
                            <p className="font-semibold text-[#3D2B1F]">#{order.orderNumber || `ORD-${order.id}`}</p>
                            <p className="text-sm text-[#81756e] mt-0.5">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1.5">
                            <p className="text-base font-semibold text-[#A0724A]">฿{Number(order.total || 0).toLocaleString()}</p>
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#3D2B1F]">ข้อมูลส่วนตัว</h2>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowEditProfile(true)}
                      className="flex items-center gap-2 rounded-xl border-2 border-[#D2C4BC] px-4 py-2 text-sm font-semibold text-[#3D2B1F] hover:bg-[#F8F3EB] transition"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      แก้ไข
                    </motion.button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'ชื่อ-นามสกุล', value: user?.name, icon: 'badge' },
                      { label: 'อีเมล', value: user?.email, icon: 'email' },
                      { label: 'เบอร์โทรศัพท์', value: user?.phone || '-', icon: 'phone' },
                      { label: 'สถานะบัญชี', value: user?.isVerified ? 'ยืนยันแล้ว ✓' : 'ยังไม่ยืนยัน', icon: 'verified_user' },
                    ].map((field) => (
                      <div key={field.label} className="rounded-2xl bg-[#F8F3EB] p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-base text-[#A0724A]">{field.icon}</span>
                          <p className="text-xs text-[#81756e] font-medium">{field.label}</p>
                        </div>
                        <p className="text-base font-semibold text-[#3D2B1F] mt-1">{field.value || '-'}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl bg-[#F8F3EB] p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-base text-[#A0724A]">calendar_today</span>
                      <p className="text-xs text-[#81756e] font-medium">สมาชิกตั้งแต่</p>
                    </div>
                    <p className="text-base font-semibold text-[#3D2B1F] mt-1">{formatDate(user?.createdAt)}</p>
                  </div>
                </motion.div>
              )}

              {/* ── Address ── */}
              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#3D2B1F]">ที่อยู่จัดส่ง</h2>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setEditingAddress({}); setShowAddressModal(true) }}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3D2B1F] to-[#5D4B3F] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition"
                    >
                      <span className="material-symbols-outlined text-base">add_location_alt</span>
                      เพิ่มที่อยู่
                    </motion.button>
                  </div>

                  {loadingAddresses ? (
                    <div className="flex items-center justify-center py-10">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="material-symbols-outlined text-3xl text-[#A0724A]">refresh</motion.span>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-6xl text-[#D2C4BC] block mb-3">location_off</span>
                      <p className="text-[#81756E] mb-4">ยังไม่มีที่อยู่จัดส่ง</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setEditingAddress({}); setShowAddressModal(true) }}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        เพิ่มที่อยู่จัดส่ง
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr, idx) => (
                        <motion.div
                          key={addr.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative rounded-2xl border-2 border-[#E8E1DF] p-6 hover:border-[#A0724A]/30 transition group"
                        >
                          {idx === 0 && (
                            <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-[#3D2B1F] px-3 py-1 text-xs font-semibold text-white">
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                              ที่อยู่หลัก
                            </span>
                          )}
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-xl text-[#A0724A] mt-0.5">location_on</span>
                            <div className="flex-1 pr-20">
                              <p className="font-semibold text-[#3D2B1F]">{addr.houseNo}</p>
                              <p className="text-sm text-[#81756E] mt-1 leading-relaxed">{formatAddress(addr)}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => { setEditingAddress(addr); setShowAddressModal(true) }}
                              className="flex items-center gap-1.5 rounded-lg border border-[#D2C4BC] px-3 py-1.5 text-xs font-semibold text-[#4F453F] hover:bg-[#F8F3EB] transition"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              แก้ไข
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Orders ── */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">ประวัติการสั่งซื้อ</h2>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-10">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="material-symbols-outlined text-3xl text-[#A0724A]">refresh</motion.span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-6xl text-[#D2C4BC] block mb-3">shopping_bag</span>
                      <p className="text-[#81756E] mb-4">ยังไม่มีประวัติการสั่งซื้อ</p>
                      <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-[#3D2B1F] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
                        <span className="material-symbols-outlined text-base">storefront</span>
                        ไปช็อปปิ้ง
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, idx) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="rounded-2xl border border-[#E8E1DF] p-5 hover:bg-[#FAF6F1] transition"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-[#3D2B1F]">#{order.orderNumber || `ORD-${order.id}`}</p>
                              <p className="text-sm text-[#81756e] mt-0.5">{formatDate(order.createdAt)}</p>
                              {order.items && order.items.length > 0 && (
                                <p className="text-xs text-[#81756E] mt-1.5">
                                  {order.items.length} รายการ
                                </p>
                              )}
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <p className="text-lg font-semibold text-[#A0724A]">฿{Number(order.total || 0).toLocaleString()}</p>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Settings ── */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={transition}
                  className="rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(61,43,31,0.08)]"
                >
                  <h2 className="text-2xl font-semibold text-[#3D2B1F] mb-6">การตั้งค่า</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'การแจ้งเตือนอีเมล', icon: 'notifications', value: 'เปิดใช้งาน' },
                      { label: 'ภาษา', icon: 'language', value: 'ภาษาไทย' },
                      { label: 'ความเป็นส่วนตัว', icon: 'lock', value: 'ส่วนตัว' },
                    ].map((setting) => (
                      <div key={setting.label} className="flex items-center justify-between rounded-2xl bg-[#F8F3EB] px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#A0724A]">{setting.icon}</span>
                          <p className="text-sm font-semibold text-[#3D2B1F]">{setting.label}</p>
                        </div>
                        <span className="text-sm text-[#81756E]">{setting.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}

export default ProfilePage
