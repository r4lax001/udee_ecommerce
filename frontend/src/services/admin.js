import api from './api';

import { getLocalOrders } from './orders';

/**
 * Get dashboard statistics for admin overview
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard');
  const data = response.data;
  
  try {
    const localOrders = getLocalOrders() || [];
    let localRevenue = 0;
    
    localOrders.forEach(o => {
      const amountNum = Number(String(o.totals?.total).replace(/[^\d.-]/g, "")) || 0;
      localRevenue += amountNum;
    });

    const mappedRecent = localOrders.map(o => {
      let mappedStatus = 'Pending';
      if (o.status === 'delivered') mappedStatus = 'Completed';
      else if (o.status === 'shipped') mappedStatus = 'Shipped';
      else if (o.status === 'packing') mappedStatus = 'Processing';
      else if (o.status === 'paid') mappedStatus = 'Paid';
      else if (o.status === 'rejected') mappedStatus = 'Cancelled';

      return {
        id: o.orderNumber,
        customer: o.shippingInfo?.name || 'Local User',
        amount: o.totals?.total || '฿0',
        status: mappedStatus,
        date: 'วันนี้',
      };
    });

    if (data.kpi) {
      data.kpi.revenueToday += localRevenue;
      data.kpi.ordersToday += localOrders.length;
    }
    
    if (data.recentOrders) {
      data.recentOrders = [...mappedRecent, ...data.recentOrders].slice(0, 5);
    }
    
    // Calculate local top products
    const productStats = {};
    localOrders.forEach(o => {
      (o.items || []).forEach(item => {
        const title = item.title;
        if (!productStats[title]) {
          productStats[title] = {
            name: title,
            sales: 0,
            revenue: 0,
            image: item.image,
          };
        }
        productStats[title].sales += (item.qty || 1);
        
        const priceNum = Number(String(item.price).replace(/[^\d.-]/g, "")) || 0;
        productStats[title].revenue += priceNum;
      });
    });

    const localTopProducts = Object.values(productStats)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4)
      .map(p => ({
        ...p,
        revenue: `฿${p.revenue.toLocaleString('th-TH')}`
      }));

    if (data.topProducts) {
      data.topProducts = [...localTopProducts, ...data.topProducts].slice(0, 4);
    }

    
    if (data.monthlySales) {
      const currentMonth = new Date().getMonth();
      data.monthlySales[currentMonth] += localRevenue;
    }
  } catch (err) {
    console.error("Failed to merge local orders", err);
  }

  return data;
};

/**
 * Get all users for admin review
 */
export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

/**
 * Update user status (isVerified, isSuspended)
 * @param {number} userId - ID of user to update
 * @param {object} statusData - { isVerified, isSuspended }
 */
export const updateUserStatus = async (userId, statusData) => {
  const response = await api.put(`/admin/users/${userId}/status`, statusData);
  return response.data;
};

/**
 * Get analytics data (sales, orders, products reports)
 */
export const getAnalyticsData = async () => {
  const [salesRes, ordersRes, productsRes] = await Promise.all([
    api.get('/reports/sales?period=monthly'),
    api.get('/reports/orders'),
    api.get('/reports/products'),
  ]);
  return {
    sales: salesRes.data,
    orders: ordersRes.data,
    products: productsRes.data,
  };
};

/**
 * Get all products for admin management
 */
export const getAdminProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

/**
 * Get all orders for admin management
 */
export const getAdminOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

/**
 * Update order status
 * @param {number} orderId - ID of order
 * @param {string} status - New status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};
