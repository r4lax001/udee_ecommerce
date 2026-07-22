import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard, Customers, Analytics, Products, Orders } from './AdminPages';
import Settings from './AdminSettings';
import { useAuth } from '../../contexts/AuthContext';

const GLOBAL_STYLES = `
*{box-sizing:border-box;margin:0;padding:0}
.udee-wrap-root{font-family:'Prompt','Inter',sans-serif}
.udee-wrap-root{
  --pr:#3D2B1F;--ac:#A0724A;--acl:#C8A882;
  --bg:#FAF6F1;--sf:#fff;--sa:#F2EBE2;
  --tx:#2A1F14;--tm:#7A6355;--bd:#DDD0C4;
  --ok:#4A7C59;--er:#B94040;--wa:#C17B2A
}
.wrap{display:flex;min-height:600px;background:var(--bg);border-radius:12px;overflow:hidden;border:1px solid var(--bd)}
.side{width:200px;background:var(--pr);padding:16px 0;flex-shrink:0;display:flex;flex-direction:column}
.side-logo{padding:12px 16px 20px;color:#fff;font-size:18px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:8px;display:flex;align-items:center;gap:8px}
.side-logo span{color:var(--acl)}
.side-logo .admin-badge{background:rgba(200,168,130,0.3);color:var(--acl);font-size:10px;padding:2px 6px;border-radius:10px;font-weight:500}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;color:rgba(255,255,255,0.65);font-size:13px;cursor:pointer;transition:all .15s;border-left:3px solid transparent}
.nav-item i{font-size:17px}
.nav-item:hover{color:#fff;background:rgba(255,255,255,0.08)}
.nav-item.active{color:#fff;background:rgba(200,168,130,0.2);border-left-color:var(--acl)}
.side-bottom{margin-top:auto;padding:12px 0;border-top:1px solid rgba(255,255,255,0.1)}
.main{flex:1;overflow:auto}
.topbar{display:flex;align-items:center;gap:12px;padding:14px 20px;background:var(--sf);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:10}
.topbar-title{font-size:16px;font-weight:600;color:var(--tx);flex:1}
.topbar-breadcrumb{font-size:12px;color:var(--tm)}
.topbar-right{display:flex;align-items:center;gap:8px}
.admin-user-info{display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--bg);border:1px solid var(--bd);border-radius:8px}
.admin-user-info .avatar{width:28px;height:28px;border-radius:50%;background:var(--ac);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
.admin-user-info .name{font-size:12px;font-weight:500;color:var(--tx)}
.icon-btn{width:34px;height:34px;border-radius:8px;background:var(--bg);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--tm)}
.icon-btn:hover{background:var(--sa)}
.content{padding:20px}
.page{display:none}
.page.active{display:block}

/* KPI Cards */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.kpi-card{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:16px;position:relative;overflow:hidden}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:12px 12px 0 0}
.kpi-card.revenue::before{background:var(--ac)}
.kpi-card.orders::before{background:#4A7C59}
.kpi-card.customers::before{background:#2C6FAC}
.kpi-card.stock::before{background:var(--wa)}
.kpi-label{font-size:12px;color:var(--tm);margin-bottom:6px}
.kpi-value{font-size:22px;font-weight:600;color:var(--tx);margin-bottom:4px}
.kpi-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 6px;border-radius:20px}
.kpi-badge.up{background:#EAF3DE;color:#3B6D11}
.kpi-badge.down{background:#FCEBEB;color:#A32D2D}
.kpi-icon{position:absolute;right:14px;top:14px;width:34px;height:34px;border-radius:8px;background:var(--sa);display:flex;align-items:center;justify-content:center;color:var(--ac)}

/* Grid layouts */
.row2{display:grid;grid-template-columns:1fr 340px;gap:12px;margin-bottom:20px}
.card{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:16px}
.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.card-title{font-size:14px;font-weight:600;color:var(--tx)}
.card-sub{font-size:12px;color:var(--tm);margin-top:2px}
.view-all{font-size:12px;color:var(--ac);cursor:pointer;text-decoration:none}
.space-y-4 > * + *{margin-top:16px}

/* Chart */
.chart-area{height:160px;display:flex;align-items:flex-end;gap:6px;padding-bottom:8px;border-bottom:1px solid var(--bd)}
.bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bar{width:100%;border-radius:4px 4px 0 0;transition:opacity .2s;cursor:pointer}
.bar:hover{opacity:.8}
.bar-lbl{font-size:10px;color:var(--tm)}

/* Table */
.udee-wrap-root table{width:100%;border-collapse:collapse;font-size:13px}
.udee-wrap-root th{text-align:left;font-size:11px;color:var(--tm);font-weight:500;padding:6px 8px;border-bottom:1px solid var(--bd);text-transform:uppercase;letter-spacing:.03em}
.udee-wrap-root td{padding:10px 8px;border-bottom:1px solid var(--bd);color:var(--tx);vertical-align:middle}
.udee-wrap-root tr:last-child td{border-bottom:none}
.udee-wrap-root tr:hover td{background:var(--bg)}
.badge{display:inline-flex;align-items:center;font-size:11px;padding:3px 8px;border-radius:20px;font-weight:500}
.badge.done{background:#EAF3DE;color:#3B6D11}
.badge.process{background:#E6F1FB;color:#185FA5}
.badge.pending{background:#FAEEDA;color:#854F0B}
.badge.cancel{background:#FCEBEB;color:#A32D2D}

/* Notifications */
.notif{padding:10px 12px;border-radius:8px;background:var(--sa);margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;cursor:pointer}
.notif:hover{background:var(--bd)}
.notif i{color:var(--ac);font-size:16px;margin-top:1px;flex-shrink:0}
.notif-title{font-size:13px;font-weight:500;color:var(--tx)}
.notif-time{font-size:11px;color:var(--tm);margin-top:2px}

/* Customers / Products page */
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.stat-card{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:16px;text-align:center}
.stat-num{font-size:28px;font-weight:600;color:var(--tx)}
.stat-lbl{font-size:12px;color:var(--tm);margin-top:4px}
.avatar{width:32px;height:32px;border-radius:50%;background:var(--sa);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--ac);flex-shrink:0}
.search-bar{display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--bd);border-radius:8px;padding:8px 12px;margin-bottom:14px}
.search-bar input{border:none;background:transparent;font-size:13px;color:var(--tx);outline:none;flex:1}
.filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.filter-chip{padding:5px 12px;border-radius:20px;font-size:12px;border:1px solid var(--bd);cursor:pointer;color:var(--tm);background:var(--sf)}
.filter-chip.active{background:var(--pr);color:#fff;border-color:var(--pr)}
.tag{display:inline-flex;align-items:center;font-size:11px;padding:2px 8px;border-radius:20px}
.tag.vip{background:rgba(200,168,130,.25);color:#6b4c2a}
.tag.new{background:#E6F1FB;color:#185FA5}
.tag.reg{background:#F2EBE2;color:var(--tm)}

/* Analytics */
.ana-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.progress-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.progress-bar{flex:1;height:6px;background:var(--sa);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;border-radius:3px;background:var(--ac)}
.progress-lbl{font-size:12px;color:var(--tm);min-width:80px}
.progress-val{font-size:12px;font-weight:500;color:var(--tx);min-width:60px;text-align:right}
.donut-wrap{display:flex;align-items:center;gap:16px}
.legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.legend-item{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.legend-lbl{font-size:12px;color:var(--tm)}
.legend-val{font-size:12px;font-weight:500;color:var(--tx);margin-left:auto}

/* Settings */
.settings-grid{display:grid;grid-template-columns:200px 1fr;gap:16px}
.settings-nav{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:8px;height:fit-content}
.settings-nav-item{padding:8px 12px;border-radius:8px;font-size:13px;color:var(--tm);cursor:pointer;display:flex;align-items:center;gap:8px;margin-bottom:2px}
.settings-nav-item:hover{background:var(--bg)}
.settings-nav-item.active{background:var(--sa);color:var(--pr);font-weight:500}
.settings-content{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:20px}
.settings-section{margin-bottom:24px}
.settings-section-title{font-size:14px;font-weight:600;color:var(--tx);margin-bottom:4px}
.settings-section-desc{font-size:12px;color:var(--tm);margin-bottom:16px}
.form-group{margin-bottom:14px}
.form-label{font-size:12px;color:var(--tm);margin-bottom:6px;display:block;font-weight:500}
.form-input{width:100%;border:1px solid var(--bd);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--tx);background:var(--bg);outline:none}
.form-input:focus{border-color:var(--ac)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.toggle{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--bd)}
.toggle:last-child{border-bottom:none}
.toggle-info .toggle-label{font-size:13px;font-weight:500;color:var(--tx)}
.toggle-info .toggle-desc{font-size:12px;color:var(--tm);margin-top:2px}
.switch{width:36px;height:20px;border-radius:20px;position:relative;cursor:pointer;flex-shrink:0}
.switch.on{background:var(--ac)}
.switch.off{background:var(--bd)}
.switch::after{content:'';position:absolute;top:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:left .2s}
.switch.on::after{left:18px}
.switch.off::after{left:2px}
.btn-save{background:var(--pr);color:#fff;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px}
.btn-save:hover{opacity:.9}
.divider{height:1px;background:var(--bd);margin:20px 0}

/* Top5 */
.top5-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--bd)}
.top5-row:last-child{border-bottom:none}
.top5-rank{font-size:13px;font-weight:600;color:var(--tm);min-width:20px}
.top5-img{width:36px;height:36px;border-radius:8px;background:var(--sa);display:flex;align-items:center;justify-content:center}
.top5-name{font-size:13px;color:var(--tx)}
.top5-sales{font-size:12px;color:var(--tm)}
.top5-val{font-size:13px;font-weight:500;color:var(--tx)}

/* Access Denied */
.access-denied{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:var(--bg);gap:16px}
.access-denied h2{font-size:22px;font-weight:600;color:var(--tx)}
.access-denied p{font-size:14px;color:var(--tm)}
.access-denied .btn-login{background:var(--pr);color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:500;cursor:pointer}

/* Role Badge */
.role-badge{font-size:10px;padding:2px 7px;border-radius:10px;font-weight:600;letter-spacing:.04em}
.role-badge.manager{background:rgba(74,124,89,0.3);color:#8FD3A8}
.role-badge.admin{background:rgba(44,111,172,0.3);color:#7EC6F5}
`;

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  products: 'จัดการสินค้า',
  orders: 'จัดการออเดอร์',
  customers: 'ลูกค้า',
  analytics: 'Analytics',
  settings: 'ตั้งค่า',
};

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard', group: 'OVERVIEW' },
  { id: 'products',  icon: 'ti-package',          label: 'Products',  group: 'OVERVIEW' },
  { id: 'orders',    icon: 'ti-shopping-cart',    label: 'Orders',    group: 'OVERVIEW' },
  { id: 'customers', icon: 'ti-users',            label: 'Customers', group: 'INSIGHTS' },
  { id: 'analytics', icon: 'ti-chart-line',       label: 'Analytics', group: 'INSIGHTS' },
  { id: 'settings',  icon: 'ti-settings',         label: 'Settings',  group: 'INSIGHTS' },
];

// ── Role access map ───────────────────────────────────────────────────────────
// Only roles listed here can enter the dashboard; value = allowed page IDs
const ROLE_PERMISSIONS = {
  MANAGER: ['dashboard', 'products', 'orders'],
  ADMIN:   ['customers', 'analytics', 'settings'],
};

// Default landing page per role
const ROLE_DEFAULT_PAGE = {
  MANAGER: 'dashboard',
  ADMIN:   'customers',
};

// Display label & CSS class for role badge
const ROLE_META = {
  MANAGER: { label: 'Manager', cls: 'manager' },
  ADMIN:   { label: 'Admin',   cls: 'admin'   },
};

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // activePage tracks what the user clicked; null means "use role default"
  const [activePage, setActivePage] = useState(null);

  // ── 1. Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="udee-wrap-root">
        <style>{GLOBAL_STYLES}</style>
        <div className="access-denied">
          <i className="ti ti-loader" style={{ fontSize: 32, color: 'var(--ac)' }} aria-hidden="true" />
          <p>กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // ── 2. Not logged in ──────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="udee-wrap-root">
        <style>{GLOBAL_STYLES}</style>
        <div className="access-denied">
          <i className="ti ti-lock" style={{ fontSize: 48, color: 'var(--bd)' }} aria-hidden="true" />
          <h2>กรุณาเข้าสู่ระบบ</h2>
          <p>คุณต้องล็อกอินก่อนเข้าใช้งานส่วนของผู้ดูแลระบบ</p>
          <button className="btn-login" onClick={() => navigate('/login')}>
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // ── 3. Resolve role — strictly AFTER user is confirmed loaded ─────────────
  const roleKey      = user.role?.toUpperCase();      // 'ADMIN' | 'MANAGER' | other
  const allowedPages = ROLE_PERMISSIONS[roleKey];     // undefined → not permitted
  const roleMeta     = ROLE_META[roleKey] ?? { label: roleKey, cls: 'admin' };

  // ── 4. Role not permitted ─────────────────────────────────────────────────
  if (!allowedPages) {
    return (
      <div className="udee-wrap-root">
        <style>{GLOBAL_STYLES}</style>
        <div className="access-denied">
          <i className="ti ti-shield-off" style={{ fontSize: 48, color: '#B94040' }} aria-hidden="true" />
          <h2>ไม่มีสิทธิ์เข้าถึง</h2>
          <p>หน้านี้สำหรับ Manager หรือ Admin เท่านั้น</p>
          <button className="btn-login" onClick={() => navigate('/')}>
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // ── 5. Derive currentPage: use activePage only if allowed, else role default
  const defaultPage = ROLE_DEFAULT_PAGE[roleKey];
  const currentPage = activePage && allowedPages.includes(activePage)
    ? activePage
    : defaultPage;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNav = (pageId) => {
    if (allowedPages.includes(pageId)) setActivePage(pageId);
  };

  return (
    <div className="udee-wrap-root">
      <style>{GLOBAL_STYLES}</style>
      <div className="wrap">

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <div className="side">
          <div className="side-logo">
            U<span>D</span>EE
            <span className={`role-badge ${roleMeta.cls}`}>{roleMeta.label}</span>
          </div>

          {/* Render only groups that have ≥1 page allowed for this role */}
          {['OVERVIEW', 'INSIGHTS'].map((group) => {
            const visibleItems = NAV_ITEMS.filter(
              (item) => item.group === group && allowedPages.includes(item.id)
            );
            if (visibleItems.length === 0) return null;
            return (
              <div key={group}>
                <div style={{
                  padding: '10px 16px 4px',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}>
                  {group}
                </div>
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    className={`nav-item${currentPage === item.id ? ' active' : ''}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <i className={`ti ${item.icon}`} aria-hidden="true" />
                    {item.label}
                  </div>
                ))}
              </div>
            );
          })}

          <div className="side-bottom">
            <div className="nav-item" onClick={() => navigate('/')}>
              <i className="ti ti-home" aria-hidden="true" />หน้าร้านค้า
            </div>
            <div className="nav-item" onClick={handleLogout}>
              <i className="ti ti-logout" aria-hidden="true" />ออกจากระบบ
            </div>
          </div>
        </div>

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="topbar-breadcrumb">{roleMeta.label} › {PAGE_TITLES[currentPage] || currentPage}</div>
              <div className="topbar-title">{PAGE_TITLES[currentPage] || currentPage}</div>
            </div>
            <div className="topbar-right">
              <div className="admin-user-info">
                <div className="avatar">{user.name?.charAt(0)?.toUpperCase() || 'A'}</div>
                <div className="name">{user.name}</div>
                <span className={`role-badge ${roleMeta.cls}`}>{roleMeta.label}</span>
              </div>
            </div>
          </div>

          <div className="content">
            {/* Only render pages this role is allowed to access — others never mount */}
            {allowedPages.includes('dashboard') && (
              <div className={`page${currentPage === 'dashboard' ? ' active' : ''}`}>
                <Dashboard />
              </div>
            )}
            {allowedPages.includes('products') && (
              <div className={`page${currentPage === 'products' ? ' active' : ''}`}>
                <Products />
              </div>
            )}
            {allowedPages.includes('orders') && (
              <div className={`page${currentPage === 'orders' ? ' active' : ''}`}>
                <Orders />
              </div>
            )}
            {allowedPages.includes('customers') && (
              <div className={`page${currentPage === 'customers' ? ' active' : ''}`}>
                <Customers />
              </div>
            )}
            {allowedPages.includes('analytics') && (
              <div className={`page${currentPage === 'analytics' ? ' active' : ''}`}>
                <Analytics />
              </div>
            )}
            {allowedPages.includes('settings') && (
              <div className={`page${currentPage === 'settings' ? ' active' : ''}`}>
                <Settings />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
